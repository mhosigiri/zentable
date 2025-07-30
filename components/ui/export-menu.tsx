import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileImage, Presentation, Loader2, Check } from 'lucide-react';
import { exportToPDF, exportToPowerPoint, exportAsImages } from '@/lib/export-new';
import { toast } from 'sonner';

interface ExportMenuProps {
  presentationId: string;
  disabled?: boolean;
}

export function ExportMenu({ presentationId, disabled = false }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [exportFormat, setExportFormat] = useState<string>('');

  const handleExport = async (format: 'pdf' | 'pptx' | 'images') => {
    setIsExporting(true);
    setExportFormat(format);
    setExportProgress('Initializing export...');

    try {
      const exportFunctions = {
        pdf: exportToPDF,
        pptx: exportToPowerPoint,
        images: exportAsImages
      };

      await exportFunctions[format](presentationId, (message) => {
        setExportProgress(message);
      });

      toast.success(`Successfully exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(`Failed to export as ${format.toUpperCase()}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
      setExportProgress('');
      setExportFormat('');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="secondary" 
          size="sm" 
          disabled={disabled || isExporting}
          className="gap-2"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {exportProgress || 'Exporting...'}
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Export
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export presentation</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => handleExport('pdf')}
          disabled={isExporting}
          className="gap-2"
        >
          <FileText className="w-4 h-4" />
          <span>Export to PDF</span>
          {exportFormat === 'pdf' && isExporting && (
            <Loader2 className="w-3 h-3 animate-spin ml-auto" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleExport('pptx')}
          disabled={isExporting}
          className="gap-2"
        >
          <Presentation className="w-4 h-4" />
          <span>Export to PowerPoint</span>
          {exportFormat === 'pptx' && isExporting && (
            <Loader2 className="w-3 h-3 animate-spin ml-auto" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleExport('images')}
          disabled={isExporting}
          className="gap-2"
        >
          <FileImage className="w-4 h-4" />
          <span>Export as PNGs</span>
          {exportFormat === 'images' && isExporting && (
            <Loader2 className="w-3 h-3 animate-spin ml-auto" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}