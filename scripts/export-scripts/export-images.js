const { chromium } = require('/app/node_modules/playwright');
const sharp = require('/app/node_modules/sharp');
const archiver = require('/app/node_modules/archiver');
const fs = require('fs').promises;
const path = require('path');

async function exportToImages() {
  try {
    // Read the presentation data
    const presentationData = JSON.parse(
      await fs.readFile('/tmp/presentation.json', 'utf-8')
    );

    const { slides, theme, htmlContent, cssContent, title } = presentationData;

    // Launch Playwright with Chromium
    const browser = await chromium.launch({
      executablePath: '/usr/bin/chromium',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-extensions',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ],
      headless: true
    });

    const page = await browser.newPage();

    // Set viewport to 16:9 aspect ratio with high DPI
    await page.setViewportSize({
      width: 1920,
      height: 1080
    });

    // Create output directory
    const outputDir = '/tmp/slide-images';
    await fs.mkdir(outputDir, { recursive: true });

    // Process each slide individually
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      console.log(`Processing slide ${i + 1} of ${slides.length}`);

      // Create HTML for individual slide with exact styling
      const slideHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              ${cssContent}
              
              body {
                margin: 0;
                padding: 0;
                width: 1920px;
                height: 1080px;
                overflow: hidden;
              }
              
              .slide-container {
                width: 1920px;
                height: 1080px;
                position: relative;
                overflow: hidden;
              }
            </style>
          </head>
          <body>
            <div class="slide-container" data-slide-index="${i}">
              ${slide.htmlContent || ''}
            </div>
          </body>
        </html>
      `;

      // Set content
      await page.setContent(slideHtml, {
        waitUntil: ['networkidle', 'domcontentloaded']
      });

      // Wait for all images to load
      await page.evaluate(() => {
        return Promise.all(
          Array.from(document.images)
            .filter(img => !img.complete)
            .map(img => new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
            }))
        );
      });

      // Additional wait for CSS animations/transitions
      await page.waitForTimeout(500);

      // Take screenshot with high quality
      const screenshotBuffer = await page.screenshot({
        type: 'png',
        fullPage: false,
        clip: {
          x: 0,
          y: 0,
          width: 1920,
          height: 1080
        }
      });

      // Optimize image with sharp
      const optimizedBuffer = await sharp(screenshotBuffer)
        .png({
          quality: 95,
          compressionLevel: 9
        })
        .toBuffer();

      // Save individual image
      const slideNumber = String(i + 1).padStart(3, '0');
      const imagePath = path.join(outputDir, `slide-${slideNumber}.png`);
      await fs.writeFile(imagePath, optimizedBuffer);

      // Also create a high-quality JPEG version
      const jpegBuffer = await sharp(screenshotBuffer)
        .jpeg({
          quality: 95,
          chromaSubsampling: '4:4:4'
        })
        .toBuffer();

      const jpegPath = path.join(outputDir, `slide-${slideNumber}.jpg`);
      await fs.writeFile(jpegPath, jpegBuffer);
    }

    await browser.close();

    // Create ZIP archive
    const zipPath = '/tmp/output.zip';
    const output = require('fs').createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    output.on('close', () => {
      console.log(`ZIP archive created: ${archive.pointer()} bytes`);
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);

    // Add all images to ZIP
    const files = await fs.readdir(outputDir);
    for (const file of files) {
      const filePath = path.join(outputDir, file);
      archive.file(filePath, { name: file });
    }

    // Add a manifest file with slide information
    const manifest = {
      title: title || 'Presentation',
      totalSlides: slides.length,
      exportDate: new Date().toISOString(),
      theme: theme,
      slides: slides.map((slide, index) => ({
        number: index + 1,
        title: slide.title || `Slide ${index + 1}`,
        template: slide.template,
        files: [
          `slide-${String(index + 1).padStart(3, '0')}.png`,
          `slide-${String(index + 1).padStart(3, '0')}.jpg`
        ]
      }))
    };

    archive.append(JSON.stringify(manifest, null, 2), { name: 'manifest.json' });

    await archive.finalize();

    console.log('Images exported successfully');
  } catch (error) {
    console.error('Error generating images:', error);
    process.exit(1);
  }
}

exportToImages();