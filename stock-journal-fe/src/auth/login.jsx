import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Layout from "./layout";
import { login } from "../api/AuthApi";
import { Link, useNavigate } from "react-router";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Reset errors
    setAlertMessage("");
    setAlertStatus("");

    try {
      const response = await login({ email, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        // Redirect atau tampilkan success message
        setAlertStatus("success");
        setAlertMessage("Login berhasil");

        setTimeout(() => {
          navigate("/dashboard");
        }, 2500);
      }
    } catch (error) {
      // Handle validation errors (422)
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else if (error.response?.status === 401) {
        // Menangkap 'invalid credentials' dari Laravel
        setAlertMessage("Email atau password salah");
      } else {
        // Handle other errors
        setAlertMessage("Terjadi kesalahan server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      values={{ email, password, showPassword }}
      setter={{ setEmail, setPassword, setShowPassword }}
      onSubmit={handleSubmit}
      linkTo="Belum punya akun? "
      buttonText="Masuk"
      alternate="Daftar"
      errors={errors}
      link={"/register"}
    >
      {alertMessage && (
        <div className="mb-4">
          {alertStatus === "success" ? (
            // Alert Berhasil (Hijau)
            <Alert className="bg-green-100 text-green-800 border-green-300">
              <AlertTitle>Berhasil</AlertTitle>
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          ) : (
            // Alert Gagal (Merah menggunakan Shadcn Destructive)
            <Alert className="bg-red-200 text-red-800 border-red-300">
              <AlertTitle>Gagal Login</AlertTitle>
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </Layout>
  );
}
