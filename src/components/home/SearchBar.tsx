"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

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
      className="flex w-full items-center gap-2 rounded-full border border-ink-200 bg-white p-2 pl-5 shadow-pop transition-all focus-within:border-clay-500 focus-within:ring-4 focus-within:ring-clay-100"
    >
      <label htmlFor="home-search" className="sr-only">
        What product or part are you looking for?
      </label>
      <Search className="h-5 w-5 shrink-0 text-ink-400" aria-hidden="true" />
      <input
        id="home-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search a product or part, e.g. Sony WF-1000XM4"
        className="w-full min-w-0 border-none bg-transparent py-2 text-base text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-0"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-clay-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-clay-700"
      >
        Search
      </button>
    </form>
  );
}
