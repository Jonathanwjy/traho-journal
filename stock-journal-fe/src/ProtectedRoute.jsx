import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  // Ambil langsung dari localStorage untuk sinkronisasi instan
  const token = localStorage.getItem("token");

  // Periksa apakah token null, undefined, atau string kosong (setelah di-parse jika perlu)
  // Catatan: react-use biasanya menyimpan string dengan tanda kutip jika tidak hati-hati
  const isAuthenticated = token && token !== '""' && token !== "";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
