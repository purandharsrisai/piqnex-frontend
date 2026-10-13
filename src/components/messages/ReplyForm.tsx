"use client";

import { Toast } from "@/components/ui/Toast";
import { useEffect, useRef, useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { AlertCircle, ImagePlus, SendHorizontal, Tag } from "lucide-react";
import { sendMessageAction, sendPhotoAction } from "@/lib/actions/messages";
import { IDLE_STATE } from "@/lib/actions/types";
import { formatPrice } from "@/lib/utils";

function Send() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="Send message"
      className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-clay-600 px-4 text-sm font-bold text-white transition-colors hover:bg-clay-700 disabled:opacity-60"
    >
      <span className="hidden sm:inline">{pending ? "Sending..." : "Send"}</span>
      <SendHorizontal className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

/** Shrinks a chosen photo to a small JPEG so it is quick to send. */
async function shrinkToJpeg(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  for (const [max, quality] of [[960, 0.75], [720, 0.6], [520, 0.5]] as const) {
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL("image/jpeg", quality);
    if (url.length < 400_000) return url;
  }
  throw new Error("too large");
}

export interface OfferConfig {
  price: number;
  currency: string;
}

/**
 * Reply box with one-tap quick replies, an optional "Make an offer" button
 * (buyers only) and a notice when the part is no longer available.
 */
export function ReplyForm({
  conversationId,
  suggestions = [],
  offer,
  unavailable,
}: {
  conversationId: string;
  suggestions?: string[];
  offer?: OfferConfig;
  /** e.g. "sold" - shows a notice and hides quick replies and offers. */
  unavailable?: string | null;
}) {
  const [state, action] = useFormState(sendMessageAction, IDLE_STATE);
  const ref = useRef<HTMLFormElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [offerOpen, setOfferOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoPending, startPhoto] = useTransition();
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoSent, setPhotoSent] = useState<{ ok: true } | null>(null);

  function onPhoto(file: File | undefined) {
    if (!file) return;
    setPhotoError(null);
    if (!file.type.startsWith("image/")) {
      setPhotoError("Choose an image file.");
      return;
    }
    startPhoto(async () => {
      try {
        const dataUrl = await shrinkToJpeg(file);
        const result = await sendPhotoAction(conversationId, dataUrl);
        if (result.status === "error") setPhotoError(result.message ?? "Couldn't send the photo.");
        else setPhotoSent({ ok: true });
      } catch {
        setPhotoError("Couldn't read that photo. Try a different one.");
      }
    });
  }

  useEffect(() => {
    if (state.status === "success") ref.current?.reset();
  }, [state]);

  function fill(text: string) {
    const el = textRef.current;
    if (!el) return;
    el.value = text;
    el.focus();
  }

  function sendOffer() {
    const n = Math.round(Number(amount));
    if (!offer || !Number.isFinite(n) || n <= 0 || !textRef.current) return;
    textRef.current.value = `Offer: ${formatPrice(n, offer.currency)} (listed at ${formatPrice(offer.price, offer.currency)})`;
    setOfferOpen(false);
    setAmount("");
    ref.current?.requestSubmit();
  }

  return (
    <form ref={ref} action={action} className="border-t border-ink-100 bg-white">
      <input type="hidden" name="conversationId" value={conversationId} />
      <Toast message={state.status === "success" ? "Message sent." : null} trigger={state} />
      <Toast message={photoSent ? "Photo sent." : null} trigger={photoSent} />

      {unavailable && (
        <div role="status" className="flex items-start gap-2 border-b border-ink-100 bg-amber-50 px-4 py-2.5 text-sm text-amber-900 sm:px-6">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            This part is <b>{unavailable}</b> and isn&apos;t available any more. You can still read this conversation and reply.
          </p>
        </div>
      )}

      {!unavailable && suggestions.length > 0 && (
        <div className="flex gap-2 overflow-x-auto px-4 pt-3 sm:px-6" aria-label="Quick replies">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => fill(s)}
              className="shrink-0 rounded-full border border-clay-200 bg-clay-50 px-3 py-1.5 text-[13px] font-semibold text-clay-700 transition-colors hover:bg-clay-100"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="relative px-4 py-3 sm:px-6">
        {state.status === "error" && (
          <p role="alert" className="mb-2 text-sm font-medium text-red-600">{state.message}</p>
        )}
        {photoError && (
          <p role="alert" className="mb-2 text-sm font-medium text-red-600">{photoError}</p>
        )}

        {offerOpen && offer && (
          <div className="absolute bottom-full left-4 z-10 mb-1 w-72 rounded-2xl border border-ink-200 bg-white p-4 shadow-pop sm:left-6">
            <p className="text-sm font-bold text-ink-900">Make an offer</p>
            <p className="text-xs text-ink-500">Listed at {formatPrice(offer.price, offer.currency)}</p>
            <div className="mt-3 flex items-center gap-2">
              <label className="relative flex-1">
                <span className="sr-only">Your offer in rupees</span>
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-500">₹</span>
                <input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  autoFocus
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      sendOffer();
                    }
                    if (e.key === "Escape") {
                      e.preventDefault();
                      e.stopPropagation();
                      setOfferOpen(false);
                    }
                  }}
                  placeholder="Your price"
                  className="w-full rounded-xl border border-ink-200 py-2 pl-7 pr-3 text-sm focus:border-clay-400 focus:outline-none focus:ring-2 focus:ring-clay-400"
                />
              </label>
              <button
                type="button"
                onClick={sendOffer}
                className="rounded-xl bg-clay-600 px-3.5 py-2 text-sm font-bold text-white hover:bg-clay-700"
              >
                Send offer
              </button>
            </div>
          </div>
        )}

        <div className="flex items-end gap-3">
          {offer && !unavailable && (
            <button
              type="button"
              onClick={() => setOfferOpen((o) => !o)}
              aria-expanded={offerOpen}
              className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-3 text-sm font-bold text-ink-800 transition-colors hover:bg-ink-50"
            >
              <Tag className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Offer</span>
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(e) => {
              onPhoto(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={photoPending}
            aria-label="Send a photo"
            title="Send a photo"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-700 transition-colors hover:bg-ink-50 disabled:opacity-60"
          >
            <ImagePlus className="h-4 w-4" aria-hidden="true" />
          </button>
          <textarea
            ref={textRef}
            name="body"
            rows={1}
            aria-label="Reply"
            placeholder="Write a reply..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                if (e.currentTarget.value.trim()) ref.current?.requestSubmit();
              }
            }}
            className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl border border-ink-200 bg-white px-4 py-2.5 text-[15px] text-ink-900 placeholder:text-ink-400 focus:border-clay-400 focus:outline-none focus:ring-2 focus:ring-clay-400"
          />
          <Send />
        </div>
        {photoPending && <p className="mt-2 text-xs font-semibold text-ink-500">Sending photo...</p>}
      </div>
    </form>
  );
}
