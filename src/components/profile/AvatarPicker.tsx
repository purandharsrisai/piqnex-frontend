"use client";

import { useRef, useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

const SIZE = 256;

/** Center-crops the picked image to a square and shrinks it to a small JPEG data URL (~15-30 KB). */
async function toSmallJpeg(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas");
  ctx.drawImage(
    bitmap,
    (bitmap.width - side) / 2,
    (bitmap.height - side) / 2,
    side,
    side,
    0,
    0,
    SIZE,
    SIZE
  );
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.85);
}

/**
 * Photo picker for the profile form. Submits two hidden fields: `avatar` (new
 * photo as a data URL, or empty to remove) and `avatar_changed` ("1" only when
 * the user picked or removed a photo, so untouched forms never resend it).
 */
export function AvatarPicker({ initialUrl, name }: { initialUrl: string | null; name: string }) {
  const [url, setUrl] = useState<string | null>(initialUrl);
  const [changed, setChanged] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    try {
      setUrl(await toSmallJpeg(file));
      setChanged(true);
      setError(null);
    } catch {
      setError("We couldn't read that image. Try a JPG or PNG.");
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar url={url} name={name} className="h-20 w-20 border-4 border-white text-3xl ring-2 ring-ink-300" />
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
            <Camera className="h-4 w-4" aria-hidden="true" /> {url ? "Change photo" : "Upload photo"}
          </Button>
          {url && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setUrl(null);
                setChanged(true);
              }}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" /> Remove
            </Button>
          )}
        </div>
        <p className="text-xs text-ink-500">JPG or PNG. It is cropped to a square automatically.</p>
        {error && (
          <p role="alert" className="text-xs font-medium text-red-600">
            {error}
          </p>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={onPick} tabIndex={-1} aria-label="Choose profile photo" />
      <input type="hidden" name="avatar" value={url ?? ""} />
      <input type="hidden" name="avatar_changed" value={changed ? "1" : ""} />
    </div>
  );
}
