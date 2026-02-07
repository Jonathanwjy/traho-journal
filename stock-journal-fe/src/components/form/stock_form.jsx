import React, { useState, useEffect } from "react";
import {
  Save,
  TrendingUp,
  DollarSign,
  Calendar,
  Hash,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function StockForm({
  initialData = {}, // Data awal (kosong untuk Add, terisi untuk Edit)
  onSubmit, // Function yang dipanggil parent saat submit
  isLoading, // State loading dari parent
  errors = {}, // Error validasi dari API
  buttonText = "Simpan Transaksi",
}) {
  // Default values
  const defaultValues = {
    name: "",
    buy_price: "",
    lot_size: "",
    buy_date: new Date().toISOString().split("T")[0],
    action: "long",
    conviction: "",
    ...initialData, // Override dengan data jika ada (mode Edit)
  };

  const [formData, setFormData] = useState(defaultValues);
  const [estimatedBalance, setEstimatedBalance] = useState(0);

  // Update state jika initialData berubah (penting untuk Edit page saat fetch data)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  // Efek hitung balance
  useEffect(() => {
    const price = parseFloat(formData.buy_price) || 0;
    const lot = parseInt(formData.lot_size) || 0;
    setEstimatedBalance(price * lot * 100);
  }, [formData.buy_price, formData.lot_size]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.toUpperCase().slice(0, 4),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Kirim data ke parent component
    onSubmit(formData);
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4 text-card-foreground">
        {/* Row 1: Ticker & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Kode Saham (Ticker)</label>
            <div className="relative">
              <TrendingUp
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <Input
                name="name"
                placeholder="BBCA"
                value={formData.name}
                onChange={handleChange}
                className={`pl-9 pr-9 h-10 text-sm bg-background border-border text-foreground ${
                  errors.name ? "border-destructive" : ""
                }`}
                maxLength={4}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tanggal Beli</label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <Input
                type="date"
                name="buy_date"
                value={formData.buy_date}
                onChange={handleChange}
                className={`pl-9 pr-9 h-10 text-sm bg-background border-border text-foreground ${
                  errors.buy_date ? "border-destructive" : ""
                }`}
              />
            </div>
            {errors.buy_date && (
              <p className="text-xs text-destructive">{errors.buy_date[0]}</p>
            )}
          </div>
        </div>

        {/* Row 2: Price & Lot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Harga Beli (Per Lembar)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                Rp
              </span>
              <Input
                type="number"
                name="buy_price"
                placeholder="0"
                value={formData.buy_price}
                onChange={handleChange}
                className={`pl-9 pr-9 h-10 text-sm bg-background border-border text-foreground ${
                  errors.buy_price ? "border-destructive" : ""
                }`}
              />
            </div>
            {errors.buy_price && (
              <p className="text-xs text-destructive">{errors.buy_price[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Jumlah Lot</label>
            <div className="relative">
              <Hash
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <Input
                type="number"
                name="lot_size"
                placeholder="0"
                value={formData.lot_size}
                onChange={handleChange}
                className={`pl-9 pr-9 h-10 text-sm bg-background border-border text-foreground ${
                  errors.lot_size ? "border-destructive" : ""
                }`}
              />
            </div>
            {errors.lot_size && (
              <p className="text-xs text-destructive">{errors.lot_size[0]}</p>
            )}
          </div>
        </div>

        {/* Row 3: Action & Conviction */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Posisi (Action)</label>
            <select
              name="action"
              value={formData.action}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="long">Long (Buy)</option>
              <option value="short">Short (Sell)</option>
            </select>
            {errors.action && (
              <p className="text-xs text-destructive">{errors.action[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Alasan / Catatan</label>
            <div className="relative">
              <FileText
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <Input
                name="conviction"
                placeholder="Breakout Resistance..."
                value={formData.conviction}
                onChange={handleChange}
                className={`pl-9 pr-9 h-10 text-sm bg-background border-border text-foreground ${
                  errors.conviction ? "border-destructive" : ""
                }`}
              />
            </div>
          </div>
        </div>

        {/* Total Balance Preview */}
        <div className="pt-4 border-t border-border mt-4">
          <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign size={18} />
              <span className="text-sm font-medium">Total Investasi</span>
            </div>
            <span className="text-xl font-bold text-primary">
              {formatRupiah(estimatedBalance)}
            </span>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 text-lg font-semibold shadow-lg hover:scale-[1.01] transition-transform"
      >
        {isLoading ? (
          "Memproses..."
        ) : (
          <span className="flex items-center gap-2">
            <Save size={18} /> {buttonText}
          </span>
        )}
      </Button>
    </form>
  );
}
