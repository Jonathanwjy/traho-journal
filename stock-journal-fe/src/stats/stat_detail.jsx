import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Tag,
  TrendingUp,
  TrendingDown,
  Notebook,
} from "lucide-react";
import { getDetailClosed } from "@/api/StatApi";
import { Loader2 } from "lucide-react";
import { formatRupiah } from "@/utils/format";

export default function StatDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getDetailClosed(id);
        if (response?.data) {
          setData(response.data.data);
          setNotes(response.data.notes || []);
        }
      } catch (error) {
        console.error("Gagal memuat detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  if (!data)
    return (
      <div className="p-6 text-center text-background">
        <p className="mb-4">Data tidak ditemukan.</p>
        <Button onClick={() => navigate("/stats/index")}>Kembali</Button>
      </div>
    );

  const renderContent = (c) =>
    typeof c === "object" ? c?.content || JSON.stringify(c) : c || "-";

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 text-background">
      <div className="mx-auto max-w-3xl">
        <Button
          variant="outline"
          size="icon"
          className="group-hover:text-background"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} className="text-black hover:text-background" />
        </Button>
        <span className="text-black ml-2">Kembali</span>
        <div className="grid gap-6 mt-6">
          <Card className="border-none bg-[#2e2e38]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold text-background">
                  {data.name}
                </CardTitle>
                <Badge
                  variant="outline"
                  className="mt-2 text-background border-background"
                >
                  {data.action}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-background">
                  {formatRupiah(data.realized_gain)}
                </div>
                <div
                  className={`text-sm font-bold ${
                    data.realized_gain >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {data.percentage_gain}%
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-none bg-[#2e2e38]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-background">
                <Notebook className="h-5 w-5 text-background" /> Journal Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notes.length > 0 ? (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className="relative text-sm border-l-2 border-muted pl-3 py-2 pr-10 grouspanhover:bg-muted/10 rounded transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-muted/30 p-1 rounded-sm border border-border text-xs font-semibold">
                        {note.type.replace("_", " ").toUpperCase()}
                      </span>
                      <span className="text-xs text-background/70">
                        {new Date(
                          note.note_date || note.created_at,
                        ).toLocaleDateString("id-ID")}
                      </span>
                    </div>

                    <p className="font-medium mt-1 leading-relaxed">
                      {renderContent(note.content)}
                    </p>
                    {note.price && Number(note.price) > 0 && (
                      <p className="text-xs text-background/80 mt-1">
                        @{" "}
                        <span className="font-mono">
                          {formatRupiah(note.price)}
                        </span>
                        {note.lot > 0 && ` (${note.lot} Lot)`}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-background/60 italic">
                  Tidak ada catatan.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
