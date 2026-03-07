import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import StockForm from "../components/form/stock_form";
import { getStockDetail, updateStock } from "@/api/StockApi";

export default function EditStock() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [initialData, setInitialData] = useState({});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStockDetail(id);
        setInitialData(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        alert("Data tidak ditemukan");
        navigate("/dashboard");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleUpdate = async (formData) => {
    setLoading(true);
    setErrors({});
    setSuccess(false);
    setGeneralError("");

    try {
      await updateStock(id, formData);

      setSuccess(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      if (error.response?.status === 422) {
        const responseData = error.response.data;

        if (responseData.errors) {
          setErrors(responseData.errors);
        }

        if (responseData.message) {
          setGeneralError(responseData.message);
        }
      } else {
        console.error(error);
        setGeneralError("Terjadi kesalahan sistem.");
      }
    } finally {
      setLoading(false);
    }
  };

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
