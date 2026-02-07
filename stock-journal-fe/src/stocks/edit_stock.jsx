import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// Sesuaikan path import ini dengan struktur folder Anda yang terakhir
import StockForm from "../components/form/stock_form";
import { getStockDetail, updateStock } from "@/api/StockApi";

export default function EditStock() {
  const { id } = useParams(); // Ambil ID dari URL
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(false); // Loading saat tombol simpan ditekan
  const [fetching, setFetching] = useState(true); // Loading saat ambil data awal
  const [initialData, setInitialData] = useState({}); // Data saham dari database
  const [errors, setErrors] = useState({}); // Error validasi
  const [success, setSuccess] = useState(false); // Notifikasi sukses
  // Di dalam komponen EditStock
  const [generalError, setGeneralError] = useState(""); // <--- Tambahkan ini

  // 1. Fetch Data saat halaman dibuka
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStockDetail(id);
        // Pastikan response.data.data sesuai dengan struktur JSON API Anda
        setInitialData(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        alert("Data tidak ditemukan");
        navigate("/dashboard"); // Redirect jika ID salah
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // 2. Handle Update (Dipanggil saat form disubmit)
  const handleUpdate = async (formData) => {
    setLoading(true);
    setErrors({});
    setSuccess(false);
    setGeneralError("");

    try {
      // Panggil API updateStock dengan (ID, Data)
      await updateStock(id, formData);

      setSuccess(true);

      // Redirect setelah sukses
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      if (error.response?.status === 422) {
        const responseData = error.response.data;

        // 1. Error Validasi (Input Field)
        if (responseData.errors) {
          setErrors(responseData.errors);
        }

        // 2. Error Global (Logic Controller)
        if (responseData.message) {
          setGeneralError(responseData.message); // <--- Simpan pesan error
        }
      } else {
        console.error(error);
        setGeneralError("Terjadi kesalahan sistem.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Tampilkan Loading Spinner saat data belum siap
  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-background text-foreground min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Header & Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Transaksi</h1>
            <p className="text-muted-foreground text-sm">
              Perbarui detail saham {initialData.name || "..."}
            </p>
          </div>
        </div>

        {generalError && (
          <div className="mb-6">
            <Alert
              variant="destructive"
              className="bg-red-500/10 border-red-500 text-red-500"
            >
              <AlertTitle>Gagal Update!</AlertTitle>
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6">
            <Alert className="bg-green-500/10 border-green-500 text-green-500">
              <TrendingUp className="h-4 w-4" />
              <AlertTitle>Berhasil Diupdate!</AlertTitle>
              <AlertDescription>
                Perubahan data telah disimpan.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Form Component */}
        {/* Kita oper 'initialData' agar form terisi otomatis */}
        <StockForm
          initialData={initialData}
          onSubmit={handleUpdate}
          isLoading={loading}
          errors={errors}
          buttonText="Update Data"
        />
      </div>
    </div>
  );
}
