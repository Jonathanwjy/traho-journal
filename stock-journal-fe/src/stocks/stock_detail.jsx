import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Edit,
  TrendingUp,
  DollarSign,
  Hash,
  Loader2,
  HandCoins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getStockDetail } from "@/api/StockApi";
// Import komponen Notes yang sudah dipisah
import NoteCard from "@/notes/note_card"; // Pastikan path ini sesuai struktur folder Anda
import ClosePositionDialog from "./close_postion";
import { closePosition } from "@/api/StockApi";

export default function StockDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const [selectedStockToClose, setSelectedStockToClose] = useState(null);
  const [isSubmittingClose, setIsSubmittingClose] = useState(false); // Loading tombol dialog
  const [closeErrors, setCloseErrors] = useState({});

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      // Jika data belum ada (load pertama), set loading true.
      // Jika data sudah ada (refresh karena update notes), biarkan false agar tidak flickering.
      if (!stock) setLoading(true);

      const response = await getStockDetail(id);
      setStock(response.data.data);
    } catch (err) {
      console.error("Error fetching detail:", err);
      setError("Gagal mengambil detail saham.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCloseDialog = (stock) => {
    setSelectedStockToClose(stock);
    setCloseErrors({});
    setIsCloseDialogOpen(true);
  };

  const handleSubmitClose = async (stockId, payload) => {
    setCloseErrors({});
    setIsSubmittingClose(true);
    try {
      await closePosition(stockId, payload);
      fetchDetail();
      setIsCloseDialogOpen(false);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 422) {
        // Validation Error dari Laravel (misal: lot kurang, tanggal kosong)
        setCloseErrors(error.response.data.errors);
      } else {
        // Error Server Lain
        alert(error.response?.data?.message || "Gagal menutup posisi.");
      }
    } finally {
      setIsSubmittingClose(false);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (error || !stock) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Data tidak ditemukan"}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate("/dashboard")} className="mt-4">
          Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        {" "}
        {/* Lebarkan container utama agar muat banyak */}
        {/* --- Header Navigation --- */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="pl-0 hover:bg-transparent hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Dashboard
          </Button>
        </div>
        {/* --- Title & Status Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-extrabold tracking-tight">
                {stock.name}
              </h1>
            </div>
            <p className="text-muted-foreground mt-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Dibeli pada {formatDate(stock.buy_date)}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => handleOpenCloseDialog(stock)}
            >
              <HandCoins className="mr-2 h-4 w-4" /> Close
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* KOLOM 1: Informasi Transaksi (1/3 Lebar) */}
          {/* Secara default mengambil 1 kolom dari 3 (33%) */}
          <Card className="md:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Informasi
                Transaksi
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6">
              {/* ... isi konten sama ... */}
              <div className="bg-muted/30 p-4 rounded-lg border border-border">
                <p className="text-sm text-background mb-1">Balance</p>
                <p className="text-3xl font-bold text-background">
                  {formatRupiah(stock.balance)}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <div className="flex items-center gap-2 text-background">
                    <DollarSign className="h-4 w-4" /> Harga Beli Awal
                  </div>
                  <span className="font-semibold text-lg text-background">
                    {formatRupiah(stock.buy_price)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <div className="flex items-center gap-2 text-background">
                    <Hash className="h-4 w-4" /> Total Lot
                  </div>
                  <span className="font-semibold text-lg text-background">
                    {stock.lot_size} Lot
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <div className="flex items-center gap-2 text-background">
                    <Hash className="h-4 w-4" /> Average Price
                  </div>
                  <span className="font-semibold text-lg text-background">
                    {formatRupiah(stock.average_price)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KOLOM 2: Notes & Journal (2/3 Lebar) */}
          {/* md:col-span-2 artinya mengambil 2 kolom dari total 3 (66%) */}
          <div className="md:col-span-2 w-full">
            <NoteCard
              stockId={id}
              conviction={stock.conviction}
              onTransactionUpdate={fetchDetail}
            />
          </div>
        </div>
      </div>

      <ClosePositionDialog
        isOpen={isCloseDialogOpen}
        onClose={() => setIsCloseDialogOpen(false)}
        stock={selectedStockToClose}
        errors={closeErrors} // <-- Pass Error ke Child
        isLoading={isSubmittingClose} // <-- Pass Loading ke Child
        onSubmit={handleSubmitClose}
      />
    </div>
  );
}
