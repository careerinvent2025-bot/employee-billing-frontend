import { useState, useEffect } from "react";
import { createBilling, updateBilling } from "../services/api";

export default function BillingForm({
  editData,
  setEditData,
  refreshData
}) {

  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    month: "",
    employee_id: "",
    name: "",
    client_name: "",
    doj: "",
    designation: "",
    rate_by_client: "",
    planned_days: "",
    actual_days: ""
  });

  const [editId, setEditId] = useState(null);

  // ✅ FETCH EMPLOYEES
  useEffect(() => {

    const fetchEmployees = async () => {
      try {

        const res = await fetch(
          // "http://localhost:5000/api/employees/all"

         `${import.meta.env.VITE_API_URL}/employees/all`
        );

        const data = await res.json();

        console.log("EMPLOYEES:", data);

        setEmployees(data);

      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployees();

  }, []);

  // ✅ WHEN EDIT CLICKED
  useEffect(() => {

    if (editData) {

      setForm({
        ...editData,
        employee_id: editData.employee_id || "",
      });

      setEditId(editData?.id || editData?._id);
    }

  }, [editData]);

  // ✅ HANDLE INPUT
  const handleChange = (e) => {

    const { name, value } = e.target;

    // ✅ EMPLOYEE SELECTED
    if (name === "employee_id") {

      const selectedEmployee = employees.find(
        (emp) => emp.id == value
      );

      console.log("SELECTED:", selectedEmployee);

      setForm({
        ...form,
        employee_id: value,
        name: selectedEmployee?.name || "",
        client_name:
          selectedEmployee?.client_name || "",
      });

    } else {

      setForm({
        ...form,
        [name]: value,
      });

    }
  };

  // ✅ RESET FORM
  const resetForm = () => {

    setForm({
      month: "",
      employee_id: "",
      name: "",
      client_name: "",
      doj: "",
      designation: "",
      rate_by_client: "",
      planned_days: "",
      actual_days: ""
    });

    setEditId(null);
    setEditData(null);
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editId !== null) {

        // ✅ UPDATE
        await updateBilling(editId, form);

        alert("Updated successfully ✅");

      } else {

        // ✅ CREATE
        await createBilling({
          ...form,
          leave_count: 0,
          unpaid_leave: 0,
          paid_leave: 0,
        });

        alert("Data saved ✅");
      }

      await refreshData();

      // ✅ ENSURE UI REFRESH
      setTimeout(() => {
        refreshData();
      }, 200);

      resetForm();

    } catch (error) {
      console.error(error);
    }
  };

  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      {/* EMPLOYEE SELECT */}
      <div className="flex flex-col">

        <label className="mb-1 font-medium text-gray-700">
          Employee Name
        </label>

        <select
          name="employee_id"
          value={form.employee_id}
          onChange={handleChange}
          className="border p-2 w-full rounded"
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

      {/* CLIENT NAME */}
      <div className="flex flex-col">

        <label className="mb-1 font-medium text-gray-700">
          Client Name
        </label>

        <input
          name="client_name"
          value={form.client_name}
          placeholder="Client Name"
          className="border p-2 w-full bg-gray-100 rounded"
          readOnly
        />

      </div>

      {/* MONTH */}
      <div className="flex flex-col">

        <label className="mb-1 font-medium text-gray-700">
          Month
        </label>

        <input
          name="month"
          value={form.month}
          placeholder="Month"
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

      </div>

      {/* RATE */}
      <div className="flex flex-col">

        <label className="mb-1 font-medium text-gray-700">
          Rate By Client
        </label>

        <input
          name="rate_by_client"
          value={form.rate_by_client}
          placeholder="Rate"
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

      </div>

      {/* PLANNED DAYS */}
      <div className="flex flex-col">

        <label className="mb-1 font-medium text-gray-700">
          Planned Days
        </label>

        <input
          name="planned_days"
          value={form.planned_days}
          placeholder="Planned Days"
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

      </div>

      {/* ACTUAL DAYS */}
      <div className="flex flex-col">

        <label className="mb-1 font-medium text-gray-700">
          Actual Days
        </label>

        <input
          name="actual_days"
          value={form.actual_days}
          placeholder="Actual Days"
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

      </div>

      {/* BUTTONS */}
      <div className="flex gap-2">

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editId ? "Update" : "Submit"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}

      </div>

    </form>
  );
}