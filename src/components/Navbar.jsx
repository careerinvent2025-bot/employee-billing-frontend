import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Billing", path: "/billing" },
    { name: "Employees", path: "/employees" },
    { name: "Clients", path: "/clients" },
  ];

  return (
    <div className="bg-gradient-to-r from-[#0F3D3E] to-[#DFA878] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* 🔷 BRAND */}
        <div className="flex items-center gap-3">

          <div className="h-12 w-12 overflow-hidden flex items-center justify-center bg-white/10 rounded-lg backdrop-blur">
            <img
              src={logo}
              alt="Fifthgen Logo"
              className="h-full w-full object-cover scale-125"
            />
          </div>

          <h1 className="text-lg font-semibold text-white tracking-tight">
            Fifthgen Tech Solutions
          </h1>

        </div>

        {/* 🔷 NAVIGATION */}
        <div className="flex items-center gap-2">

          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    isActive
                      ? "bg-white/20 text-white backdrop-blur"
                      : "text-white/80 hover:bg-white/20 hover:text-white"
                  }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
