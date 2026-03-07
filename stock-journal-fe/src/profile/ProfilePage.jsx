import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Camera,
  User,
  CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { changePassword } from "@/api/AuthApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { getProfile } from "@/api/AuthApi";

export default function ProfilePage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [old_password, setOldPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        if (response.data.success) {
          setEmail(response.data.data.email);
        }
      } catch (error) {
        console.error("Gagal mengambil profil:", error);
        if (error.response?.status === 401) {
          setStatusMessage({
            type: "error",
            text: "Sesi telah berakhir, silakan login ulang.",
          });
        }
      }
    };

    fetchProfile();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setStatusMessage({ type: "", text: "" });

    if (new_password !== confirmPassword) {
      setErrors({ confirmPassword: ["Konfirmasi password tidak cocok"] });
      setLoading(false);
      return;
    }

    try {
      const response = await changePassword({ old_password, new_password });

      if (response.data.success) {
        setStatusMessage({ type: "success", text: response.data.message });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else if (error.response?.status === 400) {
        setStatusMessage({ type: "error", text: error.response.data.message });
      } else {
        setStatusMessage({ type: "error", text: "Terjadi kesalahan server" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 py-6 bg-background text-foreground transition-colors duration-300 flex items-center justify-center">
      <div className="max-w-5xl w-full mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-foreground">Profil Saya</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl shadow-lg p-6 bg-card border border-border text-card-foreground">
            <h2 className="text-xl font-bold mb-4">Informasi Profil</h2>

            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden bg-muted border-2 border-border">
                  <User
                    size={40}
                    className="text-muted-foreground opacity-50"
                  />
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 p-1.5 rounded-full shadow-lg transition-all hover:scale-110 bg-primary text-primary-foreground"
                >
                  <Camera size={14} />
                </button>
              </div>
              <p className="text-xs mt-2 text-muted-foreground">
                Klik ikon kamera untuk mengubah foto
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white"
                  size={16}
                />
                <Input
                  type="email"
                  value={email}
                  disabled
                  className="pl-9 h-10 bg-muted/50 border-border text-white cursor-not-allowed text-sm"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl shadow-lg p-6 bg-card border border-border text-card-foreground">
            <h2 className="text-xl font-bold mb-4">Ubah Password</h2>

            {statusMessage.text && (
              <div className="mb-3">
                <Alert
                  variant={
                    statusMessage.type === "error" ? "destructive" : "default"
                  }
                  className={`py-2 ${
                    statusMessage.type === "success"
                      ? "border-green-500 bg-green-500/10 text-green-500"
                      : ""
                  }`}
                >
                  {statusMessage.type === "error" ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                  <AlertTitle className="text-sm">
                    {statusMessage.type === "error" ? "Gagal" : "Berhasil"}
                  </AlertTitle>
                  <AlertDescription className="text-xs text-white">
                    {statusMessage.text}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <form className="space-y-3" onSubmit={handleChangePassword}>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Password Saat Ini
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={old_password}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`pl-9 pr-9 h-10 text-sm bg-background border-border text-foreground ${
                      errors.old_password ? "border-destructive" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {errors.old_password && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.old_password[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Password Baru
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={new_password}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    className={`pl-9 pr-9 h-10 text-sm bg-background border-border text-foreground ${
                      errors.new_password ? "border-destructive" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.new_password && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.new_password[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Konfirmasi Password Baru
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password baru"
                    className={`pl-9 pr-9 h-10 text-sm bg-background border-border text-foreground ${
                      errors.confirmPassword ? "border-destructive" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.confirmPassword[0]}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-secondary text-primary hover:text-white mt-4"
              >
                {loading ? "Memproses..." : "Ubah Password"}
              </Button>
            </form>

            <div className="mt-3 p-2.5 rounded-lg bg-muted/30 border border-border">
              <p className="text-xs font-semibold mb-1 text-foreground">
                Persyaratan Password:
              </p>
              <ul className="text-xs space-y-0.5 text-muted-foreground">
                <li>• Minimal 8 karakter</li>
                <li>• Kombinasi huruf dan angka</li>
                <li>• Berbeda dari password lama</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <Button variant="ghost" asChild className="h-9">
            <a
              href="/dashboard"
              className="text-muted-foreground hover:text-white transition-colors text-sm"
            >
              ← Kembali ke Dashboard
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
