import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from "./pages/dashboard/Dashboard";
import Fleet from "./pages/fleet/Fleet";
import AdminBookings from "./pages/admin-bookings/AdminBookings";
import CarBooking from "./pages/car-booking/CarBooking";
import Profile from "./pages/profile/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/fleet" element={<Fleet />} />
        <Route path="/admin-bookings" element={<AdminBookings />} />
        <Route path="/car-booking/:vehicleId" element={<CarBooking />} />
        <Route path="/profile/:customerId" element={<Profile />} />
      </Routes>

      {/* Toast container */}
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </BrowserRouter>
  )
}