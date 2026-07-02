import { useEffect, useState } from "react";
import { getPlannedDays } from "../utils/dateUtils";
import BillingTable from "../components/BillingTable";
import { exportToExcel } from "../utils/exportExcel";

export default function BillingPage() {

  const [employees, setEmployees] = useState([]);
  const [billingData, setBillingData] = useState([]);

  const [form, setForm] = useState({
    employee_id: "",
    billing_year: "",
    month: "",
    paid_leave: "",
    unpaid_leave: "",
  });

  // ✅ FETCH EMPLOYEES
  const fetchEmployees = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/employees/all`);
    const data = await res.json();

    setEmployees(data);
  };

  // ✅ FETCH BILLING DATA
  const fetchBilling = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/billing/all`);
    const data = await res.json();

    setBillingData(data);
  };

  useEffect(() => {
    fetchEmployees();
    fetchBilling();
  }, []);

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ CREATE BILLING
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/billing/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      // ✅ HANDLE BACKEND ERRORS
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      alert("Billing created successfully ✅");

      // ✅ REFRESH TABLE
      fetchBilling();

      // ✅ RESET FORM
      setForm({
        employee_id: "",
        billing_year: "",
        month: "",
        paid_leave: "",
        unpaid_leave: "",
      });

    } catch (err) {
      alert(err.message);
    }
  };

  const calculatePreview = (employee, form) => {

  if (!employee || !form.billing_year || !form.month) {
    return null;
  }

  const unpaid = Number(form.unpaid_leave) || 0;

  const planned_days = getPlannedDays(
    form.billing_year,
    form.month
  );

  const billing_rate =
    Number(employee.billing_rate) || 0;

  const rate = Math.round(
    billing_rate / planned_days
  );

  // ==========================
  // DOJ LOGIC
  // ==========================
  const joiningDate = new Date(employee.doj);

  const monthMap = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };

  const billingMonth = monthMap[form.month];
  const billingYear = Number(form.billing_year);

  let joiningDeduction = 0;

  // Employee joined during billing month
  if (
    joiningDate.getFullYear() === billingYear &&
    joiningDate.getMonth() === billingMonth
  ) {

    joiningDeduction =
      joiningDate.getDate() - 1;

  }

  // Employee has not joined yet
  else if (
    joiningDate.getFullYear() > billingYear ||
    (
      joiningDate.getFullYear() === billingYear &&
      joiningDate.getMonth() > billingMonth
    )
  ) {

    return {
      error: `Employee joins on ${joiningDate.toLocaleDateString("en-GB")}`
    };

  }

  const total_leave =
    joiningDeduction + unpaid;

  const actual_days = Math.max(
    0,
    planned_days -
      joiningDeduction -
      unpaid
  );

  const total_amount =
    rate * actual_days;

  // const isToTheNew =
  //   employee?.client_name?.trim().toLowerCase() ===
  //   "to the new";

  // const tds = isToTheNew
  //   ? 0
  //   : total_amount * 0.10;

  // const gst = isToTheNew
  //   ? 0
  //   : total_amount * 0.18;

  const isToTheNew =
  employee?.client_name?.trim().toLowerCase() ===
  "to the new";

const applyZeroDeduction =
  isToTheNew &&
  !employee.ignore_zero_deduction;

const tds = applyZeroDeduction
  ? 0
  : total_amount * 0.10;

const gst = applyZeroDeduction
  ? 0
  : total_amount * 0.18;

  const post_tds =
    total_amount - tds;

  const invoice_value =
    total_amount + gst;

  const net_receivable =
    invoice_value - tds;

  return {
    planned_days,
    rate,
    total_leave,
    actual_days,
    total_amount,
    tds,
    gst,
    post_tds,
    invoice_value,
    net_receivable,
  };
};

//   const handleDelete = async (id) => {

//   try {

//     const res = await fetch(
//       `${import.meta.env.VITE_API_URL}/billing/delete/${id}`,
//       {
//         method: "DELETE",
//       }
//     );

//     if (res.ok) {

//       alert("Invoice Deleted Successfully");

//       fetchBilling();

//     } else {

//       alert("Delete Failed");

//     }

//   } catch (error) {

//     console.error(error);

