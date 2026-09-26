import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ComparativeRow {
  category: string;
  budget: number;
  actual: number;
  variance: number;
  variancePct: number;
  status: string;
}

export function exportComparativeStatementPDF({
  selectedMonth,
  rangeMode,
  comparativeData,
  totals,
}: {
  selectedMonth: string;
  rangeMode: string;
  comparativeData: ComparativeRow[];
  totals: {
    totalBudget: number;
    totalActual: number;
    totalVariance: number;
    totalVariancePct: number;
  };
}) {
  const doc = new jsPDF();

  // Top header banner
  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('PaisaPulse - Financial Comparative Statement', 14, 15);

  // Subtitle / Info
  doc.setTextColor(50, 60, 70);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Period: ${selectedMonth} (${rangeMode})`, 14, 32);
  doc.text(
    `Generated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
    14,
    38
  );

  // Prepare table rows
  const tableData = comparativeData.map((row) => [
    row.category,
    `Rs. ${Number(row.budget).toLocaleString('en-IN')}`,
    `Rs. ${Number(row.actual).toLocaleString('en-IN')}`,
    `Rs. ${Number(row.variance).toLocaleString('en-IN')}`,
    `${row.variancePct}%`,
    row.status,
  ]);

  // Append Totals row
  tableData.push([
    'TOTALS',
    `Rs. ${Number(totals.totalBudget).toLocaleString('en-IN')}`,
    `Rs. ${Number(totals.totalActual).toLocaleString('en-IN')}`,
    `Rs. ${Number(totals.totalVariance).toLocaleString('en-IN')}`,
    `${totals.totalVariancePct}%`,
    totals.totalVariance <= 0 ? 'Within Budget' : 'Exceeded',
  ]);

  autoTable(doc, {
    startY: 44,
    head: [['Category', 'Budget', 'Actual Spend', 'Variance', 'Variance %', 'Status']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 118, 110],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    didParseCell: (data) => {
      // Highlight the Totals row at the bottom
      if (data.row.index === tableData.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [204, 251, 241];
      }
    },
  });

  // Footer note
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text(
    'PaisaPulse - Cultivating Healthy Savings • Confidential Financial Statement',
    14,
    pageHeight - 10
  );

  const fileName = `PaisaPulse_Comparative_Statement_${selectedMonth}_${rangeMode}.pdf`;
  doc.save(fileName);
}
