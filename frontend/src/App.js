import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ClientHome } from "./pages/ClientHome";
import { BarberDashboard } from "./pages/BarberDashboard";
import { BarberDetail } from "./pages/BarberDetail";
import { Bookings } from "./pages/Bookings";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/barber" element={<Register isBarber />} />
          <Route path="/home" element={<ClientHome />} />
          <Route path="/barber/:id" element={<BarberDetail />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/dashboard" element={<BarberDashboard />} />
        </Routes>
        <Toaster position="top-right" richColors theme="dark" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
