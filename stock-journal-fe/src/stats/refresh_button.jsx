import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";
import { refreshStats } from "@/api/StatApi";

export default function RefreshStatsButton({ onRefreshSuccess }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);

      // Memanggil API yang sudah diperbaiki (POST method)
      await refreshStats();

      // Callback jika Anda ingin melakukan aksi tambahan setelah sukses
      if (onRefreshSuccess) {
        onRefreshSuccess();
      } else {
        // Default: Reload halaman untuk sinkronisasi data UI
        window.location.reload();
      }
    } catch (error) {
      console.error("Gagal memperbarui statistik:", error);
      alert("Gagal memperbarui statistik. Silakan coba lagi.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button
      onClick={handleRefresh}
      disabled={isRefreshing}
      variant="outline"
      className="flex items-center gap-2 border-primary text-primary hover:bg-muted-foreground transition-all active:scale-95"
    >
      {isRefreshing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCw className="h-4 w-4" />
      )}

      <span className="font-bold">
        {isRefreshing ? "Updating..." : "Refresh Stats"}
      </span>
    </Button>
  );
}
