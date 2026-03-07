import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Layout from "./layout";
import { register } from "../api/AuthApi";
import { Link, useNavigate } from "react-router";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setAlertMessage("");

    try {
      const response = await register({ email, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setAlertMessage("Register berhasil");
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        alert("Terjadi kesalahan server");
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
      linkTo="Sudah punya akun? "
      buttonText="Daftar"
      alternate="Login"
      errors={errors}
      link={"/login"}
    >
      {alertMessage && (
        <div className="mb-4">
          <Alert className="bg-green-100 text-green-800 border-green-300">
            <AlertTitle>{alertMessage}</AlertTitle>
            <AlertDescription>Silahkan Login</AlertDescription>
          </Alert>
        </div>
      )}
    </Layout>
  );
}
