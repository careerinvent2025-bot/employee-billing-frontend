import { useEffect, useState } from "react";

export default function Clients() {
  const [clients, setClients] = useState([]);

  // const [form, setForm] = useState({
  //   client_name: "",
  //   gst_number: "",
  // });

  const [form, setForm] = useState({
  client_name: "",
  gst_number: "",
  tds_enabled: false,
});

  // ✅ NEW STATES (added)
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // ✅ Fetch clients
  const fetchClients = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/clients/all`);
    const data = await res.json();
    setClients(data);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // ✅ Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Create client
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${import.meta.env.VITE_API_URL}/api/clients/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    alert("Client added ✅");

    // setForm({
    //   client_name: "",
    //   gst_number: "",
    // });

    setForm({
  client_name: "",
  gst_number: "",
  tds_enabled: false,
});

    fetchClients();
  };

  // ✅ Delete client
  const handleDelete = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/clients/delete/${id}`, {
      method: "DELETE",
    });

    fetchClients();
  };

  // ✅ NEW: Fetch employees of selected client
  const handleViewEmployees = async (clientId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/clients/${clientId}/employees`
      );
      const data = await res.json();

      setSelectedEmployees(data);
      setShowModal(true);
    } catch (err) {
      console.error(err);
    }
  };

 return (
  <div className="min-h-screen bg-[#F5E6D3] py-6">

    <div className="max-w-6xl mx-auto px-4">

      <h1 className="text-3xl font-semibold text-[#3E2C23] mb-6">
        🏢 Clients Management
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        {/* 📝 FORM */}
        <div className="bg-[#FFF8F0] border border-[#EAD7C3] p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold text-[#3E2C23] mb-4">
            Add Client
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">

            <input
              name="client_name"
              placeholder="Client Name"
              value={form.client_name}
              onChange={handleChange}
              className="w-full border border-[#EAD7C3] p-2 rounded focus:ring-2 focus:ring-[#0F3D3E] outline-none"
              required
            />

            <input
              name="gst_number"
              placeholder="GST Number"
              value={form.gst_number}
              onChange={handleChange}
              className="w-full border border-[#EAD7C3] p-2 rounded focus:ring-2 focus:ring-[#0F3D3E] outline-none"
              required
            />

            <div className="flex items-center gap-2">
  <input
    type="checkbox"
    name="tds_enabled"
    checked={form.tds_enabled}
    onChange={(e) =>
      setForm({
        ...form,
        tds_enabled: e.target.checked,
      })
    }
    className="w-4 h-4"
  />

  <label className="text-[#3E2C23] font-medium">
    TDS Applicable
  </label>
</div>

            <button className="w-full bg-[#0F3D3E] text-white py-2 rounded-lg hover:bg-[#123F4A] transition">
              Add Client
            </button>

          </form>
        </div>

        {/* 📋 LIST */}
        <div className="bg-[#FFF8F0] border border-[#EAD7C3] p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold text-[#3E2C23] mb-4">
            Clients List
          </h2>

          <div className="space-y-3">
            {clients.map((client) => (
              <div
                key={client.id}
                className="flex justify-between items-center border border-[#EAD7C3] p-3 rounded-lg hover:bg-[#F5E6D3] transition"
              >
                <div>
                  <p className="font-medium text-[#3E2C23]">
                    {client.client_name}
                  </p>

                  <p className="text-sm text-[#6B4F3A]">
                    {client.gst_number}
                  </p>

                  <p
  className={`text-sm font-medium ${
    client.tds_enabled
      ? "text-green-700"
      : "text-red-600"
  }`}
>
  {client.tds_enabled
    ? "✅ TDS Enabled"
    : "❌ No TDS"}
</p>

                  {/* EMPLOYEE COUNT */}
                  <p
                    onClick={() => handleViewEmployees(client.id)}
                    className="text-sm text-[#0F3D3E] cursor-pointer hover:underline"
                  >
                    👨‍💼 {Number(client.employee_count || 0)} Employees
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(client.id)}
                  className="bg-[#C97B3D] text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* 🔥 MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-[#FFF8F0] border border-[#EAD7C3] p-6 rounded-2xl w-96 shadow-lg">

            <h2 className="text-lg font-semibold text-[#3E2C23] mb-4">
              Employees List
            </h2>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedEmployees.length > 0 ? (
                selectedEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    className="border border-[#EAD7C3] p-2 rounded"
                  >
                    <p className="font-medium text-[#3E2C23]">
                      {emp.name}
                    </p>
                    <p className="text-sm text-[#6B4F3A]">
                      {emp.designation}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-[#6B4F3A]">
                  No employees found
                </p>
              )}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full bg-[#0F3D3E] text-white py-2 rounded-lg hover:bg-[#123F4A]"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  </div>
);
}