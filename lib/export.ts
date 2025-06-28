import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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

    const slideElements = document.querySelectorAll('.slide-for-pdf');

    if (slideElements.length === 0) {
      // If no slides with the specific class are found, try rendering to canvas manually
      for (let i = 0; i < slides.length; i++) {
        // Create temporary slide renderer
        const slideContainer = document.createElement('div');
        slideContainer.style.width = '1600px';
        slideContainer.style.height = '900px';
        slideContainer.style.position = 'absolute';
        slideContainer.style.left = '-9999px';
        slideContainer.className = 'slide-temp-render';
        document.body.appendChild(slideContainer);

        // Render slide (this is a placeholder; actual rendering logic may vary)
        // You may want to render your SlideRenderer component here if possible
        // For now, just fill with white
        const slideElement = document.createElement('div');
        slideElement.className = 'bg-white w-full h-full';
        slideContainer.appendChild(slideElement);

        await new Promise(resolve => requestAnimationFrame(resolve));

        const canvas = await html2canvas(slideContainer, {
          scale: 1,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.92);
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, 1600, 900);
        document.body.removeChild(slideContainer);
      }
    } else {
      // Use existing slide elements
      for (let i = 0; i < slideElements.length; i++) {
        const slideElement = slideElements[i] as HTMLElement;
        const canvas = await html2canvas(slideElement, {
          scale: 1,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.92);
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, 1600, 900);
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