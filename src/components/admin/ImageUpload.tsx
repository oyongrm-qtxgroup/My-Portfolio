import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder,
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const ext = file.name.split(".").pop();
        const fileName = `${folder}/${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio-assets")
          .upload(fileName, file, { cacheControl: "3600", upsert: false });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("portfolio-assets")
          .getPublicUrl(fileName);

        onChange(data.publicUrl);
      } catch (err) {
        console.error("Upload failed:", err);
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        uploadFile(file);
      }
    },
    [uploadFile],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadFile(file);
    },
    [uploadFile],
  );

  const remove = useCallback(() => {
    onChange(null);
  }, [onChange]);

  if (value) {
    return (
      <div
        className={cn(
          "relative group rounded-lg overflow-hidden border border-border-custom",
          className,
        )}
      >
        <img src={value} alt="Uploaded" className="h-32 w-full object-cover" />
        <button
          type="button"
          onClick={remove}
          className="absolute top-2 right-2 rounded-full bg-bg-primary/80 p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500/80"
        >
          <X className="h-4 w-4 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors cursor-pointer",
        dragOver
          ? "border-accent-cyan bg-accent-cyan/5"
          : "border-border-custom hover:border-accent-cyan/50",
        className,
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {uploading ? (
        <Loader2 className="h-6 w-6 animate-spin text-accent-cyan" />
      ) : (
        <Upload className="h-6 w-6 text-text-secondary" />
      )}
      <div className="text-xs text-text-secondary">
        {uploading ? "Uploading…" : "Drop image or click to browse"}
      </div>
    </div>
  );
}

/** Small inline version for use in table rows */
export function ImagePreview({ url }: { url: string | null }) {
  if (!url) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded bg-bg-elevated">
        <ImageIcon className="h-4 w-4 text-text-muted" />
      </div>
    );
  }
  return <img src={url} alt="" className="h-8 w-8 rounded object-cover" />;
}
