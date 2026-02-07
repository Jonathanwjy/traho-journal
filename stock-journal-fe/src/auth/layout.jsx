import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Layout({
  children,
  values,
  setter,
  onSubmit,
  linkTo,
  buttonText,
  alternate,
  link,
  errors = {},
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex items-center justify-center p-4"
        style={{ maxHeight: "650px" }}
      >
        <div
          className="w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex"
          style={{ maxHeight: "650px" }}
        >
          {/* Left Side - Login Form */}
          <div
            className="w-full md:w-1/2 p-8 flex flex-col justify-center"
            style={{ backgroundColor: "#37353E" }}
          >
            <div className="max-w-md mx-auto w-full">
              {children}
              {/* Header */}
              <div className="text-center mb-6">
                <h1
                  className="text-3xl font-bold mb-2"
                  style={{ color: "#D3DAD9" }}
                >
                  Selamat Datang
                </h1>
              </div>

              {/* Form */}
              <form onSubmit={onSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#D3DAD9" }}
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
                      size={18}
                      style={{ color: "#D3DAD9" }}
                    />
                    <Input
                      id="email"
                      type="email"
                      value={values.email}
                      onChange={(e) => setter.setEmail(e.target.value)}
                      placeholder="Masukkan email "
                      className="w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-all text-sm"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        color: "#D3DAD9",
                        border: "1px solid rgba(211, 218, 217, 0.2)",
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor =
                          "rgba(211, 218, 217, 0.5)")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor =
                          "rgba(211, 218, 217, 0.2)")
                      }
                    />
                  </div>
                  {errors.email && errors.email[0] && (
                    <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
                      {errors.email[0]}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#D3DAD9" }}
                  >
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
                      size={18}
                      style={{ color: "#D3DAD9" }}
                    />
                    <Input
                      id="password"
                      type={values.showPassword ? "text" : "password"}
                      value={values.password}
                      onChange={(e) => setter.setPassword(e.target.value)}
                      placeholder="Masukkan Password"
                      className="w-full pl-10 pr-10 py-3 rounded-lg outline-none transition-all text-sm"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        color: "#D3DAD9",
                        border: "1px solid rgba(211, 218, 217, 0.2)",
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor =
                          "rgba(211, 218, 217, 0.5)")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor =
                          "rgba(211, 218, 217, 0.2)")
                      }
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setter.setShowPassword(!values.showPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
                    >
                      {values.showPassword ? (
                        <EyeOff size={18} style={{ color: "#D3DAD9" }} />
                      ) : (
                        <Eye size={18} style={{ color: "#D3DAD9" }} />
                      )}
                    </button>
                  </div>
                  {errors.password && errors.password[0] && (
                    <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
                      {errors.password[0]}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  style={{
                    backgroundColor: "#D3DAD9",
                    color: "#37353E",
                  }}
                >
                  {buttonText}
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm" style={{ color: "#D3DAD9" }}>
                  {linkTo}
                  <Link
                    to={link}
                    clLinkssName="font-semibold hover:underline"
                    style={{ color: "#D3DAD9" }}
                  >
                    {alternate}
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Image Section */}
          <div
            className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-8"
            style={{ backgroundColor: "#D3DAD9" }}
          >
            <div className="max-w-md w-full">
              {/* Welcome Text */}
              <div className="text-center mb-6">
                <h2
                  className="text-3xl font-bold mb-3"
                  style={{ color: "#37353E" }}
                >
                  TRAHO JOURNAL
                </h2>
                <p
                  className="text-base opacity-80"
                  style={{ color: "#37353E" }}
                >
                  Jurnaling trade kamu jadi lebih mudah
                </p>
              </div>

              {/* Image Placeholder for Bull */}
              <div className="relative mb-6">
                <div
                  className="rounded-xl flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundColor: "rgba(55, 53, 62, 0.05)",
                    height: "280px",
                    border: "2px dashed rgba(55, 53, 62, 0.2)",
                  }}
                >
                  <img
                    src="src/images/bull.png"
                    alt="Bull Market"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Additional Text */}
              <div className="text-center">
                <p className="text-sm opacity-70" style={{ color: "#37353E" }}>
                  Fitur yang lengkap disesuaikan oleh perilaku trader
                  <br />
                  Tampilan menarik dan visualisasi grafik
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
