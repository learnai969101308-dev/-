import { ConfigState, ScheduleRow, SubjectDisplayMode } from '../types';
import { toKhmerNum } from '../data/holidays';

export interface ExportDataResult {
  headers: string[];
  dataRows: Array<Array<string | number>>;
  isSingleSubject: boolean;
  subjectTitle: string;
}

export function buildExportRowsData(
  rows: ScheduleRow[],
  mode: SubjectDisplayMode
): ExportDataResult {
  const isSingleSubjOfficial = [
    'khmer_only',
    'math_only',
    'science_only',
    'social_only'
  ].includes(mode);

  let subjectTitle = 'កម្មវិធីសិក្សារួមគ្រប់មុខវិជ្ជា';
  if (mode === 'khmer_only') subjectTitle = 'មុខវិជ្ជា ភាសាខ្មែរ';
  else if (mode === 'math_only') subjectTitle = 'មុខវិជ្ជា គណិតវិទ្យា';
  else if (mode === 'science_only') subjectTitle = 'មុខវិជ្ជា វិទ្យាសាស្ត្រ';
  else if (mode === 'social_only') subjectTitle = 'មុខវិជ្ជា សិក្សាសង្គម';

  if (isSingleSubjOfficial) {
    const headers = [
      'ល.រ',
      'ខែ',
      'សប្ដាហ៍',
      'កាលបរិច្ឆេទ',
      'ជំពូក / មេរៀន',
      'ខ្លឹមសារមេរៀន (សៀវភៅសិក្សាគោល)',
      'លទ្ធផលរំពឹងទុក (កម្មវិធីសិក្សាលម្អិត)',
      'ម៉ោង',
      'ទំព័រ ស.ស.',
      'ទំព័រ ស.គ.',
      'ស្ថានភាព / កំណត់សម្គាល់'
    ];

    const dataRows = rows.map((r, i) => {
      let obj = r.khmerObj;
      if (mode === 'math_only') obj = r.mathObj;
      else if (mode === 'science_only') obj = r.sciObj;
      else if (mode === 'social_only') obj = r.socObj;

      return [
        i + 1,
        r.monthLabel,
        r.weekLabel,
        `${r.dayName} ${r.date}`,
        obj?.chapter || '',
        obj?.title || '',
        obj?.outcome || '',
        obj?.hours || '',
        obj?.page_ss || '',
        obj?.page_sg || '',
        r.statusLabel
      ];
    });

    return {
      headers,
      dataRows,
      isSingleSubject: true,
      subjectTitle
    };
  }

  const headers = [
    'ល.រ',
    'កាលបរិច្ឆេទ',
    'ថ្ងៃក្នុងសប្តាហ៍',
    'ខែ',
    'សប្តាហ៍',
    'ស្ថានភាព / ប្រភេទថ្ងៃ',
    'ភាសាខ្មែរ',
    'គណិតវិទ្យា',
    'វិទ្យាសាស្ត្រ',
    'សិក្សាសង្គម',
    'កំណត់សម្គាល់'
  ];

  const dataRows = rows.map((r, i) => [
    i + 1,
    r.date,
    r.dayName,
    r.monthLabel,
    r.weekLabel,
    r.statusLabel,
    r.khmerObj?.outcome
      ? `${r.khmer} (លទ្ធផល៖ ${r.khmerObj.outcome})`
      : r.khmer,
    r.mathObj?.outcome
      ? `${r.math} (លទ្ធផល៖ ${r.mathObj.outcome})`
      : r.math,
    r.science,
    r.social,
    r.note
  ]);

  return {
    headers,
    dataRows,
    isSingleSubject: false,
    subjectTitle
  };
}

