import { useEffect, useState } from "react";
import StockCard from "./stocks/stock_card";
import { getStocks, closePosition } from "./api/StockApi";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ClosePositionDialog from "./stocks/close_postion";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";
import { Input } from "./components/ui/input";

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const [selectedStockToClose, setSelectedStockToClose] = useState(null);
  const [isSubmittingClose, setIsSubmittingClose] = useState(false); // Loading tombol dialog
  const [closeErrors, setCloseErrors] = useState({});

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
      fetchStocks();
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

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getStocks();

      console.log("Response:", response.data); // Debug

      // Sesuaikan dengan struktur response Laravel Anda
      if (response.data.success) {
        setStocks(response.data.data); // Ambil data dari response
      } else {
        setError("Gagal memuat data saham");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Gagal memuat data saham");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (stock) => {
    console.log("Edit stock:", stock);
  };

  const openStocks = stocks.filter((stock) => stock.status === "open");
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const searchedStocks = openStocks.filter((stock) => {
    if (!searchQuery) return true; // Jika search kosong, tampilkan semua
    return stock.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const currentStocks = searchedStocks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(searchedStocks.length / itemsPerPage);

  // Helper untuk navigasi aman
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="text-center mt-4">
            <Button onClick={fetchStocks}>Coba Lagi</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-muted-foreground">
              Portfolio Saham
            </h1>
            <p className="text-muted-foreground mt-1">
              Total: {openStocks.length} saham
            </p>
          </div>
          <Button onClick={() => (window.location.href = "/stocks/store")}>
            <Plus size={18} className="mr-2" />
            Tambah Saham
          </Button>
        </div>

        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari kode saham..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset ke halaman 1 saat user mengetik
              }}
            />
          </div>
        </div>

        {/* Summary Stats */}
        {openStocks.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-7 mb-5">
            <div className="p-4 rounded-lg bg-card border border-border">
              <p className="text-sm text-background">Total Saham</p>
              <p className="text-2xl font-bold mt-1 text-background">
                {openStocks.length}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <p className="text-sm text-background">Long | Short</p>
              <p className="text-2xl font-bold mt-1 text-background">
                {openStocks.filter((s) => s.action === "long").length} |{" "}
                {openStocks.filter((s) => s.action === "short").length}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <p className="text-sm text-background">Total Balance</p>
              <p className="text-2xl font-bold mt-1 text-background">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(
                  openStocks.reduce((sum, stock) => sum + stock.balance, 0),
                )}
              </p>
            </div>
          </div>
        )}

        {openStocks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentStocks.map((stock) => (
                <StockCard
                  key={stock.id}
                  stock={stock}
                  onEdit={handleEdit}
                  onDelete={() => handleOpenCloseDialog(stock)}
                />
              ))}
            </div>

            <ClosePositionDialog
              isOpen={isCloseDialogOpen}
              onClose={() => setIsCloseDialogOpen(false)}
              stock={selectedStockToClose}
              errors={closeErrors} // <-- Pass Error ke Child
              isLoading={isSubmittingClose} // <-- Pass Loading ke Child
              onSubmit={handleSubmitClose}
            />

            {/* --- SHADCN PAGINATION --- */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    {/* Tombol Previous */}
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {/* Loop Nomor Halaman */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={page === currentPage}
                            onClick={() => handlePageChange(page)}
                            className="cursor-pointer bg-muted"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}

                    {/* Tombol Next */}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-12">Belum ada data...</div>
        )}
      </div>
    </div>
  );
}
