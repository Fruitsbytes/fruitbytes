import jsPDF from 'jspdf';
import { PDFOptions, ResumeMetadata } from '../interfaces/resume';

export class PDFService {
  private static _instance: PDFService;

  private constructor() {}

  public static instance(): PDFService {
    if (!PDFService._instance) {
      PDFService._instance = new PDFService();
    }
    return PDFService._instance;
  }

  /**
   * Generate PDF from HTML content using jsPDF's html method
   * This creates a proper text-based PDF that is parseable by ATS systems
   */
  public async generatePDF(html: string, metadata: ResumeMetadata, options?: PDFOptions): Promise<Blob> {
    const pdfOptions: PDFOptions = options || {
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    };

    try {
      // Create temporary container for rendering
      const container = this.createTemporaryContainer(html);
      document.body.appendChild(container);

      // Wait for fonts and styles to load
      await this.waitForRender();

      // Create PDF with jsPDF
      const pdf = new jsPDF({
        orientation: pdfOptions.orientation,
        unit: pdfOptions.unit,
        format: pdfOptions.format,
        compress: pdfOptions.compress,
      });

      // Add metadata
      pdf.setProperties({
        title: `Resume - ${metadata.role}`,
        subject: `Resume for ${metadata.role} position`,
        author: 'Your Name',
        keywords: metadata.role,
        creator: 'FruitsBytes Portfolio',
      });

      // Use jsPDF's html method to convert HTML to PDF with proper text
      await pdf.html(container, {
        callback: () => {
          // Cleanup after PDF generation
          document.body.removeChild(container);
        },
        x: 15,
        y: 15,
        width: 180, // Content width in mm (A4 width - margins)
        windowWidth: 800, // Virtual window width for HTML rendering
        margin: [15, 15, 15, 15], // [top, right, bottom, left] in mm
        autoPaging: 'text', // Enable automatic page breaks
        html2canvas: {
          scale: 0.25, // Lower scale for text rendering
          logging: false,
        },
      });

      // Return as blob
      return pdf.output('blob');
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  /**
   * Create temporary container with styled HTML
   */
  private createTemporaryContainer(html: string): HTMLDivElement {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '800px'; // Virtual window width
    container.style.backgroundColor = '#ffffff';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '12px';
    container.style.lineHeight = '1.5';
    container.style.color = '#000000';

    // Apply print-friendly styles
    container.innerHTML = this.applyPrintStyles(html);

    return container;
  }

  /**
   * Apply print-friendly styles to HTML
   */
  private applyPrintStyles(html: string): string {
    // Wrap content in styled div with clean, professional formatting
    return `
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body, div {
          font-family: Arial, Helvetica, sans-serif;
          color: #000000;
          line-height: 1.4;
        }
        h1 {
          font-size: 22px;
          margin: 0 0 12px 0;
          color: #000000;
          font-weight: bold;
          page-break-after: avoid;
        }
        h2 {
          font-size: 16px;
          margin: 18px 0 10px 0;
          color: #1a1a1a;
          font-weight: bold;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 4px;
          page-break-after: avoid;
        }
        h3 {
          font-size: 14px;
          margin: 14px 0 8px 0;
          color: #333333;
          font-weight: bold;
          page-break-after: avoid;
        }
        p {
          margin: 6px 0;
          font-size: 11px;
          line-height: 1.5;
        }
        ul, ol {
          margin: 8px 0 8px 20px;
          padding: 0;
        }
        li {
          margin: 3px 0;
          font-size: 11px;
          line-height: 1.4;
        }
        strong, b {
          font-weight: bold;
          color: #000000;
        }
        em, i {
          font-style: italic;
        }
        a {
          color: #2563eb;
          text-decoration: none;
        }
        hr {
          border: none;
          border-top: 1px solid #cccccc;
          margin: 12px 0;
          page-break-after: avoid;
        }
        code {
          background-color: #f0f0f0;
          padding: 1px 3px;
          font-family: 'Courier New', Courier, monospace;
          font-size: 10px;
        }
        pre {
          background-color: #f5f5f5;
          padding: 8px;
          font-family: 'Courier New', Courier, monospace;
          font-size: 10px;
          white-space: pre-wrap;
          page-break-inside: avoid;
        }
        blockquote {
          border-left: 3px solid #2563eb;
          padding-left: 12px;
          margin: 8px 0;
          color: #555555;
        }
        /* Page break control */
        .page-break {
          page-break-after: always;
        }
        .avoid-break {
          page-break-inside: avoid;
        }
      </style>
      <div>${html}</div>
    `;
  }

  /**
   * Wait for styles and fonts to load
   */
  private async waitForRender(): Promise<void> {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        setTimeout(resolve, 100);
      });
    });
  }

  /**
   * Download PDF file
   */
  public downloadPDF(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Preview PDF in new tab
   */
  public previewPDF(blob: Blob): void {
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    // Note: URL is not revoked here so the preview can load
  }

  /**
   * Generate filename for PDF
   */
  public generateFilename(role: string, language: string): string {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const roleName = role.replace(/\s+/g, '-');
    return `CV_${roleName}_${language}_${date}.pdf`;
  }
}
