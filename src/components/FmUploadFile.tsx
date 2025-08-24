import React, { useRef, useState, useCallback, useEffect } from "react";
import { CmUploadFile } from "./CmUploadFile";

type PreviewState = {
  url: string | null;
  name: string | null;
  sizeKB: number | null;
};

type ApiResult = {
  text: string;
  imageUrl: string | null;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  prediction?: string;
  annotated_image_url?: string;
};

const API_ORIGIN = "https://saffron-ai.irscp.ir";
const API_URL = `/api/predict/`;

export const FmUploadPage: React.FC = () => {
  const fileRef = useRef<HTMLInputElement>(null);

  const [isDragging, setDragging] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  const [preview, setPreview] = useState<PreviewState>({
    url: null,
    name: null,
    sizeKB: null,
  });

  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview.url) URL.revokeObjectURL(preview.url);
    };
  }, [preview.url]);

  const openPicker = () => fileRef.current?.click();

  const applyFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) {
      alert("لطفاً فقط تصویر انتخاب کنید.");
      return;
    }
    if (preview.url) URL.revokeObjectURL(preview.url);

    const url = URL.createObjectURL(f);
    setPreview({ url, name: f.name, sizeKB: Math.round(f.size / 1024) });
    setFile(f);

    setResult(null);
    setErrorMsg(null);
  }, [preview.url]);

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
    setResult(null);
    setErrorMsg(null);
  };

  const onSubmit = async () => {
    if (!file || isSubmitting) return;

    setSubmitting(true);
    setResult(null);
    setErrorMsg(null);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(API_URL, {
        method: "POST",
        body: fd,
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: ApiResponse = await res.json();

      if (!data.success) {
        setErrorMsg(data.message || "نتوانستیم نتیجه معتبری دریافت کنیم.");
        return;
      }

      const parts = [
        data.message?.trim(),
        data.prediction ? `برچسب: ${data.prediction}` : undefined,
      ].filter(Boolean) as string[];

      const imageUrl = data.annotated_image_url
        ? new URL(data.annotated_image_url, API_ORIGIN).href
        : null;

      setResult({
        text: parts.join(" • "),
        imageUrl,
      });
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setErrorMsg("پاسخ‌گویی سرویس طولانی شد. دوباره تلاش کنید.");
      } else {
        setErrorMsg("خطا در فراخوانی سرویس یا پردازش پاسخ.");
        console.error(err);
      }
    } finally {
      clearTimeout(timer);
      setSubmitting(false);
    }
  };

  const showResult = Boolean(result);

  return (
    <main dir="rtl" className="w-full min-h-screen flex items-center justify-center bg-blue-950">
      {showResult ? (
        <section className="max-w-md w-[92vw] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 sm:p-6 text-white">
          <h2 className="text-lg font-bold mb-3">نتیجه تشخیص</h2>

          <p className="mb-2 text-sm">{result!.text}</p>

          {result!.imageUrl && (
            <div className="rounded-lg overflow-hidden border border-white/10 bg-black/10 p-2">
              <img
                src={result!.imageUrl}
                alt="Annotated result"
                className="w-full h-auto object-contain"
                loading="lazy"
              />
              <a
                href={result!.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="block text-xs text-blue-300 underline mt-1"
              >
                باز کردن تصویر در تب جدید
              </a>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onRemove}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm"
            >
              انتخاب فایل جدید
            </button>
          </div>
        </section>
      ) : (
        <>
          <section className="space-y-3 p-4">
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
            />

            {errorMsg && (
              <div className="max-w-md w-[92vw] text-sm text-rose-200">
                {errorMsg}
              </div>
            )}
          </section>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onChange}
          />
        </>
      )}
    </main>
  );
};
