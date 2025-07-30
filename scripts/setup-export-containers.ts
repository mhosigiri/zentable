import { Daytona, Image } from '@daytonaio/sdk';

async function setupExportContainers() {
  const daytona = new Daytona({
    apiKey: process.env.DAYTONA_API_KEY,
    apiUrl: process.env.DAYTONA_API_URL
  });

  console.log('Setting up export containers...');

  // PDF Export Container - with Puppeteer and Chrome
  console.log('1. Creating PDF export container...');
  const pdfImage = Image.debianSlim('3.12')
    .runCommands(
        'apt-get update && apt-get install -y chromium chromium-sandbox fonts-liberation fonts-noto-color-emoji libnss3 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libgbm1 libasound2 nodejs npm',
        'rm -rf /root/.npm && mkdir -p /app && cd /app && npm init -y && npm install puppeteer pdf-lib && ls -la node_modules'
    )
    .env({
        NODE_ENV: 'production',
        PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: 'true',
        PUPPETEER_EXECUTABLE_PATH: '/usr/bin/chromium'
    });

  const pdfSandbox = await daytona.create(
    {
        image: pdfImage,
    },
    {
        timeout: 600,
        onSnapshotCreateLogs: console.log
    }
  );

  console.log('PDF Export Container ID:', pdfSandbox.id);

  // PowerPoint Export Container
  console.log('2. Creating PowerPoint export container...');
  const pptxImage = Image.debianSlim('3.12')
    .runCommands(
        'apt-get update && apt-get install -y nodejs npm',
        'rm -rf /root/.npm && mkdir -p /app && cd /app && npm init -y && npm install pptxgenjs jimp node-fetch && ls -la node_modules'
    )
    .env({ NODE_ENV: 'production' });

  const pptxSandbox = await daytona.create(
    {
        image: pptxImage,

    },
    {
        timeout: 600,
        onSnapshotCreateLogs: console.log
    }
  );

  console.log('PowerPoint Export Container ID:', pptxSandbox.id);

  // Image Export Container - with Playwright
  console.log('3. Creating Image export container...');
  const imageImage = Image.debianSlim('3.12')
    .runCommands(
        'apt-get update && apt-get install -y chromium chromium-sandbox fonts-liberation fonts-noto-color-emoji libnss3 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libgbm1 libasound2 nodejs npm',
        'rm -rf /root/.npm && mkdir -p /app && cd /app && npm init -y && npm install playwright sharp archiver && ls -la node_modules'
    )
    .env({
        NODE_ENV: 'production',
        PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: '1'
    });

  const imageSandbox = await daytona.create(
    {
        image: imageImage,

    },
    {
        timeout: 600,
        onSnapshotCreateLogs: console.log
    }
  );

  console.log('Image Export Container ID:', imageSandbox.id);

  // Upload export scripts to each container
  console.log('\nUploading export scripts...');

  // Note: We'll create these scripts next
  const scripts = [
    { sandbox: pdfSandbox, file: 'export-pdf.js' },
    { sandbox: pptxSandbox, file: 'export-pptx.js' },
    { sandbox: imageSandbox, file: 'export-images.js' }
  ];

  for (const { sandbox, file } of scripts) {
    console.log(`Uploading ${file} to container ${sandbox.id}...`);
    // Scripts will be uploaded after we create them
  }

  console.log('\nExport containers setup complete!');
  console.log('\nAdd these to your .env.local:');
  console.log(`PDF_EXPORT_CONTAINER_ID=${pdfSandbox.id}`);
  console.log(`PPTX_EXPORT_CONTAINER_ID=${pptxSandbox.id}`);
  console.log(`IMAGE_EXPORT_CONTAINER_ID=${imageSandbox.id}`);

  return {
    pdfContainerId: pdfSandbox.id,
    pptxContainerId: pptxSandbox.id,
    imageContainerId: imageSandbox.id
  };
}

setupExportContainers().catch(console.error);