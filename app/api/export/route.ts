import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Daytona } from '@daytonaio/sdk';
import { themes } from '@/lib/themes';

// Force Node.js runtime to use Buffer
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { format, presentationId } = await req.json();

    if (!format || !presentationId) {
      return NextResponse.json(
        { error: 'Missing format or presentationId' }, 
        { status: 400 }
      );
    }

    // Validate format
    const validFormats = ['pdf', 'pptx', 'images'];
    if (!validFormats.includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Use: pdf, pptx, or images' },
        { status: 400 }
      );
    }

    // Fetch presentation data - first try by ID, then by document_id if it's not a UUID
    let presentation = null;
    let fetchError = null;

    // Check if presentationId is a valid UUID format
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(presentationId);
    
    // Try to fetch by database ID
    const result = await supabase
      .from('presentations')
      .select(`
        *,
        slides (*)
      `)
      .eq('id', presentationId)
      .eq('user_id', user.id)
      .single();
    
    presentation = result.data;
    fetchError = result.error;

    if (fetchError || !presentation) {
      console.error('Presentation fetch error:', fetchError);
      return NextResponse.json(
        { error: `Presentation not found for ID: ${presentationId}` },
        { status: 404 }
      );
    }

    // Get theme details
    const theme = themes.find(t => t.id === presentation.theme_id) || themes[0];

    // Prepare data for export
    const exportData = {
      title: presentation.title,
      slides: presentation.slides.sort((a: any, b: any) => a.position - b.position),
      theme: {
        ...theme,
        backgroundColor: theme.background?.includes('gradient') 
          ? extractColorFromGradient(theme.background) 
          : theme.background,
        textColor: theme.text,
        background: theme.background
      },
      // For PDF/Image export, we'll need to generate HTML/CSS
      htmlContent: '',
      cssContent: ''
    };

    // Generate HTML content for PDF/Image export
    if (format === 'pdf' || format === 'images') {
      const { html, css } = await generateHTMLContent(presentation, theme);
      exportData.htmlContent = html;
      exportData.cssContent = css;
    }

    // Initialize Daytona
    const daytona = new Daytona({
      apiKey: process.env.DAYTONA_API_KEY,
      apiUrl: process.env.DAYTONA_API_URL
    });

    // Get the appropriate container ID - try V2 first, then fallback
    const containerIdKeyV2 = `${format.toUpperCase()}_EXPORT_CONTAINER_ID_V2`;
    const containerIdKey = `${format.toUpperCase()}_EXPORT_CONTAINER_ID`;
    const containerId = process.env[containerIdKeyV2] || process.env[containerIdKey];

    if (!containerId) {
      return NextResponse.json(
        { error: `Export container not configured for ${format}` },
        { status: 500 }
      );
    }

    // Find the container
    const sandbox = await daytona.findOne({ id: containerId });
    if (!sandbox) {
      return NextResponse.json(
        { error: 'Export container not found' },
        { status: 500 }
      );
    }

    // Check if container is already started, if not start it
    let wasAlreadyStarted = false;
    try {
      // Get the current state of the sandbox
      console.log(`Container ${containerId} state:`, sandbox.state);
      
      if (sandbox.state === 'Started') {
        wasAlreadyStarted = true;
        console.log('Container already started');
      } else if (sandbox.state === 'Stopped') {
        console.log('Starting stopped container...');
        await sandbox.start();
        // Wait a moment for container to fully start
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        console.log(`Container state: ${sandbox.state}, attempting to start...`);
        await sandbox.start();
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error('Error checking/starting container:', error);
      try {
        // Force start if state check fails
        console.log('Attempting force start...');
        await sandbox.start();
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (startError) {
        console.error('Failed to start container:', startError);
        return NextResponse.json(
          { error: `Failed to start export container: ${startError.message}` },
          { status: 500 }
        );
      }
    }

    try {
      // Upload presentation data
      const presentationJson = JSON.stringify(exportData, null, 2);
      console.log('Uploading presentation data...');
      
      // Try multiple approaches to upload the file
      try {
        // First try: Use uploadFile like tersa
        await sandbox.fs.uploadFile(
          Buffer.from(presentationJson, 'utf-8'),
          '/tmp/presentation.json'
        );
        console.log('File uploaded using uploadFile method');
      } catch (uploadError) {
        console.log('uploadFile failed, trying shell command approach...');
        // Fallback: Use shell commands to write the file
        const escapedJson = presentationJson.replace(/'/g, "'\\''");
        const writeCommand = `echo '${escapedJson}' > /tmp/presentation.json`;
        const writeResult = await sandbox.process.executeCommand(writeCommand);
        
        if (writeResult.exitCode !== 0) {
          // Try base64 approach as final fallback
          console.log('Echo failed, trying base64 approach...');
          const base64Data = Buffer.from(presentationJson).toString('base64');
          const base64Command = `echo '${base64Data}' | base64 -d > /tmp/presentation.json`;
          const base64Result = await sandbox.process.executeCommand(base64Command);
          
          if (base64Result.exitCode !== 0) {
            throw new Error(`Failed to write presentation data: ${base64Result.result}`);
          }
        }
        console.log('File written using shell command');
      }
      
      console.log('Presentation data uploaded successfully');

      // Check if script exists, if not write it
      const scriptName = `export-${format === 'images' ? 'images' : format}.js`;
      const scriptPath = `/app/${scriptName}`;
      
      // Check if script is empty or missing
      const checkScript = await sandbox.process.executeCommand(
        `if [ -s ${scriptPath} ]; then echo "exists"; else echo "empty"; fi`
      );
      
      if (checkScript.result.trim() === 'empty') {
        console.log(`Script ${scriptName} is empty, writing it...`);
        
        // Get script content
        const fs = require('fs').promises;
        const path = require('path');
        const scriptContent = await fs.readFile(
          path.join(process.cwd(), 'scripts', 'export-scripts', scriptName),
          'utf-8'
        );
        
        // Write script using heredoc
        const writeScriptCmd = `cat > ${scriptPath} << 'SCRIPTEOF'
${scriptContent}
SCRIPTEOF`;
        
        const writeResult = await sandbox.process.executeCommand(writeScriptCmd);
        if (writeResult.exitCode !== 0) {
          throw new Error(`Failed to write script: ${writeResult.result}`);
        }
        
        console.log(`Script ${scriptName} written successfully`);
      } else {
        console.log(`Using existing script: ${scriptName}`);
      }
      
      // Also check and write export-styles.css if needed
      const checkStyles = await sandbox.process.executeCommand(
        `if [ -s /app/export-styles.css ]; then echo "exists"; else echo "empty"; fi`
      );
      
      if (checkStyles.result.trim() === 'empty') {
        console.log('Writing export-styles.css...');
        
        const fs = require('fs').promises;
        const path = require('path');
        const stylesContent = await fs.readFile(
          path.join(process.cwd(), 'scripts', 'export-styles.css'),
          'utf-8'
        );
        
        const writeStylesCmd = `cat > /app/export-styles.css << 'STYLESEOF'
${stylesContent}
STYLESEOF`;
        
        const writeStylesResult = await sandbox.process.executeCommand(writeStylesCmd);
        if (writeStylesResult.exitCode !== 0) {
          throw new Error(`Failed to write styles: ${writeStylesResult.result}`);
        }
        
        console.log('export-styles.css written successfully');
      }

      // Execute the export script
      console.log(`Executing ${format} export...`);
      const result = await sandbox.process.executeCommand(
        `cd /app && node ${scriptName} 2>&1`
      );

      console.log('Script output:', result.result);
      console.log('Script exit code:', result.exitCode);

      if (result.exitCode !== 0) {
        console.error('Export script error:', result.result);
        throw new Error(`Export failed: ${result.result}`);
      }
      
      // Check if output file was created
      try {
        const checkFile = await sandbox.process.executeCommand(
          `ls -la /tmp/output.* 2>&1`
        );
        console.log('Output files:', checkFile.result);
      } catch (e) {
        console.error('Failed to check output files');
      }

      // Download the result
      const outputFile = format === 'images' ? '/tmp/output.zip' : `/tmp/output.${format}`;
      let outputBuffer;
      
      try {
        outputBuffer = await sandbox.fs.downloadFile(outputFile);
      } catch (downloadError: any) {
        // Try to get more debug info
        const debugInfo = await sandbox.process.executeCommand(
          `ls -la /tmp/ && ls -la /app/ && pwd`
        );
        console.error('Download failed. Debug info:', debugInfo.result);
        console.error('Download error:', downloadError);
        throw new Error(`Failed to download output file: ${outputFile}. The export script may have failed.`);
      }

      // Clean up temporary files
      try {
        console.log('Cleaning up temporary files...');
        await sandbox.fs.deleteFile('/tmp/presentation.json');
        await sandbox.fs.deleteFile(outputFile);
        console.log('Cleanup completed successfully');
      } catch (cleanupError) {
        console.warn('Cleanup error (non-critical):', cleanupError);
      }

      // Return the file
      const mimeTypes: Record<string, string> = {
        pdf: 'application/pdf',
        pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        images: 'application/zip'
      };

      const fileExtensions: Record<string, string> = {
        pdf: 'pdf',
        pptx: 'pptx',
        images: 'zip'
      };

      return new Response(outputBuffer, {
        headers: {
          'Content-Type': mimeTypes[format],
          'Content-Disposition': `attachment; filename="${presentation.title || 'presentation'}.${fileExtensions[format]}"`,
          'Content-Length': outputBuffer.length.toString()
        }
      });

    } finally {
      // Only stop the container if we started it
      if (!wasAlreadyStarted) {
        try {
          await sandbox.stop();
        } catch (error) {
          console.warn('Failed to stop container:', error);
        }
      }
    }

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Export failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper function to extract color from gradient
function extractColorFromGradient(gradient: string): string {
  const match = gradient.match(/#[0-9a-fA-F]{6}/);
  return match ? match[0] : '#ffffff';
}

// Helper function to generate HTML/CSS content
async function generateHTMLContent(presentation: any, theme: any) {
  // Read the comprehensive export styles
  const fs = require('fs').promises;
  const path = require('path');
  const exportStyles = await fs.readFile(
    path.join(process.cwd(), 'scripts', 'export-styles.css'), 
    'utf-8'
  );
  
  // Import slide components dynamically
  const slideComponents: Record<string, any> = {};
  const componentFiles = [
    'TitleSlide',
    'TitleWithBulletsAndImage',
    'TextWithImage',
    'ImageWithText',
    'BulletsOnly',
    'Comparison',
    'Quote',
    'TitleAndContent',
    'FullScreenImage',
    'ThreeColumns',
    'Timeline',
    'ProcessFlow',
    'ChartSlide',
    'TeamSlide',
    'ContactSlide',
    'Statistics',
    'IconGrid',
    'SectionDivider'
  ];

  // Build HTML for each slide
  let html = '';
  const slides = presentation.slides.sort((a: any, b: any) => a.position - b.position);

  for (const slide of slides) {
    const slideHtml = await renderSlideToHTML(slide, theme);
    // Wrap each slide with proper theme styling
    const themeClass = theme.category === 'solid' && 
      (theme.id.includes('midnight') || theme.id.includes('ruby') || theme.id.includes('emerald')) 
      ? 'dark' : 'light';
    
    html += `
      <div class="slide-container gradient-${theme.id}" style="background: ${theme.background};">
        <div class="slide-wrapper ${themeClass}">
          ${slideHtml}
        </div>
      </div>
    `;
  }

  // Use the comprehensive export styles
  const css = exportStyles + `
    /* Theme-specific overrides */
    .slide-container {
      color: ${theme.text || '#000000'};
    }
    
    h1, h2, h3 {
      color: ${theme.primary || theme.text || '#000000'};
    }
    
    ul li::before {
      color: ${theme.accent || theme.primary || theme.text || '#000000'};
    }
    
    .stat-number {
      color: ${theme.accent || theme.primary || theme.text || '#000000'};
    }
    
    .icon-item .icon {
      background: ${theme.iconBackground || theme.accent || theme.primary || '#3b82f6'};
    }
  `;

  return { html, css };
}

// Helper function to render slide to HTML based on template
async function renderSlideToHTML(slide: any, theme: any): Promise<string> {
  const { template_type, content, title, bullet_points, image_url } = slide;

  // Handle content - if it's already HTML, use it directly, otherwise try to parse as JSON
  let data: any = {};
  
  if (typeof content === 'string') {
    // Check if content looks like HTML (starts with < or contains HTML tags)
    if (content.trim().startsWith('<') || content.includes('<')) {
      // Content is already HTML, create a data object from slide fields
      data = {
        title: title || '',
        content: content,
        bullets: bullet_points || [],
        imageUrl: image_url || ''
      };
    } else {
      // Try to parse as JSON
      try {
        data = JSON.parse(content);
      } catch (error) {
        // If parsing fails, treat as plain text
        data = {
          title: title || '',
          content: content,
          bullets: bullet_points || [],
          imageUrl: image_url || ''
        };
      }
    }
  } else {
    data = content || {};
  }

  // Use template_type from database
  const template = template_type;

  switch (template) {
    case 'title-slide':
      return `
        <div class="title-slide">
          <h1>${data.title || ''}</h1>
          ${data.subtitle ? `<p class="subtitle">${data.subtitle}</p>` : ''}
        </div>
      `;

    case 'title-bullets-image':
      // Handle bullets - could be array of objects or strings
      const bullets = data.bullets || data.bullet_points || [];
      const bulletItems = Array.isArray(bullets) 
        ? bullets.map((bullet: any) => {
            if (typeof bullet === 'string') return bullet;
            return bullet.text || bullet.content || String(bullet);
          })
        : [];

      return `
        <div class="title-bullets-image">
          <div class="content-section">
            <h1>${data.title || ''}</h1>
            <ul>
              ${bulletItems.map((bulletText: string) => 
                `<li>${bulletText}</li>`
              ).join('')}
            </ul>
          </div>
          <div class="image-section">
            <div class="image-container">
              ${data.imageUrl || data.image_url ? `<img src="${data.imageUrl || data.image_url}" alt="${data.title || 'Slide image'}">` : ''}
            </div>
          </div>
        </div>
      `;

    case 'text-image':
      return `
        <div class="content-grid">
          <div>
            <h2>${data.title || ''}</h2>
            <p>${data.content || ''}</p>
          </div>
          <div class="image-container">
            ${data.imageUrl ? `<img src="${data.imageUrl}" alt="${data.title || 'Slide image'}">` : ''}
          </div>
        </div>
      `;

    case 'image-text':
      return `
        <div class="content-grid">
          <div class="image-container">
            ${data.imageUrl ? `<img src="${data.imageUrl}" alt="${data.title || 'Slide image'}">` : ''}
          </div>
          <div>
            <h2>${data.title || ''}</h2>
            <p>${data.content || ''}</p>
          </div>
        </div>
      `;

    case 'bullets':
      // Handle bullets - could be array of objects or strings
      const bulletsOnly = data.bullets || data.bullet_points || [];
      const bulletItemsOnly = Array.isArray(bulletsOnly) 
        ? bulletsOnly.map((bullet: any) => {
            if (typeof bullet === 'string') return bullet;
            return bullet.text || bullet.content || String(bullet);
          })
        : [];

      return `
        <div>
          <h2>${data.title || ''}</h2>
          <ul class="bullets">
            ${bulletItemsOnly.map((bulletText: string) => 
              `<li>${bulletText}</li>`
            ).join('')}
          </ul>
        </div>
      `;

    case 'comparison':
      return `
        <div>
          <h2>${data.title || ''}</h2>
          <div class="comparison-grid">
            <div class="comparison-column">
              <h3>${data.leftColumn?.title || ''}</h3>
              <ul class="bullets">
                ${(data.leftColumn?.items || []).map((item: string) => 
                  `<li>${item}</li>`
                ).join('')}
              </ul>
            </div>
            <div class="comparison-column">
              <h3>${data.rightColumn?.title || ''}</h3>
              <ul class="bullets">
                ${(data.rightColumn?.items || []).map((item: string) => 
                  `<li>${item}</li>`
                ).join('')}
              </ul>
            </div>
          </div>
        </div>
      `;

    case 'quote':
      return `
        <div class="quote-slide">
          <p class="quote-text">"${data.quote || ''}"</p>
          ${data.author ? `<p class="quote-author">— ${data.author}</p>` : ''}
        </div>
      `;

    case 'full-screen-image':
      return `
        <div class="full-screen-image">
          ${data.imageUrl ? `<img src="${data.imageUrl}" alt="${data.title || 'Full screen image'}">` : ''}
          ${data.title ? `<h2 style="position: absolute; bottom: 80px; left: 80px; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">${data.title}</h2>` : ''}
        </div>
      `;

    case 'three-columns':
      return `
        <div>
          <h2>${data.title || ''}</h2>
          <div class="three-columns">
            ${(data.columns || []).map((column: any) => `
              <div>
                <h3>${column.title || ''}</h3>
                <p>${column.content || ''}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;

    case 'statistics':
      return `
        <div>
          <h2>${data.title || ''}</h2>
          <div class="stats-grid">
            ${(data.stats || []).map((stat: any) => `
              <div class="stat-item">
                <div class="stat-number">${stat.number || ''}</div>
                <div class="stat-label">${stat.label || ''}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

    case 'icon-grid':
      return `
        <div>
          <h2>${data.title || ''}</h2>
          <div class="icon-grid">
            ${(data.items || []).map((item: any) => `
              <div class="icon-item">
                <div class="icon">${item.icon || '📌'}</div>
                <h3>${item.title || ''}</h3>
                <p>${item.description || ''}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;

    default:
      // Default layout
      return `
        <div>
          <h2>${data.title || ''}</h2>
          <p>${data.content || ''}</p>
        </div>
      `;
  }
}

