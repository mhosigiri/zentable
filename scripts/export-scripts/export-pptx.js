const PptxGenJS = require('/app/node_modules/pptxgenjs');
const fs = require('fs').promises;
const fetch = require('/app/node_modules/node-fetch');
const Jimp = require('/app/node_modules/jimp');

async function exportToPowerPoint() {
  try {
    // Read the presentation data
    const presentationData = JSON.parse(
      await fs.readFile('/tmp/presentation.json', 'utf-8')
    );

    const { slides, theme, title } = presentationData;

    // Create a new presentation
    const pptx = new PptxGenJS();

    // Set presentation properties
    pptx.author = 'Cursor for Slides';
    pptx.subject = title || 'Presentation';
    pptx.title = title || 'Presentation';

    // Define slide master with theme colors
    pptx.defineSlideMaster({
      title: 'MASTER',
      background: { color: theme.backgroundColor || 'FFFFFF' },
      margin: [0.5, 0.5, 0.5, 0.5]
    });

    // Process each slide
    for (const slide of slides) {
      const pptSlide = pptx.addSlide({ masterName: 'MASTER' });

      // Apply background gradient if exists
      if (theme.background && theme.background.includes('gradient')) {
        // PowerPoint doesn't support CSS gradients directly
        // We'll use a solid color fallback
        const bgColor = theme.backgroundColor || 'FFFFFF';
        pptSlide.background = { color: bgColor };
      } else if (theme.backgroundColor) {
        pptSlide.background = { color: theme.backgroundColor.replace('#', '') };
      }

      // Add slide content based on template type
      switch (slide.template) {
        case 'title-slide':
          await addTitleSlide(pptSlide, slide, theme);
          break;
        case 'title-bullets-image':
          await addTitleBulletsImageSlide(pptSlide, slide, theme);
          break;
        case 'text-image':
          await addTextImageSlide(pptSlide, slide, theme);
          break;
        case 'image-text':
          await addImageTextSlide(pptSlide, slide, theme);
          break;
        case 'bullets':
          await addBulletsSlide(pptSlide, slide, theme);
          break;
        case 'comparison':
          await addComparisonSlide(pptSlide, slide, theme);
          break;
        case 'quote':
          await addQuoteSlide(pptSlide, slide, theme);
          break;
        default:
          await addDefaultSlide(pptSlide, slide, theme);
      }
    }

    // Save the presentation
    await pptx.writeFile({ fileName: '/tmp/output.pptx' });

    console.log('PowerPoint generated successfully');
  } catch (error) {
    console.error('Error generating PowerPoint:', error);
    process.exit(1);
  }
}

async function addTitleSlide(slide, data, theme) {
  const textColor = theme.textColor?.replace('#', '') || '000000';
  
  // Add title
  if (data.title) {
    slide.addText(data.title, {
      x: 0.5,
      y: 2.5,
      w: 9,
      h: 1.5,
      fontSize: 48,
      bold: true,
      color: textColor,
      align: 'center',
      valign: 'middle'
    });
  }

  // Add subtitle
  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: 0.5,
      y: 4.5,
      w: 9,
      h: 1,
      fontSize: 24,
      color: textColor,
      align: 'center',
      valign: 'middle'
    });
  }
}

async function addTitleBulletsImageSlide(slide, data, theme) {
  const textColor = theme.textColor?.replace('#', '') || '000000';
  
  // Add title
  if (data.title) {
    slide.addText(data.title, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1,
      fontSize: 36,
      bold: true,
      color: textColor
    });
  }

  // Add bullets (left side)
  if (data.bullets && data.bullets.length > 0) {
    const bulletText = data.bullets.map(b => ({
      text: b.text || b,
      options: { bullet: true, fontSize: 18, color: textColor }
    }));

    slide.addText(bulletText, {
      x: 0.5,
      y: 1.8,
      w: 4.5,
      h: 4.5,
      valign: 'top'
    });
  }

  // Add image (right side)
  if (data.imageUrl) {
    try {
      const imagePath = await downloadImage(data.imageUrl);
      slide.addImage({
        path: imagePath,
        x: 5.5,
        y: 1.8,
        w: 4,
        h: 4.5,
        sizing: { type: 'contain' }
      });
    } catch (error) {
      console.error('Error adding image:', error);
    }
  }
}

async function addTextImageSlide(slide, data, theme) {
  const textColor = theme.textColor?.replace('#', '') || '000000';
  
  // Add title
  if (data.title) {
    slide.addText(data.title, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1,
      fontSize: 36,
      bold: true,
      color: textColor
    });
  }

  // Add text content (left side)
  if (data.content) {
    slide.addText(data.content, {
      x: 0.5,
      y: 1.8,
      w: 4.5,
      h: 4.5,
      fontSize: 16,
      color: textColor,
      valign: 'top'
    });
  }

  // Add image (right side)
  if (data.imageUrl) {
    try {
      const imagePath = await downloadImage(data.imageUrl);
      slide.addImage({
        path: imagePath,
        x: 5.5,
        y: 1.8,
        w: 4,
        h: 4.5,
        sizing: { type: 'contain' }
      });
    } catch (error) {
      console.error('Error adding image:', error);
    }
  }
}

