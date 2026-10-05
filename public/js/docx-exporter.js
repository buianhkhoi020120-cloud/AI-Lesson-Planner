/**
 * DOCX Exporter Module using docx.js (Client-side)
 * Converts Markdown Lesson Plan content to a beautifully formatted Word Document (.docx)
 * conforming to Công văn 7991 standards.
 */

window.DocxExporter = (function () {

  /**
   * Helper to parse bold text **bold** inside a string into docx TextRuns
   */
  function parseFormattedText(text, defaultOptions = {}) {
    const runs = [];
    const parts = text.split(/(\*\*.*?\*\*)/g);

    parts.forEach(part => {
      if (!part) return;

      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        const cleanContent = part.substring(2, part.length - 2);
        runs.push(new docx.TextRun({
          text: cleanContent,
          bold: true,
          font: 'Times New Roman',
          size: defaultOptions.size || 26, // 13pt
          color: defaultOptions.color || '1E293B',
        }));
      } else {
        runs.push(new docx.TextRun({
          text: part,
          bold: defaultOptions.bold || false,
          italic: defaultOptions.italic || false,
          font: 'Times New Roman',
          size: defaultOptions.size || 26,
          color: defaultOptions.color || '334155',
        }));
      }
    });

    return runs;
  }

  /**
   * Main export function
   * @param {string} markdownText - The lesson plan markdown text
   * @param {string} filename - Filename for saved file
   */
  async function exportToDocx(markdownText, filename = 'Ke_Hoach_Bai_Day.docx') {
    if (!window.docx) {
      throw new Error('Thư viện docx chưa sẵn sàng!');
    }

    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = window.docx;

    const paragraphs = [];
    const lines = markdownText.split('\n');

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        // Empty space paragraph
        paragraphs.push(new Paragraph({
          spacing: { after: 120 }
        }));
        return;
      }

      // Main Title #
      if (trimmed.startsWith('# ')) {
        paragraphs.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 180 },
          children: [
            new TextRun({
              text: trimmed.replace(/^#\s+/, '').toUpperCase(),
              bold: true,
              size: 32, // 16pt
              font: 'Times New Roman',
              color: '0F172A'
            })
          ]
        }));
        return;
      }

      // Section Header ###
      if (trimmed.startsWith('### ')) {
        const titleText = trimmed.replace(/^###\s+/, '');
        paragraphs.push(new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 300, after: 140 },
          border: {
            bottom: { color: '2563EB', space: 4, style: BorderStyle.SINGLE, size: 12 }
          },
          children: [
            new TextRun({
              text: titleText,
              bold: true,
              size: 28, // 14pt
              font: 'Times New Roman',
              color: '1E3A8A'
            })
          ]
        }));
        return;
      }

      // Sub Section Header ####
      if (trimmed.startsWith('#### ')) {
        const subTitleText = trimmed.replace(/^####\s+/, '');
        paragraphs.push(new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: subTitleText,
              bold: true,
              size: 26, // 13pt
              font: 'Times New Roman',
              color: '2563EB'
            })
          ]
        }));
        return;
      }

      // Horizontal separator ---
      if (trimmed === '---') {
        paragraphs.push(new Paragraph({
          spacing: { before: 120, after: 120 },
          border: {
            bottom: { color: 'CBD5E1', space: 1, style: BorderStyle.SINGLE, size: 6 }
          }
        }));
        return;
      }

      // Bullet List item (- or *)
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const bulletText = trimmed.replace(/^[-*]\s+/, '');
        paragraphs.push(new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 100 },
          children: parseFormattedText(bulletText, { size: 26 })
        }));
        return;
      }

      // Indented sub-bullet
      if (line.startsWith('  - ') || line.startsWith('  * ') || line.startsWith('\t- ')) {
        const bulletText = trimmed.replace(/^[-*]\s+/, '');
        paragraphs.push(new Paragraph({
          bullet: { level: 1 },
          spacing: { after: 80 },
          children: parseFormattedText(bulletText, { size: 26 })
        }));
        return;
      }

      // Regular Paragraph text
      paragraphs.push(new Paragraph({
        spacing: { after: 120 },
        children: parseFormattedText(trimmed, { size: 26 })
      }));
    });

    // Build Word Document
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: paragraphs,
      }],
    });

    // Generate Blob and download
    const blob = await Packer.toBlob(doc);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  return {
    exportToDocx: exportToDocx
  };
})();
