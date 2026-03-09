import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, History, TrendingUp, TrendingDown } from "lucide-react";
import { getClosedPositions, getStats, getGrowthChart } from "@/api/StatApi";
import RefreshStatsButton from "./refresh_button";
import StatCards from "./stat_card";
import GrowthChart from "./growth_chart";
import { formatDate, formatRupiah } from "@/utils/format";

export default function StatIndex() {
  const navigate = useNavigate();
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [statsData, setStatsData] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchHistory();
    fetchStats();
    fetchChart();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await getClosedPositions();
      const historyData = response.data.data || [];

      if (Array.isArray(historyData)) {
        setAllData(historyData);
      } else {
        setAllData([]);
      }
    } catch (error) {
      console.error("Gagal mengambil history:", error);
      setAllData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getStats();
      setStatsData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchChart = async () => {
    try {
      const response = await getGrowthChart();
      setChartData(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data grafik:", error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = Array.isArray(allData)
    ? allData.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = Math.ceil((allData?.length || 0) / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <RefreshStatsButton></RefreshStatsButton>

        <div className="mt-4">
          <StatCards stats={statsData} />
        </div>
        <div className="grid grid-cols-1 mb-4">
          <GrowthChart data={chartData} />
        </div>
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl text-background">
              <History className="h-6 w-6 text-primary" />
              Trade History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="hidden md:table-cell w-[60px] text-center text-primary font-bold">
                      No
                    </TableHead>
                    <TableHead className="text-primary font-bold px-3 py-3">
                      Saham
                    </TableHead>
                    <TableHead className="text-primary font-bold px-3">
                      Tanggal Jual
                    </TableHead>
                    <TableHead className="text-right text-primary font-bold px-3">
                      Profit/Loss
                    </TableHead>
                    <TableHead className="hidden md:table-cell text-right text-primary font-bold px-3">
                      % Gain
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-32 text-center text-background"
                      >
                        <div className="flex justify-center items-center gap-2">
                          <Loader2 className="animate-spin h-5 w-5 text-primary" />
                          Memuat data...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : currentData.length > 0 ? (
                    currentData.map((item, index) => {
                      const isProfit = item.realized_gain >= 0;
                      const rowNumber = indexOfFirstItem + index + 1;

                      return (
                        <TableRow
                          key={item.id}
                          onClick={() => navigate(`/stats/detail/${item.id}`)}
                          className="group hover:bg-muted/80 cursor-pointer transition-all active:scale-[0.99]"
                        >
                          <TableCell className="hidden md:table-cell text-center font-medium text-background group-hover:text-primary transition-colors">
                            {rowNumber}
                          </TableCell>

                          <TableCell className="px-3 py-4">
                            <div className="font-bold text-sm sm:text-base text-background leading-tight group-hover:text-primary transition-colors">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-muted-foreground uppercase mt-1 md:hidden group-hover:text-primary/70 transition-colors">
                              {item.action}
                            </div>
                          </TableCell>

                          <TableCell className="text-background text-xs sm:text-sm px-3 group-hover:text-primary transition-colors">
                            {formatDate(item.close_date)}
                          </TableCell>

                          <TableCell
                            className={`text-right px-3 ${
                              isProfit ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            <div className="font-bold text-sm sm:text-base">
                              {formatRupiah(item.realized_gain)}
                            </div>
                            <div className="flex items-center justify-end gap-1 text-[10px] md:hidden font-semibold mt-0.5">
                              {isProfit ? (
                                <TrendingUp size={10} />
                              ) : (
                                <TrendingDown size={10} />
                              )}
                              {item.percentage_gain}%
                            </div>
                          </TableCell>

                          <TableCell className="hidden md:table-cell text-right px-3">
                            <div
                              className={`flex items-center justify-end gap-1 font-semibold ${
                                isProfit ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {isProfit ? (
                                <TrendingUp size={14} />
                              ) : (
                                <TrendingDown size={14} />
                              )}
                              {Number(item.percentage_gain).toFixed(2)}%
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-muted-foreground"
                      >
                        Belum ada riwayat transaksi.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePageChange(currentPage - 1);
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) =>
                  (totalPages < 5 ||
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)) && (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePageChange(page);
                        }}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ),
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePageChange(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
