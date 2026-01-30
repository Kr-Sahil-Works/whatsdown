"use client";

import { useConversationStore } from "@/store/chat-store";
import styles from "./search-input.module.css";

type Props = {
  placeholder?: string;
};

export default function SearchInput({
  placeholder = "Search or start new chat",
}: Props) {
  const { search, setSearch } = useConversationStore();

  return (
    <div className={styles.inputContainer}>
      <input
        className={styles.input}
        type="text"
        value={search}
        placeholder={placeholder}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
