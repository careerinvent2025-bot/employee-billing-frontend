import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (data) => {

  // =========================
  // FORMAT DATA
  // =========================
  const formatted = data.map((item) => ({
    "Employee Name": item.name,
    "Billing Year": item.billing_year,
    "Month": item.month,

    "Actual Days": item.actual_days,
    "Deduction Days": item.unpaid_leave,

    "Billing Rate": Number(item.billing_rate || 0).toFixed(2),

    "Total Amount": Number(item.total_amount || 0).toFixed(2),

    "TDS": Number(item.tds || 0).toFixed(2),

    "GST": Number(item.gst || 0).toFixed(2),

    "Post TDS": Number(item.post_tds || 0).toFixed(2),

    "Invoice Value": Number(item.invoice_value || 0).toFixed(2),

    "Net Receivable": Number(item.net_receivable || 0).toFixed(2),

    "Invoice Number": item.invoice_number || "-",

    "Billing Status":
      item.invoice_value &&
      item.tds &&
      item.gst &&
      item.post_tds
        ? "Received"
        : "Pending",
  }));

  // =========================
  // CREATE WORKSHEET
  // =========================
  const worksheet = XLSX.utils.json_to_sheet(formatted);

  // =========================
  // COLUMN WIDTHS
  // =========================
  worksheet["!cols"] = [
    { wch: 28 }, // Employee Name
    { wch: 14 }, // Year
    { wch: 16 }, // Month
    { wch: 14 }, // Actual Days
    { wch: 18 }, // Deduction Days
    { wch: 18 }, // Billing Rate
    { wch: 18 }, // Total Amount
    { wch: 14 }, // TDS
    { wch: 14 }, // GST
    { wch: 16 }, // Post TDS
    { wch: 18 }, // Invoice Value
    { wch: 18 }, // Net Receivable
    { wch: 28 }, // Invoice Number
    { wch: 18 }, // Status
  ];

  // =========================
  // CREATE WORKBOOK
  // =========================
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Billing Report"
  );

  // =========================
  // GENERATE EXCEL BUFFER
  // =========================
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  // =========================
  // FILE DATA
  // =========================
  const fileData = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  // =========================
  // SAFE FILE NAME
  // =========================
  const today = new Date().toISOString().split("T")[0];

  saveAs(
    fileData,
    `Billing_Report_${today}.xlsx`
  );
};