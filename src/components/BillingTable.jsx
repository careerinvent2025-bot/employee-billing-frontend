import { generateInvoicePDF } from "../utils/generateInvoice";

// export default function BillingTable({ data , onDelete }) {
export default function BillingTable({ data, fetchBilling }) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-[#EAD7C3] bg-white shadow-sm">

      <table className="min-w-[2050px] w-full text-sm border-collapse">

        {/* HEADER */}
        <thead className="bg-[#0F3D3E] text-white text-sm">
          <tr>
            {[
              "Employee",
              "Client",
              "Year",
              "Month",
              "Actual Days",
              "Deduction Days",
              "Billing Rate",
              "Total",
              "TDS",
              "GST",
              "Post TDS",
              "Invoice",
              "Net",
              "Invoice No",
              "Status",
              "Download",
              "Action"
            ].map((head, index) => (
              <th
                key={head}
                className={`px-5 py-4 font-semibold border-r border-[#1F5A5B] last:border-r-0 whitespace-nowrap
                  ${index === 0 ? "text-left" : "text-center"}
                `}
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="bg-[#FFF8F0] text-[13px]">
          {data.map((item) => {

            const status =
              item.invoice_value &&
              item.tds &&
              item.gst &&
              item.post_tds
                ? "Received"
                : "Pending";

            return (
              <tr
                key={item.id}
                className="hover:bg-[#F5E6D3] transition border-b border-[#EAD7C3] h-[72px]"
              >

                {/* Employee */}
                <td className="min-w-[180px] px-5 py-4 border-r border-[#EAD7C3] align-middle whitespace-nowrap font-medium text-[#3E2C23]">
                  {item.name}
                </td>

                {/* Client Name */}
                <td className="min-w-[180px] px-5 py-4 border-r border-[#EAD7C3] align-middle whitespace-nowrap text-center text-[#6B4F3A]">
                  {item.client_name || "-"}
                </td>

                {/* Year */}
                <td className="px-5 py-4 border-r border-[#EAD7C3] align-middle whitespace-nowrap text-center">
                  {item.billing_year}
                </td>

                {/* Month */}
                <td className="px-5 py-4 border-r border-[#EAD7C3] align-middle whitespace-nowrap text-center">
                  {item.month}
                </td>

                {/* Actual Days */}
                <td className="px-5 py-4 border-r border-[#EAD7C3] align-middle whitespace-nowrap text-center">
                  {item.actual_days}
                </td>

                {/* Deduction Days */}
                <td className="px-5 py-4 border-r border-[#EAD7C3] align-middle whitespace-nowrap text-center text-[#7F5539]">
                  {item.unpaid_leave}
                </td>

                {/* Billing Rate */}
                <td className="px-5 py-4 border-r border-[#EAD7C3] align-middle whitespace-nowrap text-center tabular-nums font-medium text-[#0F3D3E]">
                  ₹ {Number(item.billing_rate || 0).toFixed(2)}
                </td>

                {/* Total */}
                <td className="px-5 py-4 border-r border-[#EAD7C3] align-middle whitespace-nowrap text-center tabular-nums">
                  ₹ {Number(item.total_amount).toFixed(2)}
                </td>

                {/* TDS */}
                <td className="px-5 py-4 border-r border-[#EAD7C3] align-middle whitespace-nowrap text-center tabular-nums text-[#7F5539]">
                  ₹ {Number(item.tds).toFixed(2)}
                </td>

                {/* GST */}
                <td className="px-5 py-4 border-r border-[#EAD7C3] align-middle whitespace-nowrap text-center tabular-nums text-[#0F3D3E]">
                  ₹ {Number(item.gst).toFixed(2)}
                </td>

                {/* Post TDS */}
                <td className="px-5 py-4 border-r border-[#EAD7C3] align-middle whitespace-nowrap text-center tabular-nums">
                  ₹ {Number(item.post_tds).toFixed(2)}
                </td>

                {/* Invoice */}
                <td className="px-5 py-4 border-r border-[#EAD7C3] align-middle whitespace-nowrap text-center tabular-nums font-semibold text-[#C97B3D]">
                  ₹ {Number(item.invoice_value).toFixed(2)}
                </td>

                {/* Net */}
                <td className="px-5 py-4 border-r border-[#EAD7C3] align-middle whitespace-nowrap text-center tabular-nums font-semibold text-[#0F3D3E]">
                  ₹ {Number(item.net_receivable).toFixed(2)}
                </td>

                {/* Invoice No */}
                <td className="px-5 py-4 border-r border-[#EAD7C3] align-middle whitespace-nowrap text-center text-gray-600">
                  {item.invoice_number || "-"}
                </td>

                {/* Status */}
                <td className="px-5 py-4 border-r border-[#EAD7C3] align-middle whitespace-nowrap text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                    ${
                      status === "Received"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {status}
                  </span>
                </td>

                {/* DOWNLOAD BUTTON */}
                <td className="px-5 py-4 align-middle whitespace-nowrap text-center">
                  <button
                    onClick={() => generateInvoicePDF(item)}
                    className="bg-[#0F3D3E] text-white px-3 py-1 rounded-lg text-xs hover:bg-[#123F4A] transition whitespace-nowrap"
                  >
                    Download
                  </button>
                </td>

                {/* DELETE BUTTON */}
<td className="px-5 py-4 align-middle whitespace-nowrap text-center">

  <button
    // onClick={() => {
      onClick={async () => {

       console.log("DELETE BUTTON CLICKED");

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this invoice?"
        );

      // if (confirmDelete) {
      //   onDelete(item.id);
      // }

//       if (confirmDelete) {

//   console.log("CALLING HANDLE DELETE");
//   console.log("ID =", item.id);

//   // onDelete(item.id);
//   console.log("typeof onDelete =", typeof onDelete);
// console.log("value =", onDelete);
// }

if (confirmDelete) {

  try {

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/billing/delete/${item.id}`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {

      alert("Invoice Deleted Successfully");

      fetchBilling();

    } else {

      alert("Delete Failed");

    }

  } catch (err) {

    console.error(err);

  }

}

    }}
    className="
      bg-red-600
      text-white
      px-3
      py-1
      rounded-lg
      text-xs
      hover:bg-red-700
      transition
      whitespace-nowrap
    "
  >
    Delete
  </button>

</td>

              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
}