import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle
} from 'docx';

export interface LessonPlanDocxOptions {
  markdownText: string;
  schoolName: string;
  teacherName: string;
  grade: string;
  subject: string;
  chapter: string;
  title: string;
  outcome?: string;
  hours?: string;
  pages?: string;
}

export async function exportLessonPlanToDocx(options: LessonPlanDocxOptions): Promise<void> {
  const {
    markdownText,
    schoolName,
    teacherName,
    grade,
    subject,
    chapter,
    title,
    hours,
    pages
  } = options;

  const fontName = 'Kantumruy Pro';

  const paragraphsAndTables: (Paragraph | Table)[] = [];

  // 1. Kingdom Header
  paragraphsAndTables.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: 'ព្រះរាជាណាចក្រកម្ពុជា',
          bold: true,
          size: 28, // 14pt
          font: fontName
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 180 },
      children: [
        new TextRun({
          text: 'ជាតិ សាសនា ព្រះមហាក្សត្រ',
          bold: true,
          size: 24, // 12pt
          font: fontName
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: '------------------------',
          color: '888888',
          font: fontName
        })
      ]
    })
  );

  // 2. Metadata Table (School, Grade, Teacher, Subject, Lesson, Duration)
  const metaTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 55, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({ text: 'សាលាបឋមសិក្សា៖ ', bold: true, size: 21, font: fontName }),
                  new TextRun({ text: schoolName || 'សាលាបឋមសិក្សា', size: 21, font: fontName })
                ]
              }),
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({ text: 'គ្រូបង្រៀន៖ ', bold: true, size: 21, font: fontName }),
                  new TextRun({ text: teacherName || '................................', size: 21, font: fontName })
                ]
              }),
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({ text: 'មេរៀន/ជំពូក៖ ', bold: true, size: 21, font: fontName }),
                  new TextRun({ text: `${chapter} ${title}`, size: 21, font: fontName })
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({ text: 'ថ្នាក់៖ ', bold: true, size: 21, font: fontName }),
                  new TextRun({ text: grade || 'ថ្នាក់បឋមសិក្សា', size: 21, font: fontName })
                ]
              }),
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({ text: 'មុខវិជ្ជា៖ ', bold: true, size: 21, font: fontName }),
                  new TextRun({ text: subject || 'ភាសាខ្មែរ', size: 21, font: fontName })
                ]
              }),
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({ text: 'រយៈពេល៖ ', bold: true, size: 21, font: fontName }),
                  new TextRun({ text: `${hours || '១ម៉ោង'} (ទំព័រ៖ ${pages || '១'})`, size: 21, font: fontName })
                ]
              })
            ]
          })
        ]
      })
    ]
  });

  paragraphsAndTables.push(metaTable);

  // 3. Document Title
  paragraphsAndTables.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 200 },
      children: [
        new TextRun({
          text: 'កិច្ចតែងការបង្រៀន (៥ ជំហាន)',
          bold: true,
          size: 26, // 13pt
          color: '1E3A8A',
          font: fontName
        })
      ]
    })
  );

  // 4. Parse Markdown Lines and construct Paragraphs and Table
  const lines = markdownText.split(/\r?\n/);
  let tableRowsBuffer: string[][] = [];
  let isInsideTable = false;

  const flushTableBuffer = () => {
    if (tableRowsBuffer.length === 0) return;

    // Filter out separator rows like | :--- | :--- |
    const validRows = tableRowsBuffer.filter(
      (r) => !r.every((c) => c.match(/^[:\-\s]+$/))
    );

    if (validRows.length > 0) {
      const docxRows: TableRow[] = validRows.map((cols, rowIdx) => {
        const isHeader = rowIdx === 0;

        // Ensure 3 columns: Col 1 = Teacher, Col 2 = Content, Col 3 = Students
        const c1 = cols[0] || '';
        const c2 = cols[1] || '';
        const c3 = cols[2] || '';

        const makeCell = (text: string, widthPercent: number) => {
          // split by <br> or \n
          const textSegments = text.split(/<br\s*\/?>|\n/gi).map((s) => s.trim()).filter(Boolean);
          const cellParas = textSegments.length > 0
            ? textSegments.map(
                (seg) =>
                  new Paragraph({
                    spacing: { after: 40 },
                    children: [
                      new TextRun({
                        text: seg.replace(/\*\*/g, '').replace(/\*/g, ''),
                        bold: isHeader || seg.startsWith('**') || seg.includes('ជំហានទី'),
                        size: isHeader ? 21 : 20,
                        font: fontName
                      })
                    ]
                  })
              )
            : [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: text.replace(/\*\*/g, '').replace(/\*/g, ''),
                      bold: isHeader,
                      size: isHeader ? 21 : 20,
                      font: fontName
                    })
                  ]
                })
              ];

          return new TableCell({
            width: { size: widthPercent, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            shading: isHeader ? { fill: 'E2E8F0' } : undefined,
            children: cellParas
          });
        };

        return new TableRow({
          children: [
            makeCell(c1, 33), // សកម្មភាពគ្រូ
            makeCell(c2, 34), // ខ្លឹមសារមេរៀន
            makeCell(c3, 33)  // សកម្មភាពសិស្ស
          ]
        });
      });

      const fullTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: docxRows
      });

      paragraphsAndTables.push(fullTable);
      paragraphsAndTables.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
    }

    tableRowsBuffer = [];
    isInsideTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip preamble or duplicate titles
    if (
      line.startsWith('# ព្រះរាជាណាចក្រកម្ពុជា') ||
      line.startsWith('## ជាតិ សាសនា') ||
      line === '---' ||
      line === '***'
    ) {
      continue;
    }

    // Check if line is a table row
    if (line.startsWith('|') && line.endsWith('|')) {
      isInsideTable = true;
      const cells = line
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());
      tableRowsBuffer.push(cells);
      continue;
    } else {
      if (isInsideTable) {
        flushTableBuffer();
      }
    }

    if (!line) {
      continue;
    }

    // Headings
    if (line.startsWith('###') || line.startsWith('II.') || line.startsWith('III.') || line.startsWith('IV.') || line.startsWith('I.')) {
      paragraphsAndTables.push(
        new Paragraph({
          spacing: { before: 180, after: 80 },
          children: [
            new TextRun({
              text: line.replace(/^#+\s*/, ''),
              bold: true,
              size: 23,
              color: '1E3A8A',
              font: fontName
            })
          ]
        })
      );
    } else if (line.startsWith('-') || line.startsWith('*')) {
      paragraphsAndTables.push(
        new Paragraph({
          spacing: { after: 50 },
          indent: { left: 240 },
          children: [
            new TextRun({
              text: '• ' + line.replace(/^[-*]\s*/, '').replace(/\*\*/g, ''),
              size: 21,
              font: fontName
            })
          ]
        })
      );
    } else {
      paragraphsAndTables.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: line.replace(/\*\*/g, ''),
              bold: line.includes('៖'),
              size: 21,
              font: fontName
            })
          ]
        })
      );
    }
  }

  // If table remains at the end
  if (isInsideTable) {
    flushTableBuffer();
  }

  // 5. Signature Blocks at bottom
  const signTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 60 },
                children: [
                  new TextRun({ text: 'បានឃើញ និងឯកភាព', bold: true, size: 21, font: fontName })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 800 }, // space for stamp & signature
                children: [
                  new TextRun({ text: 'នាយកសាលា', bold: true, size: 22, font: fontName })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: '............................................', font: fontName })
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 60 },
                children: [
                  new TextRun({
                    text: 'ថ្ងៃ................ ខែ............ ឆ្នាំ២០២...',
                    size: 20,
                    font: fontName
                  })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 800 }, // space for teacher's signature
                children: [
                  new TextRun({ text: 'គ្រូបង្រៀន', bold: true, size: 22, font: fontName })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: teacherName || '............................................', bold: true, size: 21, font: fontName })
                ]
              })
            ]
          })
        ]
      })
    ]
  });

  paragraphsAndTables.push(signTable);

  // Build Document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch
              right: 720,
              bottom: 720,
              left: 720
            }
          }
        },
        children: paragraphsAndTables
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const cleanTitle = (title || 'កិច្ចតែងការបង្រៀន').replace(/[/\\?%*:|"<>]/g, '_');
  const fileName = `កិច្ចតែងការ_${cleanTitle}_${grade || ''}.docx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
