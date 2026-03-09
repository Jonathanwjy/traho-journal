import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Package,
  Edit,
  Trash2,
  BarChart3,
  HandCoins,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate, formatRupiah } from "@/utils/format";

export default function StockCard({ stock, onDelete }) {
  const navigate = useNavigate();

  const getActionStyle = (action) => {
    if (action === "long") {
      return {
        color: "text-green-500",
        bg: "bg-green-500/10",
        border: "border-green-500/20",
        icon: <TrendingUp size={16} />,
      };
    }
    return {
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      icon: <TrendingDown size={16} />,
    };
  };

  const actionStyle = getActionStyle(stock.action);

  const handleCardClick = () => {
    navigate(`/stocks/${stock.id}/detail`);
  };

  return (
    <Card className="hover:shadow-2xl hover:scale-[1.02] shadow-primary shadow-2xl transition-all duration-300 bg-card border-border cursor-pointer group">
      <div onClick={handleCardClick}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-lg ${actionStyle.bg} border ${actionStyle.border} group-hover:scale-110 transition-transform duration-300`}
              >
                <span className={actionStyle.color}>{actionStyle.icon}</span>
              </div>
              <div>
                <CardTitle className="text-xl font-bold group-hover: transition-colors">
                  {stock.name.toUpperCase()}
                </CardTitle>
                <CardDescription className="text-xs mt-0.5 text-background">
                  {formatDate(stock.buy_date)}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <DollarSign size={14} className="text-white" />
                <span className="text-xs text-card-foreground">Buy Price</span>
              </div>
              <p className="text-lg font-semibold">
                {formatRupiah(stock.buy_price)}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <BarChart3 size={14} className="text-white" />
                <p className="text-xs text-white">Avg Price</p>
              </div>
              <p className="text-lg font-semibold">
                {formatRupiah(stock.average_price)}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Package size={14} className="text-white" />
              <span className="text-xs text-white">Lot Size</span>
            </div>
            <p className="text-base font-semibold">{stock.lot_size} Lot</p>
          </div>

          <div className="p-3 rounded-lg bg-muted/50 border border-border group-hover:bg-muted/70 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Balance</span>
              <span className="text-lg font-bold text-primary">
                {formatRupiah(stock.balance)}
              </span>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            Klik untuk melihat detail
          </div>
        </CardContent>
      </div>

      <CardFooter
        className="flex gap-2 pt-3 border-t border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="outline"
          size="sm"
          className="flex-1 hover:scale-105 transition-transform bg-transparent border-white/20 text-white hover:bg-background hover:text-card"
          onClick={() => navigate(`/stocks/${stock.id}/update`)}
        >
          <Edit size={14} className="mr-1.5" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1 hover:scale-105 transition-transform"
          onClick={() => onDelete(stock.id)}
        >
          <HandCoins size={14} className="mr-1.5" />
          Close
        </Button>
      </CardFooter>
    </Card>
  );
}
