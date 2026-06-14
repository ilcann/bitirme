import jsPDF from 'jspdf';
import autoTable, { type RowInput } from 'jspdf-autotable';
import notoSansRegularUrl from '@/assets/fonts/NotoSans-Regular.ttf?url';

type ExportTablePdfOptions = {
  title: string;
  fileName: string;
  head: RowInput[];
  body: RowInput[];
  orientation?: 'portrait' | 'landscape';
};

const NOTO_SANS_FILE_NAME = 'NotoSans-Regular.ttf';
const NOTO_SANS_FONT_NAME = 'NotoSans';

let notoSansBase64Promise: Promise<string> | null = null;

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = '';

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

async function getNotoSansBase64() {
  if (!notoSansBase64Promise) {
    notoSansBase64Promise = fetch(notoSansRegularUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Noto Sans font file could not be loaded.');
        }

        return response.arrayBuffer();
      })
      .then(arrayBufferToBase64);
  }

  return notoSansBase64Promise;
}

async function registerTurkishFont(doc: jsPDF) {
  const fontBase64 = await getNotoSansBase64();

  doc.addFileToVFS(NOTO_SANS_FILE_NAME, fontBase64);
  doc.addFont(NOTO_SANS_FILE_NAME, NOTO_SANS_FONT_NAME, 'normal');
  doc.addFont(NOTO_SANS_FILE_NAME, NOTO_SANS_FONT_NAME, 'bold');
  doc.setFont(NOTO_SANS_FONT_NAME, 'normal');
}

export async function exportTablePdf({
  title,
  fileName,
  head,
  body,
  orientation = 'landscape',
}: ExportTablePdfOptions) {
  const doc = new jsPDF({
    orientation,
    unit: 'pt',
    format: 'a4',
  });

  await registerTurkishFont(doc);

  const exportedAt = new Date().toLocaleString();

  doc.setFontSize(14);
  doc.text(title, 32, 34);
  doc.setFontSize(9);
  doc.text(`Exported: ${exportedAt}`, 32, 50);

  autoTable(doc, {
    head,
    body,
    startY: 62,
    theme: 'grid',
    margin: { top: 62, right: 24, bottom: 24, left: 24 },
    styles: {
      fontSize: 8,
      cellPadding: 4,
      overflow: 'linebreak',
      valign: 'middle',
      font: NOTO_SANS_FONT_NAME,
    },
    headStyles: {
      fillColor: [31, 41, 55],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      font: NOTO_SANS_FONT_NAME,
      halign: 'center',
      valign: 'middle',
    },
  });

  doc.save(fileName);
}