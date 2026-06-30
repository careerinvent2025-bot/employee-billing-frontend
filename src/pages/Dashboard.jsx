import { useEffect, useState } from "react";
import BillingTable from "../components/BillingTable";
import BillingChart from "../components/BillingChart";
import { getAllBilling } from "../services/api";
import { exportToExcel } from "../utils/exportExcel";

export default function Dashboard() {
  const [data, setData] = useState([]);

  // ✅ FILTER STATES
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [search, setSearch] = useState("");     // ✅ NEW
  const [sortBy, setSortBy] = useState("");     // ✅ NEW

  const fetchData = async () => {
    const res = await getAllBilling();
    setData(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ FILTER + SEARCH + SORT (ENHANCED)
  const filteredData = data
    .filter((item) => {
      return (
        (!year || item.billing_year == year) &&
        (!month || item.month === month) &&
        (!search ||
          item.name.toLowerCase().includes(search.toLowerCase()))
      );
    })
    .sort((a, b) => {
      if (!sortBy) return 0;

      if (sortBy === "amount") {
        return b.total_amount - a.total_amount;
      }

      if (sortBy === "invoice") {
        return b.invoice_value - a.invoice_value;
      }

      if (sortBy === "net") {
        return b.net_receivable - a.net_receivable;
      }

      return 0;
    });

  // ✅ CHART DATA (unchanged logic)
  const chartData = Object.values(
    filteredData.reduce((acc, item) => {
      const key = item.month;

      if (!acc[key]) {
        acc[key] = {
          month: item.month,
          total_amount: 0,
          gst: 0,
          tds: 0,
          net: 0,
          invoices: 0,
        };
      }

      acc[key].total_amount += Number(item.total_amount || 0);
      acc[key].gst += Number(item.gst || 0);
      acc[key].tds += Number(item.tds || 0);
      acc[key].net += Number(item.net_receivable || 0);
      acc[key].invoices += 1;

      return acc;
    }, {})
  );

  // ✅ Calculations (unchanged)
  const totalEmployees = new Set(
    filteredData.map((d) => d.employee_id)
  ).size;

  const totalBill = filteredData.reduce(
  (sum, item) => sum + Number(item.billing_rate || 0),
  0
);

  const totalGST = filteredData.reduce(
    (sum, item) => sum + Number(item.gst || 0),
    0
  );

  const totalInvoice = filteredData.reduce(
  (sum, item) => sum + Number(item.invoice_value || 0),
  0
);

const totalPostTDS = filteredData.reduce(
  (sum, item) => sum + Number(item.post_tds || 0),
  0
);

const totalNet = filteredData.reduce(
  (sum, item) => sum + Number(item.net_receivable || 0),
  0
);

// (same as totalGST, but keeping separate if you want another card)
const totalGSTAmount = filteredData.reduce(
  (sum, item) => sum + Number(item.gst || 0),
  0
);

const totalAmount = filteredData.reduce(
  (sum, item) => sum + Number(item.total_amount || 0),
  0
);

  return (
    <div className="min-h-screen bg-[#F5E6D3] py-6">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#3E2C23]">
            Dashboard
          </h1>
          <p className="text-[#7F5539] text-sm mt-1">
            Overview of billing performance
          </p>
        </div>

        {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

          <div className="bg-white border border-[#EAD7C3] p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <p className="text-[#7F5539] text-sm">Total Employees</p>
            <h2 className="text-3xl font-semibold mt-2 text-[#3E2C23]">
              {totalEmployees}
            </h2>
          </div>

          <div className="bg-white border border-[#EAD7C3] p-6 rounded-2xl shadow-sm hover:shadow-md transition">
  <p className="text-[#7F5539] text-sm">Total GST</p>
  <h2 className="text-3xl font-semibold mt-2 text-[#5C3D2E]">
    ₹ {totalGSTAmount.toFixed(2)}
  </h2>
</div>

          <div className="bg-white border border-[#EAD7C3] p-6 rounded-2xl shadow-sm hover:shadow-md transition">
  <p className="text-[#7F5539] text-sm">Total Billing</p>
  <h2 className="text-3xl font-semibold mt-2 text-[#3E2C23]">
    ₹ {totalBill.toFixed(2)}
  </h2>
</div>

          <div className="bg-white border border-[#EAD7C3] p-6 rounded-2xl shadow-sm hover:shadow-md transition">
  <p className="text-[#7F5539] text-sm">Total Invoice</p>
  <h2 className="text-3xl font-semibold mt-2 text-[#C97B3D]">
    ₹ {totalInvoice.toFixed(2)}
  </h2>
</div>

<div className="bg-white border border-[#EAD7C3] p-6 rounded-2xl shadow-sm hover:shadow-md transition">
  <p className="text-[#7F5539] text-sm">Total Post TDS</p>
  <h2 className="text-3xl font-semibold mt-2 text-[#7F5539]">
    ₹ {totalPostTDS.toFixed(2)}
  </h2>
</div>

<div className="bg-white border border-[#EAD7C3] p-6 rounded-2xl shadow-sm hover:shadow-md transition">
  <p className="text-[#7F5539] text-sm">Total Net</p>
  <h2 className="text-3xl font-semibold mt-2 text-[#0F3D3E]">
    ₹ {totalNet.toFixed(2)}
  </h2>
</div>

<div className="bg-white border border-[#EAD7C3] p-6 rounded-2xl shadow-sm hover:shadow-md transition">
  <p className="text-[#7F5539] text-sm">Total Amount</p>
  <h2 className="text-3xl font-semibold mt-2 text-[#3E2C23]">
    ₹ {totalAmount.toFixed(2)}
  </h2>
</div>

        </div>

        {/* 🔥 FILTER + SEARCH + SORT UI */}
        <div className="flex flex-wrap gap-4 mb-6">

          {/* 🔍 SEARCH */}
          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-[#EAD7C3] bg-white px-4 py-2 rounded-lg w-56"
          />

          {/* YEAR */}
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border border-[#EAD7C3] bg-white px-4 py-2 rounded-lg"
          >
            <option value="">All Years</option>
            {[...new Set(data.map((d) => d.billing_year))].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>

          {/* MONTH */}
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border border-[#EAD7C3] bg-white px-4 py-2 rounded-lg"
          >
            <option value="">All Months</option>
            {[
              "January","February","March","April","May","June",
              "July","August","September","October","November","December"
            ].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          {/* SORT */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-[#EAD7C3] bg-white px-4 py-2 rounded-lg"
          >
            <option value="">Sort By</option>
            <option value="amount">Total Amount</option>
            <option value="invoice">Invoice Value</option>
            <option value="net">Net Receivable</option>
          </select>

        </div>

        {/* CHART */}
        <div className="bg-white border border-[#EAD7C3] p-6 rounded-2xl shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-[#3E2C23] mb-4">
            Billing Overview
          </h2>
          <BillingChart data={chartData} />
        </div>

        <div className="flex justify-end mb-4">
  <button
    onClick={() => exportToExcel(filteredData)}
    className="bg-[#0F3D3E] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#123F4A]"
  >
    Export Excel
  </button>
</div>

        {/* TABLE */}
        <div className="bg-white border border-[#EAD7C3] rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#EAD7C3]">
            <h2 className="text-lg font-semibold text-[#3E2C23]">
              Billing Records
            </h2>
          </div>

          <div className="overflow-x-auto">
            <BillingTable data={filteredData} />
          </div>
        </div>

      </div>
    </div>
  );
}