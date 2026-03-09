import React, { useEffect, useState } from "react";
import { FileText, Plus, Loader2, Pencil } from "lucide-react"; // Import icon Pencil
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getNotes, addNote, updateNote } from "@/api/NotesApi";
import NoteForm from "@/notes/note_form";
import { formatRupiah } from "@/utils/format";

export default function NoteCard({ stockId, conviction, onTransactionUpdate }) {
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noteErrors, setNoteErrors] = useState({});

  useEffect(() => {
    if (stockId) fetchNotes();
  }, [stockId]);

  const fetchNotes = async () => {
    try {
      setLoadingNotes(true);
      const response = await getNotes(stockId);
      setNotes(response.data.data);
    } catch (error) {
      console.error("Gagal ambil notes", error);
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleOpenAdd = () => {
    setSelectedNote(null);
    setNoteErrors({});
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (note) => {
    setSelectedNote(note);
    setNoteErrors({});
    setIsDialogOpen(true);
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setNoteErrors({});

    try {
      if (selectedNote) {
        await updateNote(selectedNote.id, formData);
      } else {
        await addNote(stockId, formData);
      }

      await fetchNotes();
      if (onTransactionUpdate) {
        onTransactionUpdate();
      }

      setIsDialogOpen(false);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setNoteErrors(error.response.data.errors);
      } else {
        alert(error.response?.data?.message || "Terjadi kesalahan.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = (c) =>
    typeof c === "object" ? c?.content || JSON.stringify(c) : c || "-";

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> Catatan / Alasan
        </CardTitle>

        <Button
          variant="outline"
          size="icon"
          onClick={handleOpenAdd}
          className="h-8 w-8 rounded-full border-primary/20 text-primary hover:bg-primary/20"
        >
          <Plus className="h-4 w-4" />
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedNote ? "Edit Catatan" : "Tambah Catatan"}
              </DialogTitle>
            </DialogHeader>

            <NoteForm
              initialData={selectedNote}
              onSubmit={handleSubmit}
              errors={noteErrors}
              isLoading={isSubmitting}
              buttonText={selectedNote ? "Update" : "Simpan"}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <div className="mb-6 bg-muted/30 p-4 rounded-lg border border-border">
          {conviction ? (
            <div className="text-sm">"{conviction}"</div>
          ) : (
            <p className="text-sm italic">No conviction.</p>
          )}
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider">
            Riwayat Catatan ({notes.length})
          </p>

          {loadingNotes ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin h-4 w-4" />
            </div>
          ) : notes.length > 0 ? (
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="relative text-sm border-l-2 border-muted pl-3 py-2 pr-10 group hover:bg-muted/10 rounded transition-colors"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenEdit(note)}
                    className="absolute right-0 top-1 h-7 w-7 text-white hover:bg-muted hover:text-black transition duration-300"
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>

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
              ))}
            </div>
          ) : (
            <div className="text-center py-4 bg-muted/20 border border-dashed rounded-lg">
              Belum ada catatan.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
