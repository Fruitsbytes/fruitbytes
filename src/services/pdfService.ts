import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
   * Generate PDF from HTML content
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

      // Convert HTML to canvas
      const canvas = await html2canvas(container, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // Remove temporary container
      document.body.removeChild(container);

      // Create PDF
      const pdf = new jsPDF({
        orientation: pdfOptions.orientation,
        unit: pdfOptions.unit,
        format: pdfOptions.format,
        compress: pdfOptions.compress,
      });

      // Calculate dimensions
      const imgWidth = pdfOptions.format === 'a4' ? 210 : 216; // A4 or Letter width in mm
      const pageHeight = pdfOptions.format === 'a4' ? 297 : 279; // A4 or Letter height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Add image to PDF
      const imgData = canvas.toDataURL('image/png');
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Add metadata
      pdf.setProperties({
        title: `Resume - ${metadata.role}`,
        subject: `Resume for ${metadata.role} position`,
        author: 'Your Name',
        keywords: metadata.role,
        creator: 'FruitsBytes Portfolio',
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
    container.style.width = '210mm'; // A4 width
    container.style.padding = '20mm';
    container.style.backgroundColor = '#ffffff';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '11pt';
    container.style.lineHeight = '1.6';
    container.style.color = '#000000';

    // Apply print-friendly styles
    container.innerHTML = this.applyPrintStyles(html);

    return container;
  }

  /**
   * Apply print-friendly styles to HTML
   */
  private applyPrintStyles(html: string): string {
    // Wrap content in styled div
    return `
      <style>
        * {
          box-sizing: border-box;
        }
        h1 {
          font-size: 24pt;
          margin: 0 0 10px 0;
          color: #000000;
          font-weight: bold;
        }
        h2 {
          font-size: 16pt;
          margin: 20px 0 10px 0;
          color: #333333;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 5px;
        }
        h3 {
          font-size: 14pt;
          margin: 15px 0 8px 0;
          color: #444444;
          font-weight: bold;
        }
        p {
          margin: 8px 0;
          text-align: justify;
        }
        ul, ol {
          margin: 8px 0;
          padding-left: 25px;
        }
        li {
          margin: 4px 0;
        }
        strong {
          font-weight: bold;
          color: #000000;
        }
        em {
          font-style: italic;
        }
        a {
          color: #2563eb;
          text-decoration: none;
        }
        hr {
          border: none;
          border-top: 1px solid #cccccc;
          margin: 15px 0;
        }
        code {
          background-color: #f5f5f5;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 10pt;
        }
        pre {
          background-color: #f5f5f5;
          padding: 10px;
          border-radius: 5px;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          font-size: 10pt;
        }
        blockquote {
          border-left: 3px solid #2563eb;
          padding-left: 15px;
          margin: 10px 0;
          color: #555555;
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
