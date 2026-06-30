import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function BillingChart({ data }) {
  return (
    <div className="bg-[#FFF8F0] border border-[#EAD7C3] p-6 rounded-2xl shadow-sm">

      <h2 className="text-lg font-semibold text-[#3E2C23] mb-4">
        📊 Monthly Financial Overview
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>

          <CartesianGrid stroke="#EAD7C3" strokeDasharray="3 3" />

          <XAxis
            dataKey="month"
            stroke="#7F5539"
            tick={{ fill: "#7F5539", fontSize: 12 }}
          />

          <YAxis
            stroke="#7F5539"
            tick={{ fill: "#7F5539", fontSize: 12 }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#FFF8F0",
              border: "1px solid #EAD7C3",
              borderRadius: "8px"
            }}
          />

          <Legend />

          {/* 🔷 Total Amount */}
          <Line
            type="monotone"
            dataKey="total_amount"
            stroke="#0F3D3E"
            strokeWidth={3}
          />

          {/* 🔷 GST */}
          <Line
            type="monotone"
            dataKey="gst"
            stroke="#C97B3D"
            strokeWidth={3}
          />

          {/* 🔷 TDS */}
          <Line
            type="monotone"
            dataKey="tds"
            stroke="#7F5539"
            strokeWidth={2}
          />

          {/* 🔷 Net Receivable */}
          <Line
            type="monotone"
            dataKey="net"
            stroke="#2A9D8F"
            strokeWidth={3}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}