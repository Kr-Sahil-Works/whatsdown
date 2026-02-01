"use client";

import { useConversationStore } from "@/store/chat-store";
import { Search } from "lucide-react";
import styles from "./search-input.module.css";

export default function SearchInput({
  placeholder = "Search or start new chat",
}) {
  const { search, setSearch } = useConversationStore();

  return (
    <div
      className={`${styles.inputContainer} ${
        search ? styles.hasValue : ""
      }`}
    >
      {/* 🔍 Search icon */}
      <Search className={styles.searchIcon} size={16} />

      <input
        className={styles.input}
        value={search}
        placeholder={placeholder}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button
        className={styles.clearBtn}
        onClick={() => setSearch("")}
        aria-label="Clear search"
        type="button"
      >
        ×
      </button>
    </div>
  );
}