async function addImageTextSlide(slide, data, theme) {
  const textColor = theme.textColor?.replace('#', '') || '000000';
  
  // Add title
  if (data.title) {
    slide.addText(data.title, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1,
      fontSize: 36,
      bold: true,
      color: textColor
    });
  }

  // Add image (left side)
  if (data.imageUrl) {
    try {
      const imagePath = await downloadImage(data.imageUrl);
      slide.addImage({
        path: imagePath,
        x: 0.5,
        y: 1.8,
        w: 4,
        h: 4.5,
        sizing: { type: 'contain' }
      });
    } catch (error) {
      console.error('Error adding image:', error);
    }
  }

  // Add text content (right side)
  if (data.content) {
    slide.addText(data.content, {
      x: 5.5,
      y: 1.8,
      w: 4,
      h: 4.5,
      fontSize: 16,
      color: textColor,
      valign: 'top'
    });
  }
}

async function addBulletsSlide(slide, data, theme) {
  const textColor = theme.textColor?.replace('#', '') || '000000';
  
  // Add title
  if (data.title) {
    slide.addText(data.title, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1,
      fontSize: 36,
      bold: true,
      color: textColor
    });
  }

  // Add bullets
  if (data.bullets && data.bullets.length > 0) {
    const bulletText = data.bullets.map(b => ({
      text: b.text || b,
      options: { bullet: true, fontSize: 20, color: textColor }
    }));

    slide.addText(bulletText, {
      x: 0.5,
      y: 1.8,
      w: 9,
      h: 5,
      valign: 'top'
    });
  }
}

async function addComparisonSlide(slide, data, theme) {
  const textColor = theme.textColor?.replace('#', '') || '000000';
  
  // Add title
  if (data.title) {
    slide.addText(data.title, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1,
      fontSize: 36,
      bold: true,
      color: textColor
    });
  }

  // Add left column
  if (data.leftColumn) {
    slide.addText(data.leftColumn.title || '', {
      x: 0.5,
      y: 1.8,
      w: 4,
      h: 0.8,
      fontSize: 24,
      bold: true,
      color: textColor
    });

    if (data.leftColumn.items) {
      const leftItems = data.leftColumn.items.map(item => ({
        text: item,
        options: { bullet: true, fontSize: 16, color: textColor }
      }));

      slide.addText(leftItems, {
        x: 0.5,
        y: 2.8,
        w: 4,
        h: 3.5,
        valign: 'top'
      });
    }
  }

  // Add right column
  if (data.rightColumn) {
    slide.addText(data.rightColumn.title || '', {
      x: 5.5,
      y: 1.8,
      w: 4,
      h: 0.8,
      fontSize: 24,
      bold: true,
      color: textColor
    });

    if (data.rightColumn.items) {
      const rightItems = data.rightColumn.items.map(item => ({
        text: item,
        options: { bullet: true, fontSize: 16, color: textColor }
      }));

      slide.addText(rightItems, {
        x: 5.5,
        y: 2.8,
        w: 4,
        h: 3.5,
        valign: 'top'
      });
    }
  }
}

async function addQuoteSlide(slide, data, theme) {
  const textColor = theme.textColor?.replace('#', '') || '000000';
  
  // Add quote
  if (data.quote) {
    slide.addText(`"${data.quote}"`, {
      x: 1,
      y: 2,
      w: 8,
      h: 2.5,
      fontSize: 28,
      italic: true,
      color: textColor,
      align: 'center',
      valign: 'middle'
    });
  }

  // Add author
  if (data.author) {
    slide.addText(`— ${data.author}`, {
      x: 1,
      y: 4.5,
      w: 8,
      h: 1,
      fontSize: 20,
      color: textColor,
      align: 'center'
    });
  }
}

async function addDefaultSlide(slide, data, theme) {
  const textColor = theme.textColor?.replace('#', '') || '000000';
  
  // Add title
  if (data.title) {
    slide.addText(data.title, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1,
      fontSize: 36,
      bold: true,
      color: textColor
    });
  }

  // Add content
  if (data.content) {
    slide.addText(data.content, {
      x: 0.5,
      y: 1.8,
      w: 9,
      h: 5,
      fontSize: 18,
      color: textColor,
      valign: 'top'
    });
  }
}

async function downloadImage(url) {
  try {
    const response = await fetch(url);
    const buffer = await response.buffer();
    const imagePath = `/tmp/image_${Date.now()}.jpg`;
    
    // Process with Jimp to ensure compatibility
    const image = await Jimp.read(buffer);
    await image.writeAsync(imagePath);
    
    return imagePath;
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
}

exportToPowerPoint();