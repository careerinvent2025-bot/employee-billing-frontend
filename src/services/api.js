// const BASE_URL = "http://localhost:5000/api/billing";

// export const createBilling = async (data) => {
//   const res = await fetch(`${BASE_URL}/create`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// export const getAllBilling = async () => {
//   const res = await fetch("http://localhost:5000/api/billing/all", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     cache: "no-store", // 🔥 IMPORTANT (prevents caching)
//   });

//   const data = await res.json();
//   return data;
// };

// export const deleteBilling = async (id) => {
//   await fetch(`${BASE_URL}/delete/${id}`, {
//     method: "DELETE",
//   });
// };

// export const updateBilling = async (id, data) => {
//   const res = await fetch(`${BASE_URL}/update/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };



// export const getAllBilling = async () => {
//   const res = await fetch(`${import.meta.env.VITE_API_URL}/billing/all`);
//   return res.json();
// };

const API_URL = import.meta.env.VITE_API_URL;

export const getAllBilling = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/billing/all`);

  if (!res.ok) {
    throw new Error("Failed to fetch billing");
  }

  return res.json();
};

export default API_URL;