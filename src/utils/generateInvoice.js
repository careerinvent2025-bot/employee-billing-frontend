import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoicePDF = (item) => {
  const doc = new jsPDF();

  // =========================
  // COLORS
  // =========================
  const primary = "#0F3D3E";
  const secondary = "#7F5539";
  const accent = "#C97B3D";

  // =========================
  // SAFE VALUES
  // =========================
  const invoiceNumber =
    item.invoice_number ||
    `FGTS-${item.billing_year}-${item.month}`;

  const employeeName = item.name || "Employee";

  // =========================
  // HEADER
  // =========================
  doc.setFillColor(primary);
  doc.rect(0, 0, 210, 38, "F");

  doc.setTextColor("#FFFFFF");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);

  doc.text("Fifthgen Tech Solutions", 14, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text("Professional Billing Invoice", 14, 27);

  // =========================
  // INVOICE TITLE
  // =========================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);

  doc.text("INVOICE", 155, 22);

  // =========================
  // INVOICE INFO
  // =========================
  doc.setTextColor(primary);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  doc.text(`Invoice No : ${invoiceNumber}`, 14, 52);
  doc.text(`Billing Month : ${item.month}`, 14, 60);
  doc.text(`Billing Year : ${item.billing_year}`, 14, 68);

  // =========================
  // EMPLOYEE DETAILS BOX
  // =========================
  doc.setDrawColor(225);
  doc.setFillColor(252, 248, 244);

  doc.roundedRect(14, 78, 182, 38, 4, 4, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);

  doc.text("Employee Details", 18, 89);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  // LEFT SIDE
  doc.text(`Employee Name : ${employeeName}`, 18, 99);

  doc.text(
    `Deduction Days : ${item.unpaid_leave}`,
    18,
    108
  );

  // RIGHT SIDE
  doc.text(
    `Actual Days : ${item.actual_days}`,
    112,
    99
  );

  doc.text(
    `Billing Rate : Rs. ${Number(
      item.billing_rate || 0
    ).toFixed(2)}`,
    112,
    108
  );

  // =========================
  // BILLING TABLE
  // =========================
  autoTable(doc, {
    startY: 128,

    head: [["Description", "Amount"]],

    body: [
      [
        "Total Amount",
        `Rs. ${Number(item.total_amount).toFixed(2)}`
      ],
      [
        "TDS",
        `Rs. ${Number(item.tds).toFixed(2)}`
      ],
      [
        "GST",
        `Rs. ${Number(item.gst).toFixed(2)}`
      ],
      [
        "Post TDS",
        `Rs. ${Number(item.post_tds).toFixed(2)}`
      ],
      [
        "Invoice Value",
        `Rs. ${Number(item.invoice_value).toFixed(2)}`
      ],
      [
        "Net Receivable",
        `Rs. ${Number(item.net_receivable).toFixed(2)}`
      ],
    ],

    headStyles: {
      fillColor: primary,
      textColor: "#FFFFFF",
      fontStyle: "bold",
      halign: "left",
    },

    bodyStyles: {
      textColor: "#333333",
      fontSize: 10,
    },

    alternateRowStyles: {
      fillColor: [248, 244, 240],
    },

    styles: {
      cellPadding: 5,
      lineColor: [230, 220, 210],
      lineWidth: 0.3,
    },

    columnStyles: {
      1: {
        halign: "right",
      },
    },
  });

  // =========================
  // FINAL SUMMARY BOX
  // =========================
  const finalY = doc.lastAutoTable.finalY + 18;

  doc.setFillColor(15, 61, 62);

  doc.roundedRect(120, finalY, 76, 28, 4, 4, "F");

  doc.setTextColor("#FFFFFF");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  doc.text("Net Receivable", 126, finalY + 10);

  doc.setFontSize(16);

  doc.text(
    `Rs. ${Number(item.net_receivable).toFixed(2)}`,
    126,
    finalY + 21
  );

  // =========================
  // FOOTER
  // =========================
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.setTextColor(secondary);

  doc.text(
    "This is a system-generated invoice by Fifthgen Tech Solutions.",
    14,
    285
  );

  // =========================
  // FILE NAME
  // =========================
  const safeName = employeeName.replace(/\s+/g, "_");

  doc.save(
    `${safeName}_${item.month}_${item.billing_year}.pdf`
  );
};