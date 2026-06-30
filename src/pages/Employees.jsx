import { useEffect, useState, useRef} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Employees() {

  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [editId, setEditId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [form, setForm] = useState({
  name: "",
  doj: "",
  designation: "",
  billing_rate: "",
  client_id: "",
});

  const formRef = useRef(null);

  const [joiningDate, setJoiningDate] = useState(null);


  // FETCH EMPLOYEES
  const fetchEmployees = async () => {

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/employees/all`
      );

      const data = await res.json();

      setEmployees(data);

    } catch (error) {
      console.error(error);
    }
  };

  // FETCH CLIENTS
  const fetchClients = async () => {

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/clients/all`
      );

      const data = await res.json();

      setClients(data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchClients();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

const handleEdit = (emp) => {

  setForm({
    name: emp.name || "",
    doj: emp.doj?.split("T")[0] || "",
    designation: emp.designation || "",
    billing_rate: emp.billing_rate || "",
    client_id: emp.client_id || "",
  });

  setJoiningDate(
  emp.doj ? new Date(emp.doj) : null
);

  setEditId(emp.id);

  setTimeout(() => {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
};


  // CREATE + UPDATE
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      // UPDATE EMPLOYEE
      if (editId !== null) {

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/employees/update/${editId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
          }
        );

        if (res.ok) {

          alert("Employee Updated Successfully ✅");

        } else {

          alert("Update Failed ❌");
        }

      } else {

        // CREATE EMPLOYEE
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/employees/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
          }
        );

        if (res.ok) {

          alert("Employee Added Successfully ✅");

        } else {

          alert("Create Failed ❌");
        }
      }

      setForm({
  name: "",
  doj: "",
  designation: "",
  billing_rate: "",
  client_id: "",
});

      setEditId(null);

      setSelectedEmployee(null);

      setJoiningDate(null);

      // REFRESH TABLE
      fetchEmployees();

    } catch (error) {

      console.error(error);
    }
  };

  // DELETE EMPLOYEE
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/employees/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      // DIRECT SUCCESS
      if (res.ok) {

        alert("Employee Deleted Successfully ✅");

        fetchEmployees();

      } else {

        alert("Unable To Delete Employee ❌");
      }

    } catch (error) {

      console.error(error);
    }
  };

  // GET CLIENT NAME
  const getClientName = (client_id) => {

    const client = clients.find(
      (c) => String(c.id) === String(client_id)
    );

    return client ? client.client_name : "N/A";
  };

  return (

    <div className="min-h-screen bg-[#F5E6D3] py-6">

      <div className="max-w-6xl mx-auto px-4">

        <h1 className="text-3xl font-semibold text-[#3E2C23] mb-6">
          👨‍💼 Employees Management
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          {/* FORM */}
          <div
          ref={formRef} 
          className="bg-[#FFF8F0] border border-[#EAD7C3] p-6 rounded-2xl shadow-sm">

            <h2 className="text-xl font-semibold text-[#3E2C23] mb-4">
              {editId !== null ? "Edit Employee" : "Add Employee"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-3"
            >

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <div>

  <label className="block mb-1 font-medium">
    Date of Joining
  </label>

  <DatePicker
    selected={joiningDate}
    onChange={(date) => {

      setJoiningDate(date);

      setForm({
        ...form,
        doj: date
          ? date.toISOString().split("T")[0]
          : "",
      });

    }}
    dateFormat="dd/MM/yyyy"
    placeholderText="DD/MM/YYYY"
    className="w-full border p-2 rounded"
    showMonthDropdown
    showYearDropdown
    dropdownMode="select"
    required
  />

</div>

              <input
                type="text"
                name="designation"
                placeholder="Designation"
                value={form.designation}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="text"
                name="billing_rate"
                placeholder="Billing Rate"
                value={form.billing_rate}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />


              <select
                name="client_id"
                value={form.client_id}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Client</option>

                {clients.map((client) => (
                  <option
                    key={client.id}
                    value={client.id}
                  >
                    {client.client_name}
                  </option>
                ))}
              </select>

              <button className="w-full bg-[#0F3D3E] text-white py-2 rounded">
                {editId !== null
                  ? "Update Employee"
                  : "Add Employee"}
              </button>

            </form>

          </div>

          {/* TABLE */}
          <div className="bg-[#FFF8F0] border border-[#EAD7C3] p-6 rounded-2xl shadow-sm">

            <h2 className="text-xl font-semibold mb-4">
              Employee List
            </h2>

            <div className="space-y-3">

              {employees.map((emp) => (

                <div
                  key={emp.id}
                  className="flex justify-between items-center border p-3 rounded-lg"
                >

                  <div>

                    <p className="font-medium">
                      {emp.name}
                    </p>

                    <p className="text-sm">
                      {emp.designation} •{" "}
                      {getClientName(emp.client_id)}
                    </p>

                  </div>

                  <div className="flex gap-2">

                    {/* VIEW */}
                    <button
                      onClick={() => setSelectedEmployee(emp)}
                      className="bg-[#0F3D3E] text-white px-3 py-1 rounded"
                    >
                      View
                    </button>

                    {/* EDIT */}
                    <button
                      onClick={() => handleEdit(emp)}
                      className="bg-[#DFA878] px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="bg-[#C97B3D] text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

      {/* VIEW MODAL */}
      {selectedEmployee && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">

            <h2 className="text-xl font-semibold mb-4">
              Employee Details
            </h2>

            <div className="space-y-2">

              <p>
                <strong>Name:</strong>{" "}
                {selectedEmployee.name}
              </p>

              <p>
                <strong>DOJ:</strong>{" "}
               {selectedEmployee.doj
  ? new Date(selectedEmployee.doj)
      .toLocaleDateString("en-GB")
  : "N/A"}
              </p>

              <p>
                <strong>Designation:</strong>{" "}
                {selectedEmployee.designation}
              </p>

              <p>
                <strong>Billing Rate:</strong>{" "}
                {selectedEmployee.billing_rate || "N/A"}
              </p>

              <p>
                <strong>Client:</strong>{" "}
                {getClientName(selectedEmployee.client_id)}
              </p>

            </div>

            <button
              onClick={() => setSelectedEmployee(null)}
              className="mt-4 w-full bg-[#0F3D3E] text-white py-2 rounded"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}