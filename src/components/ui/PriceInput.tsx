"use client";

import { forwardRef } from "react";
import { Input, type InputProps } from "./Input";

/**
 * Whole-number input for prices. A real <input type="number"> changes its
 * value when the mouse wheel is scrolled over it, which silently alters the
 * amount. This is a text box that only accepts digits, so scrolling can never
 * change it, and it still shows the numeric keypad on phones.
 */
export const PriceInput = forwardRef<HTMLInputElement, Omit<InputProps, "type" | "inputMode" | "pattern">>(
  ({ onInput, ...props }, ref) => (
    <Input
      ref={ref}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete="off"
      title="Enter a whole number (digits only)"
      onInput={(e) => {
        e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
        onInput?.(e);
      }}
      {...props}
    />
  )
);
PriceInput.displayName = "PriceInput";
