import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { PDFOptions, ResumeMetadata } from '../interfaces/resume';

// Initialize pdfMake with fonts
(pdfMake as any).vfs = pdfFonts;

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
   * Generate PDF from HTML content using pdfMake
   * This creates a proper text-based PDF that is fully parseable by ATS systems
   */
  public async generatePDF(html: string, metadata: ResumeMetadata, _options?: PDFOptions): Promise<Blob> {
    try {
      // Convert HTML to pdfMake document definition
      const content = this.htmlToPdfMakeContent(html);

      // Define document
      const docDefinition: any = {
        info: {
          title: `Resume - ${metadata.role}`,
          author: 'Your Name',
          subject: `Resume for ${metadata.role} position`,
          keywords: metadata.role,
          creator: 'FruitsBytes Portfolio',
        },
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        content,
        defaultStyle: {
          font: 'Roboto',
          fontSize: 11,
          lineHeight: 1.3,
        },
        styles: {
          h1: {
            fontSize: 24,
            bold: true,
            color: '#000000',
            margin: [0, 0, 0, 12] as [number, number, number, number],
          },
          h2: {
            fontSize: 16,
            bold: true,
            color: '#1a1a1a',
            margin: [0, 18, 0, 10] as [number, number, number, number],
            decoration: 'underline',
            decorationColor: '#2563eb',
          },
          h3: {
            fontSize: 14,
            bold: true,
            color: '#333333',
            margin: [0, 14, 0, 8] as [number, number, number, number],
          },
          paragraph: {
            margin: [0, 6, 0, 6] as [number, number, number, number],
            alignment: 'left' as const,
          },
          link: {
            color: '#2563eb',
            decoration: 'none',
          },
          code: {
            font: 'Courier',
            fontSize: 10,
            background: '#f0f0f0',
          },
        },
      };

      // Generate PDF
      return new Promise((resolve) => {
        const pdfDocGenerator = pdfMake.createPdf(docDefinition);
        pdfDocGenerator.getBlob((blob: Blob) => {
          resolve(blob);
        });
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  /**
   * Convert HTML string to pdfMake content array
   */
  private htmlToPdfMakeContent(html: string): any[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const body = doc.body;

    return this.processNode(body);
  }

  /**
   * Process DOM node and convert to pdfMake content
   */
  private processNode(node: Node): any[] {
    const content: any[] = [];

    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent?.trim();
        if (text) {
          content.push({ text, preserveLeadingSpaces: true });
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const element = child as HTMLElement;
        const tagName = element.tagName.toLowerCase();

        switch (tagName) {
          case 'h1':
            content.push({
              text: element.textContent,
              style: 'h1',
            });
            break;

          case 'h2':
            content.push({
              text: element.textContent,
              style: 'h2',
            });
            break;

          case 'h3':
            content.push({
              text: element.textContent,
              style: 'h3',
            });
            break;

          case 'p':
            const pContent = this.processInlineElements(element);
            if (pContent.length > 0) {
              content.push({
                text: pContent,
                style: 'paragraph',
              });
            }
            break;

          case 'ul':
          case 'ol':
            const listItems: any[] = [];
            element.querySelectorAll('li').forEach((li) => {
              const liContent = this.processInlineElements(li);
              if (liContent.length > 0 || typeof liContent === 'string') {
                listItems.push(liContent);
              }
            });
            if (listItems.length > 0) {
              content.push({
                [tagName]: listItems,
                margin: [0, 8, 0, 8] as [number, number, number, number],
              });
            }
            break;

          case 'hr':
            content.push({
              canvas: [
                {
                  type: 'line',
                  x1: 0,
                  y1: 0,
                  x2: 515,
                  y2: 0,
                  lineWidth: 1,
                  lineColor: '#cccccc',
                },
              ],
              margin: [0, 12, 0, 12] as [number, number, number, number],
            });
            break;

          case 'blockquote':
            const quoteContent = this.processInlineElements(element);
            content.push({
              stack: [
                {
                  text: quoteContent,
                  color: '#555555',
                  italics: true,
                },
              ],
              margin: [12, 8, 0, 8] as [number, number, number, number],
            });
            break;

          case 'pre':
          case 'code':
            content.push({
              text: element.textContent,
              style: 'code',
              margin: [0, 8, 0, 8] as [number, number, number, number],
            });
            break;

          case 'br':
            content.push({ text: '\n' });
            break;

          case 'strong':
          case 'b':
          case 'em':
          case 'i':
          case 'a':
            // These are handled in processInlineElements
            break;

          default:
            // Recursively process other elements
            const children = this.processNode(element);
            if (children.length > 0) {
              content.push(...children);
            }
        }
      }
    });

    return content;
  }

  /**
   * Process inline elements (bold, italic, links, etc.)
   */
  private processInlineElements(element: HTMLElement): any {
    const result: any[] = [];

    element.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent || '';
        if (text) {
          result.push(text);
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        const tagName = el.tagName.toLowerCase();
        const innerText = el.textContent || '';

        switch (tagName) {
          case 'strong':
          case 'b':
            result.push({ text: innerText, bold: true });
            break;

          case 'em':
          case 'i':
            result.push({ text: innerText, italics: true });
            break;

          case 'a':
            result.push({
              text: innerText,
              link: el.getAttribute('href') || '',
              style: 'link',
              decoration: 'underline',
            });
            break;

          case 'code':
            result.push({
              text: innerText,
              style: 'code',
            });
            break;

          case 'br':
            result.push('\n');
            break;

          default:
            // Recursively process nested inline elements
            const nested = this.processInlineElements(el);
            if (Array.isArray(nested)) {
              result.push(...nested);
            } else {
              result.push(nested);
            }
        }
      }
    });

    return result.length === 1 ? result[0] : result;
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
