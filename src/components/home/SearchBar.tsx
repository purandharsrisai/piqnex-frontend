"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/browse?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex w-full max-w-md items-center gap-2 rounded-lg border border-ink-300 bg-white px-3 py-1.5"
    >
      <label htmlFor="home-search" className="sr-only">
        What product or part are you looking for?
      </label>
      <Search className="h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
      <input
        id="home-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. Sony WF-1000XM4 charging case"
        className="w-full border-none bg-transparent py-1.5 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-0"
      />
      <Button type="submit" size="sm" variant="ghost" className="shrink-0">
        Search
      </Button>
    </form>
  );
}
