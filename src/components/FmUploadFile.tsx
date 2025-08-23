import React, { useRef, useState, useCallback, useEffect } from "react";
import { CmUploadFile } from "./CmUploadFile";

type PreviewState = {
  url: string | null;
  name: string | null;
  sizeKB: number | null;
};

export const FmUploadPage: React.FC = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<PreviewState>({
    url: null,
    name: null,
    sizeKB: null,
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

 
  useEffect(() => {
    return () => {
      if (preview.url) URL.revokeObjectURL(preview.url);
    };
  }, [preview.url]);

  const openPicker = () => fileRef.current?.click();

  const applyFile = useCallback(
    (f: File) => {
      if (!f.type.startsWith("image/")) {
        alert("لطفاً فقط تصویر انتخاب کنید.");
        return;
      }
      if (preview.url) URL.revokeObjectURL(preview.url);
      const url = URL.createObjectURL(f);
      setPreview({ url, name: f.name, sizeKB: Math.round(f.size / 1024) });
      setFile(f);
    },
    [preview.url]
  );

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (f) applyFile(f);
 
    e.currentTarget.value = "";
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) applyFile(f);
  };
  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = () => setDragging(false);

  const onRemove = () => {
    if (preview.url) URL.revokeObjectURL(preview.url);
    setPreview({ url: null, name: null, sizeKB: null });
    setFile(null);
  };

  const onSubmit = async () => {
    if (!file || isSubmitting) return;
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setResponse(" تصویر با موفقیت شناسایی شد");
    } catch {
      setResponse(" خطا در شناسایی فایل");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main
      dir="rtl"
      className="w-full flex items-center justify-center bg-blue-950"
    >
      <CmUploadFile
        isDragging={isDragging}
        imagePreviewUrl={preview.url}
        fileName={preview.name}
        fileSizeKB={preview.sizeKB}
        onPick={openPicker}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onRemove={onRemove}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        response={response}
      />


      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChange}
      />
    </main>
  );
};
