const puppeteer = require('/app/node_modules/puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function exportToPDF() {
  try {
    // Read the presentation data
    const presentationData = JSON.parse(
      await fs.readFile('/tmp/presentation.json', 'utf-8')
    );

    const { slides, theme, htmlContent, cssContent } = presentationData;

    // Launch Puppeteer with specific args for container environment
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-extensions'
      ],
      headless: true
    });

    const page = await browser.newPage();

    // Set viewport to 16:9 aspect ratio
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2 // Higher quality
    });

    // Create HTML with exact styling from the app
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            ${cssContent}
            
            /* Ensure page breaks between slides */
            .slide-container {
              page-break-after: always;
              page-break-inside: avoid;
              width: 1920px;
              height: 1080px;
              position: relative;
              overflow: hidden;
            }
            
            /* Remove any print-specific overrides */
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              .slide-container {
                width: 1920px !important;
                height: 1080px !important;
              }
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;

    // Set content
    await page.setContent(html, {
      waitUntil: ['networkidle0', 'domcontentloaded']
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

    // Additional wait for CSS animations/transitions to complete
    await page.waitForTimeout(1000);

    // Generate PDF with exact dimensions
    await page.pdf({
      path: '/tmp/output.pdf',
      width: '1920px',
      height: '1080px',
      printBackground: true,
      preferCSSPageSize: false,
      displayHeaderFooter: false,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    });

    await browser.close();

    console.log('PDF generated successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    process.exit(1);
  }
}

exportToPDF();