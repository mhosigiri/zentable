import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { themes } from '@/lib/themes';

/**
 * Exports the given slides as a PDF file.
 * @param slides Array of slide data
 * @param documentData Document metadata (for title, etc.)
 * @param setIsPdfGenerating Optional callback to set loading state
 */
export async function exportSlidesToPDF(slides: any[], documentData: any, setIsPdfGenerating?: (val: boolean) => void) {
  if (slides.length === 0) return;

  if (setIsPdfGenerating) setIsPdfGenerating(true);

  try {
    // Create PDF with 16:9 aspect ratio
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1600, 900],
    });

    // Look for slide elements with the specific class, or fall back to data attribute
    let slideElements = document.querySelectorAll('.slide-for-pdf');
    
    if (slideElements.length === 0) {
      // Fallback: look for elements with data-slide-index attribute
      slideElements = document.querySelectorAll('[data-slide-index]');
    }

    if (slideElements.length > 0) {
      // Get theme for proper background rendering
      const currentTheme = documentData?.theme ? themes.find(t => t.id === documentData.theme) : themes[0];
      
      // Use existing slide elements from the DOM
      for (let i = 0; i < slideElements.length; i++) {
        const slideElement = slideElements[i] as HTMLElement;
        
        // Create a temporary container with theme background for PDF export
        const exportContainer = document.createElement('div');
        exportContainer.style.position = 'absolute';
        exportContainer.style.left = '-9999px';
        exportContainer.style.width = '1600px';
        exportContainer.style.height = '900px';
        exportContainer.style.overflow = 'hidden';
        
        // Apply theme background
        if (currentTheme?.background) {
          exportContainer.style.background = currentTheme.background;
        }
        
        // Center the slide within the container
        exportContainer.style.display = 'flex';
        exportContainer.style.alignItems = 'center';
        exportContainer.style.justifyContent = 'center';
        exportContainer.style.padding = '40px';
        
        // Clone the slide element
        const slideClone = slideElement.cloneNode(true) as HTMLElement;
        
        // Set the slide to be 95% of the container's width, maintaining aspect ratio
        slideClone.style.width = '95%';
        slideClone.style.height = 'auto';
        slideClone.style.aspectRatio = '16 / 9';
        // Reset any transforms from the main page view
        slideClone.style.transform = 'none';
        
        exportContainer.appendChild(slideClone);
        document.body.appendChild(exportContainer);
        
        // Wait for styles to apply and ensure all CSS is loaded
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Force a repaint to ensure all styles are applied
        exportContainer.offsetHeight;
        
        const canvas = await html2canvas(exportContainer, {
          scale: 1,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          width: 1600,
          height: 900,
          ignoreElements: (element) => {
            // Skip any overlay elements that might interfere
            return element.classList.contains('drag-overlay') || 
                   element.classList.contains('drag-handle') ||
                   element.hasAttribute('data-radix-popper-content-wrapper');
          },
        });
        
        // Clean up
        document.body.removeChild(exportContainer);
        
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, 1600, 900);
      }
    } else {
      // Last resort fallback
      console.warn('No slide elements found for PDF export');
      for (let i = 0; i < slides.length; i++) {
        if (i > 0) pdf.addPage();
        // Add a placeholder page
        pdf.setFontSize(24);
        pdf.text(`Slide ${i + 1}`, 800, 450, { align: 'center' });
        pdf.setFontSize(16);
        pdf.text('Content could not be rendered', 800, 500, { align: 'center' });
      }
    }

    // Save the PDF
    const title = documentData?.outline?.title || 'presentation';
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    pdf.save(`${safeTitle}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    if (setIsPdfGenerating) setIsPdfGenerating(false);
  }
} 