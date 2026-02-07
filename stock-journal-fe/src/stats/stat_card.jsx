import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Wallet,
} from "lucide-react";

export default function StatCards({ stats }) {
  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num || 0);

  const getProfitColor = (val) =>
    val >= 0 ? "text-green-500" : "text-red-500";

  return (
    <Card className="border-none bg-[#2e2e38] shadow-lg mb-8 overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-background/10">
          {/* 1. Win Rate */}
          <div className="p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-background/50 font-bold">
                Win Rate
              </span>
              <Target className="h-3 w-3 text-background/40" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-background">
              {stats?.win_rate || 0}%
            </div>
          </div>

          {/* 2. Total Realized (Net) + Detail Profit & Loss */}
          <div className="p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-background/50 font-bold">
                Net Realized
              </span>
              <Wallet className="h-3 w-3 text-background/40" />
            </div>
            <div
              className={`text-lg sm:text-2xl font-bold truncate ${getProfitColor(stats?.realized_earn)}`}
            >
              {formatRupiah(stats?.realized_earn)}
            </div>
            {/* Detail Realized Profit & Loss */}
            <div className="flex gap-2 text-[9px] font-bold mt-1">
              <span className="text-green-500">
                P: {formatRupiah(stats?.realized_profit)}
              </span>
              <span className="text-red-500">
                L: {formatRupiah(stats?.realized_loss)}
              </span>
            </div>
          </div>

          {/* 3. Total Trades */}
          <div className="p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-background/50 font-bold">
                Trades
              </span>
              <BarChart3 className="h-3 w-3 text-background/40" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-2xl font-bold text-background">
                {stats?.total_trades || 0}
              </span>
              <div className="flex gap-1 text-[9px] font-bold">
                <span className="text-green-500">W:{stats?.total_win}</span>
                <span className="text-red-500">L:{stats?.total_loss}</span>
              </div>
            </div>
          </div>

          {/* 4. Open Balance */}
          <div className="p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-background/50 font-bold">
                Active
              </span>
              <TrendingUp className="h-3 w-3 text-background/40" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-background truncate">
              {formatRupiah(stats?.total_balance)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
