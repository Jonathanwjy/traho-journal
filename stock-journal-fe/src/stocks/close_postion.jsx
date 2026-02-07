import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, DollarSign, Package, Calendar } from "lucide-react";

// Default values agar form reset bersih saat dibuka
const defaultFormValues = {
  sell_price: "",
  lot: "",
  close_date: new Date().toISOString().split("T")[0],
  reason: "",
};

export default function ClosePositionDialog({
  isOpen,
  onClose,
  stock,
  errors = {}, // Error validasi dari Parent (Laravel 422)
  onSubmit, // Fungsi submit ke Parent
  isLoading = false, // Loading state dari Parent
}) {
  const [formData, setFormData] = useState(defaultFormValues);

  // RESET FORM SAAT DIALOG DIBUKA
  // Dependency [isOpen] memastikan ini hanya jalan saat modal toggle
  useEffect(() => {
    if (isOpen) {
      setFormData(defaultFormValues);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kirim data ke Parent.
    // Parent yang bertanggung jawab melakukan API call & set errors.
    onSubmit(stock.id, {
      lot: formData.lot,
      sell_price: formData.sell_price,
      close_date: formData.close_date,
      reason: formData.reason,
    });
  };

  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  if (!stock) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Close Position: {stock.name}</DialogTitle>
          <DialogDescription>
            Masukkan detail penjualan saham ini.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            {/* --- INPUT TANGGAL --- */}
            <div className="space-y-2">
              <Label htmlFor="close_date" className="flex items-center gap-2">
                <Calendar size={14} /> Tanggal Jual
              </Label>
              <Input
                id="close_date"
                name="close_date"
                type="date"
                value={formData.close_date}
                onChange={handleChange}
                required
                className={
                  errors.close_date
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {errors.close_date && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.close_date[0]}
                </p>
              )}
            </div>

            {/* --- INPUT LOT --- */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="lot" className="flex items-center gap-2">
                  <Package size={14} /> Jumlah Lot
                </Label>
                <span className="text-xs text-muted-foreground">
                  Max: {stock.lot_size}
                </span>
              </div>
              <Input
                id="lot"
                name="lot"
                type="number"
                placeholder="0"
                value={formData.lot}
                onChange={handleChange}
                className={`font-mono ${errors.lot ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              {errors.lot && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.lot[0]}
                </p>
              )}
            </div>
          </div>

          {/* --- INPUT HARGA JUAL --- */}
          <div className="space-y-2">
            <Label htmlFor="sell_price" className="flex items-center gap-2">
              <DollarSign size={14} /> Harga Jual (Per Lembar)
            </Label>
            <Input
              id="sell_price"
              name="sell_price"
              type="number"
              placeholder="Contoh: 1500"
              value={formData.sell_price}
              onChange={handleChange}
              className={`font-mono ${errors.sell_price ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            />
            {errors.sell_price && (
              <p className="text-xs text-red-500 font-medium">
                {errors.sell_price[0]}
              </p>
            )}
          </div>

          {/* --- INPUT ALASAN --- */}
          <div className="space-y-2">
            <Label htmlFor="reason">Alasan Penjualan (Opsional)</Label>
            <Textarea
              id="reason"
              name="reason"
              placeholder="Kenapa jual? TP / CL?"
              value={formData.reason}
              onChange={handleChange}
              className={`resize-none h-20 ${errors.reason ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            />
            {errors.reason && (
              <p className="text-xs text-red-500 font-medium">
                {errors.reason[0]}
              </p>
            )}
          </div>

          {/* --- PREVIEW TOTAL --- */}
          {formData.sell_price && formData.lot && (
            <div className="p-3 bg-muted-foreground rounded-lg border border-border mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-white">Estimasi Balance:</span>
                <span className="font-bold text-white">
                  {formatRupiah(formData.sell_price * formData.lot * 100)}
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" variant="destructive" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Close Position
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
