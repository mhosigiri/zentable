import { Daytona, Image } from '@daytonaio/sdk';
import * as fs from 'fs/promises';
import * as path from 'path';

async function setupExportContainersV2() {
  const daytona = new Daytona({
    apiKey: process.env.DAYTONA_API_KEY,
    apiUrl: process.env.DAYTONA_API_URL
  });

  console.log('Setting up export containers V2 with pre-baked scripts...');

  // Read the export scripts and styles
  const pdfScript = await fs.readFile(
    path.join(process.cwd(), 'scripts', 'export-scripts', 'export-pdf.js'), 
    'utf-8'
  );
  const pptxScript = await fs.readFile(
    path.join(process.cwd(), 'scripts', 'export-scripts', 'export-pptx.js'), 
    'utf-8'
  );
  const imagesScript = await fs.readFile(
    path.join(process.cwd(), 'scripts', 'export-scripts', 'export-images.js'), 
    'utf-8'
  );
  const exportStyles = await fs.readFile(
    path.join(process.cwd(), 'scripts', 'export-styles.css'), 
    'utf-8'
  );

  // PDF Export Container - with script baked in
  console.log('1. Creating PDF export container with pre-baked script...');
  const pdfImage = Image.debianSlim('3.12')
    .runCommands(
      'apt-get update && apt-get install -y chromium chromium-sandbox fonts-liberation fonts-noto-color-emoji libnss3 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libgbm1 libasound2 nodejs npm',
      'rm -rf /root/.npm && mkdir -p /app && cd /app && npm init -y && npm install puppeteer pdf-lib',
      `cat > /app/export-pdf.js << 'EOFMARKER'
${pdfScript}
EOFMARKER`,
      'chmod +x /app/export-pdf.js',
      `cat > /app/export-styles.css << 'EOF'
${exportStyles}
EOF`,
      'ls -la /app/'
    )
    .env({
      NODE_ENV: 'production',
      PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: 'true',
      PUPPETEER_EXECUTABLE_PATH: '/usr/bin/chromium'
    });

  const pdfSandbox = await daytona.create(
    { image: pdfImage },
    { timeout: 600, onSnapshotCreateLogs: console.log }
  );

  console.log('PDF Export Container ID:', pdfSandbox.id);

  // PowerPoint Export Container - with script baked in
  console.log('2. Creating PowerPoint export container with pre-baked script...');
  const pptxImage = Image.debianSlim('3.12')
    .runCommands(
      'apt-get update && apt-get install -y nodejs npm',
      'rm -rf /root/.npm && mkdir -p /app && cd /app && npm init -y && npm install pptxgenjs jimp node-fetch',
      `cat > /app/export-pptx.js << 'EOF'
${pptxScript}
EOF`,
      'chmod +x /app/export-pptx.js',
      'ls -la /app/'
    )
    .env({ NODE_ENV: 'production' });

  const pptxSandbox = await daytona.create(
    { image: pptxImage },
    { timeout: 600, onSnapshotCreateLogs: console.log }
  );

  console.log('PowerPoint Export Container ID:', pptxSandbox.id);

  // Image Export Container - with script baked in
  console.log('3. Creating Image export container with pre-baked script...');
  const imageImage = Image.debianSlim('3.12')
    .runCommands(
      'apt-get update && apt-get install -y chromium chromium-sandbox fonts-liberation fonts-noto-color-emoji libnss3 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libgbm1 libasound2 nodejs npm',
      'rm -rf /root/.npm && mkdir -p /app && cd /app && npm init -y && npm install playwright sharp archiver',
      `cat > /app/export-images.js << 'EOF'
${imagesScript}
EOF`,
      'chmod +x /app/export-images.js',
      'ls -la /app/'
    )
    .env({
      NODE_ENV: 'production',
      PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: '1'
    });

  const imageSandbox = await daytona.create(
    { image: imageImage },
    { timeout: 600, onSnapshotCreateLogs: console.log }
  );

  console.log('Image Export Container ID:', imageSandbox.id);

  console.log('\nExport containers V2 setup complete!');
  console.log('\nAdd these to your .env.local:');
  console.log(`PDF_EXPORT_CONTAINER_ID_V2=${pdfSandbox.id}`);
  console.log(`PPTX_EXPORT_CONTAINER_ID_V2=${pptxSandbox.id}`);
  console.log(`IMAGE_EXPORT_CONTAINER_ID_V2=${imageSandbox.id}`);

  return {
    pdfContainerId: pdfSandbox.id,
    pptxContainerId: pptxSandbox.id,
    imageContainerId: imageSandbox.id
  };
}

setupExportContainersV2().catch(console.error);