export function copyScheduleAsTSVForGoogleSheets(
  rows: ScheduleRow[],
  cfg: ConfigState,
  mode: SubjectDisplayMode
): boolean {
  const { headers, dataRows, subjectTitle } = buildExportRowsData(rows, mode);

  const titleLines = [
    ['ព្រះរាជាណាចក្រកម្ពុជា'],
    ['ជាតិ សាសនា ព្រះមហាក្សត្រ'],
    [cfg.province, '', '', '', '', '', '', `ថ្នាក់៖ ${cfg.gradeLabel}`],
    [cfg.district, '', '', '', '', '', '', `គ្រូបន្ទុកថ្នាក់៖ ${cfg.teacherName}`],
    [
      cfg.schoolName,
      '',
      '',
      '',
      '',
      '',
      '',
      `ឆ្នាំសិក្សា៖ ${toKhmerNum(cfg.academicYear)}`
    ],
    [
      `បំណែងចែកកម្មវិធីសិក្សាស្វ័យប្រវត្តិ ឆ្នាំសិក្សា ${toKhmerNum(
        cfg.academicYear
      )} (${cfg.gradeLabel}) - ${subjectTitle}`
    ],
    [],
    headers
  ];

  const allLines = [...titleLines, ...dataRows]
    .map((row) =>
      row
        .map((cell) => String(cell ?? '').replace(/[\t\r\n]+/g, ' '))
        .join('\t')
    )
    .join('\n');

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(allLines);
      return true;
    }
  } catch (e) {
    // fallback
  }

  const ta = document.createElement('textarea');
  ta.value = allLines;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(ta);
  return ok;
}

