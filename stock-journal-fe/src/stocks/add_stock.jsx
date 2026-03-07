import React, { useState } from "react";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { addStock } from "@/api/StockApi";
import StockForm from "@/components/form/stock_form";

export default function AddStock() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleAddStock = async (formData) => {
    setLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        average_price: formData.buy_price,
      };

      await addStock(payload);
      setSuccess(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(error);
        alert("Terjadi kesalahan saat menyimpan data.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 bg-background text-foreground min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Transaksi Baru</h1>
            <p className="text-muted-foreground text-sm">
              Masukan detail saham
            </p>
          </div>
        </div>

        {success && (
          <div className="mb-6">
            <Alert className="bg-green-500/10 border-green-500 text-green-500">
              <TrendingUp className="h-4 w-4" />
              <AlertTitle>Berhasil!</AlertTitle>
              <AlertDescription>Saham berhasil ditambahkan.</AlertDescription>
            </Alert>
          </div>
        )}

        <StockForm
          onSubmit={handleAddStock}
          isLoading={loading}
          errors={errors}
          buttonText="Buat Trade"
        />
      </div>
    </div>
  );
}
