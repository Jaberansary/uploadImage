import React from "react";
import clsx from "clsx";

export type CmUploadFileProps = {
  isDragging?: boolean;
  imagePreviewUrl?: string | null;
  fileName?: string | null;
  fileSizeKB?: number | null;
  isSubmitting?: boolean;
  response?: string | null;

  onPick: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onRemove?: () => void;
  onSubmit: () => void;
};

export const CmUploadFile: React.FC<CmUploadFileProps> = ({
  isDragging,
  imagePreviewUrl,
  fileName,
  fileSizeKB,
  isSubmitting,
  response,
  onPick,
  onDrop,
  onDragOver,
  onDragLeave,
  onRemove,
  onSubmit,
}) => {
  const hasFile = Boolean(imagePreviewUrl);

  return (
    <section
      className="
        max-w-md w-[92vw]
        rounded-2xl border border-white/10 bg-white/5
        backdrop-blur-md shadow-2xl
        p-4 sm:p-6 text-white
      "
      aria-label="آپلود تصویر"
      dir="rtl"
    >
    
      <div
        role="button"
        tabIndex={0}
        aria-busy={isSubmitting ? "true" : "false"}
        onClick={!isSubmitting ? onPick : undefined}
        onKeyDown={(e) => {
          if (isSubmitting) return;
          if (e.key === "Enter" || e.key === " ") onPick();
        }}
        onDrop={!isSubmitting ? onDrop : undefined}
        onDragOver={!isSubmitting ? onDragOver : undefined}
        onDragLeave={!isSubmitting ? onDragLeave : undefined}
        className={clsx(
          "relative flex items-center justify-center",
          "rounded-xl border-2 border-dashed cursor-pointer",
          "h-64 sm:h-72 p-4",
          "transition ring-offset-0 focus:outline-none",
          isDragging
            ? "border-blue-300 bg-blue-300/10"
            : "border-white/15 hover:border-white/30",
          isSubmitting && "cursor-wait"
        )}
        aria-describedby="dropzone-help"
      >
   
        {hasFile ? (
          <div
            className={clsx(
              "absolute inset-0 m-4 rounded-lg overflow-hidden border border-white/10 bg-black/20",
   
              isSubmitting && "pointer-events-none"
            )}
          >
            <img
              src={imagePreviewUrl ?? ""}
              alt="پیش‌نمایش"
              className={clsx(
                "h-full w-full object-contain transition",
                isSubmitting && "opacity-60 blur-[1.5px]"
              )}
              loading="lazy"
            />

   
            {isSubmitting && (
              <div
                className="
                  absolute inset-0 flex flex-col items-center justify-center
                  bg-black/20
                "
                aria-live="polite"
              >
              
                <div
                  className="
                    w-10 h-10 rounded-full
                    border-2 border-white/30 border-t-white
                    animate-spin
                  "
                  aria-hidden="true"
                />
                <span className="mt-3 text-sm text-white/90">
                  در حال شناسایی
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-2">
              <span className="material-icons-outlined">insert_photo</span>
            </div>
            <p className="text-sm">
              برای انتخاب، کلیک کنید یا فایل را اینجا رها کنید
            </p>
          </div>
        )}
      </div>


      <p id="dropzone-help" className="text-xs text-white/70 mt-2">
        فقط تصاویر (PNG, JPG, WEBP, GIF) — حداکثر ۵ مگابایت
      </p>

   
      {hasFile && (
        <div className="mt-3 flex items-center justify-between gap-2 text-sm">
          <div className="min-w-0">
            <p className="truncate">{fileName}</p>
            {fileSizeKB != null && (
              <p className="text-white/70 text-xs mt-0.5">
                حدود {fileSizeKB.toLocaleString("fa-IR")} کیلوبایت
              </p>
            )}
          </div>
        </div>
      )}

      {response && (
        <div className="mt-3 flex items-center justify-between gap-2 text-md">
          {response}
        </div>
      )}

     
      <div className="mt-4 flex items-center justify-start gap-2">
        <button
          type="button"
          onClick={onPick}
          disabled={isSubmitting}
          className={clsx(
            "px-3 py-2 rounded-lg transition",
            "bg-white/10 hover:bg-white/20",
            isSubmitting && "opacity-60 cursor-not-allowed"
          )}
        >
          انتخاب فایل
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!hasFile || isSubmitting}
          className={clsx(
            "px-4 py-2 rounded-lg transition",
            hasFile && !isSubmitting
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-white/10 opacity-60 cursor-not-allowed"
          )}
        >
          {isSubmitting ? "  شناسایی…" : "ارسال فایل"}
        </button>
        {hasFile && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            disabled={isSubmitting}
            className="px-3 py-1.5 rounded-lg !bg-rose-500 !text-white transition text-sm
                           hover:!bg-rose-600 hover:!border-white hover:!text-white
                            focus:!border-2 focus:!bg-rose-800 focus:!border-pink-950 focus:!text-white
                            active:!border-2 active:!bg-rose-800 active:!border-pink-950 active:!text-white"
          >
            حذف
          </button>
        )}
      </div>
    </section>
  );
};
