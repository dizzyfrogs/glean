"use client";

import { useRef } from "react";
import { Upload, CircleX } from "lucide-react";

interface PhotoUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  optional?: boolean;
  helperText?: string;
}

export function PhotoUpload({ value, onChange, label = "Photo", optional, helperText = "Optional, helps managers review" }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(URL.createObjectURL(file));
  }

  function remove() {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <p className="text-[13px] font-semibold text-[#1a1916] mb-2 font-jakarta">
        {label}
        {optional && <span className="font-normal text-[#7d7870] ml-1">(optional)</span>}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={handleFile}
        aria-label="Upload photo"
      />
      {value ? (
        <div
          className="relative rounded-[12px] overflow-hidden border border-[#e7e5e0]"
          style={{ height: 160 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Waste entry photo" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={remove}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:bg-[#f4f3f0] transition-colors"
            aria-label="Remove photo"
          >
            <CircleX size={16} strokeWidth={1.5} className="text-[#5c5851]" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-dashed border-[#d4d1ca] bg-white py-6 hover:border-[#4a7c2f] hover:bg-[#f9fbf7] transition-all duration-150 cursor-pointer"
        >
          <Upload size={20} strokeWidth={1.5} className="text-[#7d7870]" aria-hidden="true" />
          <span className="text-[13px] font-semibold text-[#5c5851] font-jakarta">
            Attach a photo
          </span>
          <span className="text-[12px] text-[#7d7870] font-jakarta">
            {helperText}
          </span>
        </button>
      )}
    </div>
  );
}
