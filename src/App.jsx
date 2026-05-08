import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Employees from "./pages/Employees";
import Reviews from "./pages/Reviews";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reviews" element={<Reviews />} />

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/employees" element={<Employees />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App;