export function downloadScheduleCSV(
  rows: ScheduleRow[],
  cfg: ConfigState,
  mode: SubjectDisplayMode
): void {
  const { headers, dataRows, subjectTitle } = buildExportRowsData(rows, mode);

  const metaRows = [
    ['ព្រះរាជាណាចក្រកម្ពុជា'],
    ['ជាតិ សាសនា ព្រះមហាក្សត្រ'],
    [cfg.province, '', '', `ថ្នាក់៖ ${cfg.gradeLabel}`],
    [cfg.schoolName, '', '', `គ្រូបន្ទុកថ្នាក់៖ ${cfg.teacherName}`],
    [
      `បំណែងចែកកម្មវិធីសិក្សាស្វ័យប្រវត្តិ ឆ្នាំសិក្សា ${toKhmerNum(
        cfg.academicYear
      )} (${subjectTitle})`
    ],
    [],
    headers,
    ...dataRows
  ];

  const escapeCSV = (val: string | number) => {
    const s = String(val ?? '').replace(/"/g, '""');
    return `"${s}"`;
  };

  const csvContent =
    '\uFEFF' +
    metaRows.map((r) => r.map((c) => escapeCSV(c)).join(',')).join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `កម្មវិធីសិក្សា_${cfg.gradeLabel.replace(/\s+/g, '_')}_${toKhmerNum(
    cfg.academicYear
  )}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadScheduleFormattedXLS(
  rows: ScheduleRow[],
  cfg: ConfigState,
  mode: SubjectDisplayMode
): void {
  const { headers, dataRows, subjectTitle } = buildExportRowsData(rows, mode);

  const escXml = (val: string | number) =>
    String(val ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  let tableRowsXml = `
    <Row ss:Height="26">
      <Cell ss:MergeAcross="${headers.length - 1}" ss:StyleID="sKingdomHeader">
        <Data ss:Type="String">ព្រះរាជាណាចក្រកម្ពុជា</Data>
      </Cell>
    </Row>
    <Row ss:Height="24">
      <Cell ss:MergeAcross="${headers.length - 1}" ss:StyleID="sKingdomSub">
        <Data ss:Type="String">ជាតិ សាសនា ព្រះមហាក្សត្រ</Data>
      </Cell>
    </Row>
    <Row ss:Height="22">
      <Cell ss:MergeAcross="3" ss:StyleID="sMetaLeft"><Data ss:Type="String">${escXml(
        cfg.province
      )}</Data></Cell>
      <Cell ss:MergeAcross="${Math.max(
        1,
        headers.length - 5
      )}" ss:StyleID="sMetaRight"><Data ss:Type="String">ថ្នាក់៖ ${escXml(
    cfg.gradeLabel
  )}</Data></Cell>
    </Row>
    <Row ss:Height="22">
      <Cell ss:MergeAcross="3" ss:StyleID="sMetaLeft"><Data ss:Type="String">${escXml(
        cfg.schoolName
      )}</Data></Cell>
      <Cell ss:MergeAcross="${Math.max(
        1,
        headers.length - 5
      )}" ss:StyleID="sMetaRight"><Data ss:Type="String">គ្រូបន្ទុកថ្នាក់៖ ${escXml(
    cfg.teacherName
  )}</Data></Cell>
    </Row>
    <Row ss:Height="28">
      <Cell ss:MergeAcross="${headers.length - 1}" ss:StyleID="sMainTitle">
        <Data ss:Type="String">បំណែងចែកកម្មវិធីសិក្សាស្វ័យប្រវត្តិ ឆ្នាំសិក្សា ${escXml(
          toKhmerNum(cfg.academicYear)
        )} (${escXml(subjectTitle)})</Data>
      </Cell>
    </Row>
    <Row ss:Height="8"><Cell><Data ss:Type="String"></Data></Cell></Row>
    <Row ss:Height="28">
  `;

  headers.forEach((h) => {
    tableRowsXml += `<Cell ss:StyleID="sHeader"><Data ss:Type="String">${escXml(
      h
    )}</Data></Cell>`;
  });
  tableRowsXml += '</Row>';

  dataRows.forEach((r, idx) => {
    const isEven = idx % 2 === 0;
    const styleId = isEven ? 'sDataEven' : 'sDataOdd';
    tableRowsXml += '<Row ss:Height="24">';
    r.forEach((c) => {
      tableRowsXml += `<Cell ss:StyleID="${styleId}"><Data ss:Type="String">${escXml(
        c
      )}</Data></Cell>`;
    });
    tableRowsXml += '</Row>';
  });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:html="http://www.w3.org/TR/REC-html40">
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Center"/>
      <Font ss:FontName="Kantumruy Pro" ss:Size="10" ss:Color="#0f172a"/>
    </Style>
    <Style ss:ID="sKingdomHeader">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Font ss:FontName="Moul" ss:Size="14" ss:Color="#1e3a8a" ss:Bold="1"/>
    </Style>
    <Style ss:ID="sKingdomSub">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Font ss:FontName="Moul" ss:Size="12" ss:Color="#1e3a8a"/>
    </Style>
    <Style ss:ID="sMainTitle">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Font ss:FontName="Moul" ss:Size="13" ss:Color="#0f172a" ss:Bold="1"/>
      <Interior ss:Color="#e2e8f0" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="sMetaLeft">
      <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
      <Font ss:FontName="Kantumruy Pro" ss:Size="10" ss:Bold="1" ss:Color="#334155"/>
    </Style>
    <Style ss:ID="sMetaRight">
      <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
      <Font ss:FontName="Kantumruy Pro" ss:Size="10" ss:Bold="1" ss:Color="#334155"/>
    </Style>
    <Style ss:ID="sHeader">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#475569"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#475569"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#475569"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#475569"/>
      </Borders>
      <Font ss:FontName="Kantumruy Pro" ss:Size="10" ss:Bold="1" ss:Color="#ffffff"/>
      <Interior ss:Color="#1e3a8a" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="sDataEven">
      <Alignment ss:Vertical="Center" ss:WrapText="1"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#cbd5e1"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#cbd5e1"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#cbd5e1"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#cbd5e1"/>
      </Borders>
      <Font ss:FontName="Kantumruy Pro" ss:Size="9.5" ss:Color="#0f172a"/>
      <Interior ss:Color="#ffffff" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="sDataOdd">
      <Alignment ss:Vertical="Center" ss:WrapText="1"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#cbd5e1"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#cbd5e1"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#cbd5e1"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#cbd5e1"/>
      </Borders>
      <Font ss:FontName="Kantumruy Pro" ss:Size="9.5" ss:Color="#0f172a"/>
      <Interior ss:Color="#f8fafc" ss:Pattern="Solid"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="កម្មវិធីសិក្សា">
    <Table>
      ${tableRowsXml}
    </Table>
  </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlContent], {
    type: 'application/vnd.ms-excel;charset=utf-8;'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `កាលវិភាគ_${cfg.gradeLabel.replace(/\s+/g, '_')}_${toKhmerNum(
    cfg.academicYear
  )}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateGoogleAppsScriptCode(
  rows: ScheduleRow[],
  cfg: ConfigState,
  mode: SubjectDisplayMode
): string {
  const { headers, dataRows, subjectTitle } = buildExportRowsData(rows, mode);

  return `/**
 * Google Apps Script ស្វ័យប្រវត្តិកម្មបង្កើតតារាងកម្មវិធីសិក្សា MoEYS
 * សម្រាប់សាលារៀន៖ ${cfg.schoolName} | ថ្នាក់៖ ${cfg.gradeLabel}
 * របៀបប្រើ៖ បើក Google Sheets > Extensions > Apps Script > បិទភ្ជាប់កូដនេះ > ចុច Run
 */
function createCambodiaCurriculumSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = "${cfg.gradeLabel} - ${cfg.academicYear}";
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }

  // Header meta
  sheet.getRange("A1").setValue("ព្រះរាជាណាចក្រកម្ពុជា").setFontFamily("Moul").setFontSize(14).setHorizontalAlignment("center");
  sheet.getRange("A2").setValue("ជាតិ សាសនា ព្រះមហាក្សត្រ").setFontFamily("Moul").setFontSize(12).setHorizontalAlignment("center");
  sheet.getRange("A1:${String.fromCharCode(64 + headers.length)}1").merge();
  sheet.getRange("A2:${String.fromCharCode(64 + headers.length)}2").merge();

  sheet.getRange("A3").setValue("${cfg.province}");
  sheet.getRange("A4").setValue("${cfg.schoolName}");
  sheet.getRange("${String.fromCharCode(64 + headers.length)}3").setValue("ថ្នាក់៖ ${cfg.gradeLabel}").setHorizontalAlignment("right");
  sheet.getRange("${String.fromCharCode(64 + headers.length)}4").setValue("គ្រូបន្ទុកថ្នាក់៖ ${cfg.teacherName}").setHorizontalAlignment("right");

  sheet.getRange("A5").setValue("បំណែងចែកកម្មវិធីសិក្សាស្វ័យប្រវត្តិ ឆ្នាំសិក្សា ${toKhmerNum(cfg.academicYear)} (${subjectTitle})")
    .setFontFamily("Moul").setFontSize(12).setHorizontalAlignment("center").setBackground("#e2e8f0");
  sheet.getRange("A5:${String.fromCharCode(64 + headers.length)}5").merge();

  // Column Headers
  var headers = ${JSON.stringify(headers)};
  sheet.getRange(7, 1, 1, headers.length).setValues([headers])
    .setFontWeight("bold")
    .setBackground("#1e3a8a")
    .setFontColor("#ffffff")
    .setHorizontalAlignment("center");

  // Data rows
  var data = ${JSON.stringify(dataRows)};
  if (data.length > 0) {
    sheet.getRange(8, 1, data.length, headers.length).setValues(data);
    sheet.getRange(8, 1, data.length, headers.length).setWrap(true);
  }

  // Auto resize columns
  for (var col = 1; col <= headers.length; col++) {
    sheet.autoResizeColumn(col);
  }

  SpreadsheetApp.getUi().alert("បានបង្កើតតារាងកម្មវិធីសិក្សាដោយជោគជ័យ!");
}`;
}
