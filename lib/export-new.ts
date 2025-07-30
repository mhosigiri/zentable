export type ExportFormat = 'pdf' | 'pptx' | 'images';

interface ExportOptions {
  format: ExportFormat;
  presentationId: string;
  onProgress?: (message: string) => void;
}

/**
 * Export presentation using containerized export service
 */
export async function exportPresentation({
  format,
  presentationId,
  onProgress
}: ExportOptions): Promise<void> {
  try {
    onProgress?.('Preparing export...');

    const response = await fetch('/api/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        format,
        presentationId
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Export failed');
    }

    onProgress?.('Downloading file...');

    // Get the filename from Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition');
    const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
    const filename = filenameMatch?.[1] || `presentation.${format === 'images' ? 'zip' : format}`;

    // Download the file
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    onProgress?.('Export complete!');
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
}

/**
 * Export to PDF with exact styling
 */
export async function exportToPDF(presentationId: string, onProgress?: (message: string) => void) {
  return exportPresentation({ format: 'pdf', presentationId, onProgress });
}

/**
 * Export to PowerPoint
 */
export async function exportToPowerPoint(presentationId: string, onProgress?: (message: string) => void) {
  return exportPresentation({ format: 'pptx', presentationId, onProgress });
}

/**
 * Export as PNG images (ZIP)
 */
export async function exportAsImages(presentationId: string, onProgress?: (message: string) => void) {
  return exportPresentation({ format: 'images', presentationId, onProgress });
}