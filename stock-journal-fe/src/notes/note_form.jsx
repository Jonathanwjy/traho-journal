import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const defaultValues = {
  type: "note",
  price: "",
  lot: "",
  note_date: new Date().toISOString().split("T")[0],
  content: "",
};

const sanitizeValues = (data) => {
  if (!data) return defaultValues;

  const rawType = data.type ? String(data.type).trim().toLowerCase() : "note";
  const validTypes = ["note", "avg_up", "avg_down"];
  const finalType = validTypes.includes(rawType) ? rawType : "note";

  return {
    type: finalType,
    price: data.price ? String(data.price) : "",
    lot: data.lot ? String(data.lot) : "",
    note_date: data.note_date
      ? data.note_date.split("T")[0]
      : defaultValues.note_date,
    content: data.content || "",
  };
};

export default function NoteForm({
  initialData,
  onSubmit,
  errors = {},
  isLoading = false,
  buttonText = "Simpan",
}) {
  const [formData, setFormData] = useState(() => sanitizeValues(initialData));

  useEffect(() => {
    setFormData(sanitizeValues(initialData));
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: formData.type === "note" ? null : formData.price,
      lot: formData.type === "note" ? null : formData.lot,
    };

    onSubmit(payload);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tipe Catatan</Label>
          <Select
            value={formData.type}
            onValueChange={(val) => handleChange("type", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="note">Catatan</SelectItem>
              <SelectItem value="avg_up">Average Up</SelectItem>
              <SelectItem value="avg_down">Average Down</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tanggal</Label>
          <Input
            type="date"
            value={formData.note_date}
            onChange={(e) => handleChange("note_date", e.target.value)}
            required
          />
          {errors.note_date && (
            <p className="text-xs text-red-500">{errors.note_date[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Harga</Label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
            disabled={formData.type === "note"}
            placeholder="0"
          />
          {errors.price && (
            <p className="text-xs text-red-500">{errors.price[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Jumlah Lot</Label>
          <Input
            type="number"
            value={formData.lot}
            onChange={(e) => handleChange("lot", e.target.value)}
            disabled={formData.type === "note"}
            placeholder="0"
          />
          {errors.lot && (
            <p className="text-xs text-red-500">{errors.lot[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Isi Catatan</Label>
        <Textarea
          placeholder="Alasan entry/exit..."
          value={formData.content}
          onChange={(e) => handleChange("content", e.target.value)}
        />
        {errors.content && (
          <p className="text-xs text-red-500">{errors.content[0]}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {buttonText}
      </Button>
    </form>
  );
}