//   }
// };

  // ✅ SELECTED EMPLOYEE
  const selectedEmployee = employees.find(
    (emp) => emp.id == form.employee_id
  );

  const preview = calculatePreview(
    selectedEmployee,
    form
  );

  return (

    <div className="min-h-screen bg-[#F5E6D3] py-6">

      <div className="max-w-7xl mx-auto px-4">

        {/* 🔥 PAGE HEADER */}
        <div className="mb-8 text-center">

          <h1 className="text-3xl font-semibold text-[#3E2C23]">
            💼 Billing Dashboard
          </h1>

          <p className="text-[#7F5539] mt-2">
            Create, manage and export employee billing records
          </p>

        </div>

        {/* ================================================= */}
        {/* TOP SECTION */}
        {/* ================================================= */}

        <div className="grid md:grid-cols-2 gap-6">

          {/* ================================================= */}
          {/* LEFT FORM */}
          {/* ================================================= */}

          <div className="bg-[#FFF8F0] border border-[#EAD7C3] p-6 rounded-2xl shadow-sm">

            <h2 className="text-xl font-semibold text-[#3E2C23] mb-5">
              Create Monthly Billing
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* EMPLOYEE */}
              <div>

                <label className="block text-sm text-[#7F5539] mb-1">
                  Employee
                </label>

                <select
                  name="employee_id"
                  value={form.employee_id}
                  onChange={handleChange}
                  className="w-full border border-[#EAD7C3] bg-white p-3 rounded-lg focus:ring-2 focus:ring-[#0F3D3E] outline-none"
                  required
                >
                  <option value="">
                    Select Employee
                  </option>

                  {employees.map((emp) => (
                    <option
                      key={emp.id}
                      value={emp.id}
                    >
                      {emp.name}
                    </option>
                  ))}
                </select>

              </div>

              {/* YEAR */}
              <div>

                <label className="block text-sm text-[#7F5539] mb-1">
                  Billing Year
                </label>

                <input
                  type="number"
                  name="billing_year"
                  placeholder="Enter Year"
                  value={form.billing_year}
                  onChange={handleChange}
                  className="w-full border border-[#EAD7C3] bg-white p-3 rounded-lg focus:ring-2 focus:ring-[#0F3D3E] outline-none"
                  required
                />

              </div>

              {/* MONTH */}
              <div>

                <label className="block text-sm text-[#7F5539] mb-1">
                  Billing Month
                </label>

                <select
                  name="month"
                  value={form.month}
                  onChange={handleChange}
                  className="w-full border border-[#EAD7C3] bg-white p-3 rounded-lg focus:ring-2 focus:ring-[#0F3D3E] outline-none"
                  required
                >
                  <option value="">
                    Select Month
                  </option>

                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((m) => (
                    <option key={m}>
                      {m}
                    </option>
                  ))}

                </select>

              </div>

              {/* LEAVES */}
              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm text-[#7F5539] mb-1">
                    Paid Leave
                  </label>

                  <input
                    type="number"
                    name="paid_leave"
                    placeholder="0"
                    value={form.paid_leave}
                    onChange={handleChange}
                    className="w-full border border-[#EAD7C3] bg-white p-3 rounded-lg focus:ring-2 focus:ring-[#0F3D3E] outline-none"
                  />

                </div>

                <div>

                  <label className="block text-sm text-[#7F5539] mb-1">
                    Unpaid Leave
                  </label>

                  <input
                    type="number"
                    name="unpaid_leave"
                    placeholder="0"
                    value={form.unpaid_leave}
                    onChange={handleChange}
                    className="w-full border border-[#EAD7C3] bg-white p-3 rounded-lg focus:ring-2 focus:ring-[#0F3D3E] outline-none"
                  />

                </div>

              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full bg-[#0F3D3E] text-white py-3 rounded-xl hover:bg-[#123F4A] transition font-medium"
              >
                Create Billing
              </button>

            </form>

          </div>

          {/* ================================================= */}
          {/* RIGHT PREVIEW */}
          {/* ================================================= */}

          <div className="space-y-5">

            {/* EMPLOYEE DETAILS */}
            {selectedEmployee && preview && (

              <div className="bg-[#FFF8F0] border border-[#EAD7C3] p-5 rounded-2xl shadow-sm">

                <h3 className="font-semibold text-[#3E2C23] mb-4">
                  👤 Employee Details
                </h3>

                <div className="space-y-2 text-[#6B4F3A] text-sm">

                  <p>
                    <span className="font-medium">
                      Name:
                    </span>{" "}
                    {selectedEmployee.name}
                  </p>

                  <p>
                    <span className="font-medium">
                      Designation:
                    </span>{" "}
                    {selectedEmployee.designation}
                  </p>

                  <p>
                    <span className="font-medium">
                      Billing Rate:
                    </span>{" "}
                    ₹ {selectedEmployee.billing_rate}
                  </p>

                  <p>
                    <span className="font-medium">
                      Planned Days:
                    </span>{" "}
                    {preview.planned_days}
                  </p>

                  <p>
                    <span className="font-medium">
                      Rate/Day:
                    </span>{" "}
                    ₹ {preview.rate}
                  </p>

                </div>

              </div>
            )}

            {preview?.error && (
  <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-2xl">
    ⚠️ {preview.error}
  </div>
)}

            {/* BILLING PREVIEW */}
            {preview && !preview.error && (

              <div className="bg-[#FFF8F0] border border-[#EAD7C3] p-5 rounded-2xl shadow-sm">

                <h3 className="font-semibold text-[#3E2C23] mb-4">
                  📊 Billing Preview
                </h3>

                <div className="grid grid-cols-2 gap-y-3 text-sm">

                  <p className="text-[#6B4F3A]">
                    Total Leave
                  </p>

                  <p className="font-medium text-right">
                    {preview.total_leave}
                  </p>

                  <p className="text-[#6B4F3A]">
                    Actual Days
                  </p>

                  <p className="font-medium text-right">
                    {preview.actual_days}
                  </p>

                  <p className="text-[#6B4F3A]">
                    Total Amount
                  </p>

                  <p className="font-medium text-right">
                    ₹ {preview.total_amount.toFixed(2)}
                  </p>

                  <p className="text-[#6B4F3A]">
                    TDS
                  </p>

                  <p className="font-medium text-right text-[#7F5539]">
                    ₹ {preview.tds.toFixed(2)}
                  </p>

                  <p className="text-[#6B4F3A]">
                    GST
                  </p>

                  <p className="font-medium text-right text-[#0F3D3E]">
                    ₹ {preview.gst.toFixed(2)}
                  </p>

                  <p className="text-[#6B4F3A]">
                    Post TDS
                  </p>

                  <p className="font-medium text-right">
                    ₹ {preview.post_tds.toFixed(2)}
                  </p>

                  <p className="text-[#6B4F3A]">
                    Invoice Value
                  </p>

                  <p className="font-semibold text-right text-[#C97B3D]">
                    ₹ {preview.invoice_value.toFixed(2)}
                  </p>

                  <p className="text-[#6B4F3A]">
                    Net Receivable
                  </p>

                  <p className="font-semibold text-right text-[#0F3D3E]">
                    ₹ {preview.net_receivable.toFixed(2)}
                  </p>

                </div>

              </div>
            )}

          </div>

        </div>

        {/* ================================================= */}
        {/* BILLING RECORDS */}
        {/* ================================================= */}

        <div className="mt-10">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">

            <div>

              <h2 className="text-2xl font-semibold text-[#3E2C23]">
                Billing Records
              </h2>

              <p className="text-sm text-[#7F5539]">
                Complete employee billing management
              </p>

            </div>

            {/* EXPORT BUTTON */}
            <button
              onClick={() => exportToExcel(billingData)}
              className="bg-[#0F3D3E] text-white px-5 py-2 rounded-xl hover:bg-[#123F4A] transition shadow-sm"
            >
              Export Excel
            </button>

          </div>

          

          {/* TABLE */}
          <div className="bg-[#FFF8F0] border border-[#EAD7C3] rounded-2xl shadow-sm overflow-hidden">

            {/* <BillingTable data={billingData}  onDelete={handleDelete} /> */}

            <BillingTable
    data={billingData}
    fetchBilling={fetchBilling}
/>


          </div>

        </div>

      </div>

    </div>
  );
}