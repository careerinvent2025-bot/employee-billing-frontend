import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import BillingPage from "./pages/BillingPage";
import Employees from "./pages/Employees";
import Clients from "./pages/Clients";


function App() {
  return (
    <Router>

      {/* Navbar */}
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/clients" element={<Clients />} />
      </Routes>

    </Router>
  );
}

export default App;