"use client";

import * as React from "react";

export type RfqLine = {
  itemId: string;
  slug: string;
  name: string;
  unit: string;
  quantity: number;
};

type RfqCartValue = {
  lines: RfqLine[];
  count: number;
  add: (itemId: string, name: string, unit?: string, quantity?: number) => void;
  addItem: (
    itemId: string,
    name: string,
    unit?: string,
    quantity?: number,
  ) => void;
  increment: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  remove: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  clear: () => void;
  clearAll: () => void;
};

const RfqCartContext = React.createContext<RfqCartValue | null>(null);

const STORAGE_KEY = "yurvana:rfq-cart";

export function RfqCartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = React.useState<RfqLine[]>([]);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<RfqLine>[];
        const normalized = parsed
          .map((line) => ({
            itemId: String(line.itemId ?? line.slug ?? ""),
            slug: String(line.slug ?? line.itemId ?? ""),
            name: String(line.name ?? ""),
            unit: String(line.unit ?? "kg"),
            quantity: Number(line.quantity ?? 1),
          }))
          .filter((line) => line.itemId && line.quantity > 0);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client hydration from localStorage
        setLines(normalized);
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignore unavailable storage
    }
  }, [lines]);

  const add = React.useCallback(
    (itemId: string, name: string, unit = "kg", quantity = 1) => {
      setLines((prev) => {
        const existing = prev.find((line) => line.itemId === itemId);
        if (existing) {
          return prev.map((line) =>
            line.itemId === itemId
              ? { ...line, quantity: line.quantity + quantity }
              : line,
          );
        }
        return [...prev, { itemId, slug: itemId, name, unit, quantity }];
      });
    },
    [],
  );

  const increment = React.useCallback((itemId: string) => {
    setLines((prev) =>
      prev.map((line) =>
        line.itemId === itemId
          ? { ...line, quantity: line.quantity + 1 }
          : line,
      ),
    );
  }, []);

  const setQuantity = React.useCallback((itemId: string, quantity: number) => {
    setLines((prev) =>
      prev
        .map((line) =>
          line.itemId === itemId
            ? { ...line, quantity: Math.max(0, quantity) }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }, []);

  const remove = React.useCallback((itemId: string) => {
    setLines((prev) => prev.filter((line) => line.itemId !== itemId));
  }, []);

  const clear = React.useCallback(() => setLines([]), []);

  const count = lines.reduce((sum, line) => sum + line.quantity, 0);

  const addItem = React.useCallback(
    (slug: string, name: string, unit = "kg", quantity = 1) => {
      add(slug, name, unit, quantity);
    },
    [add],
  );

  const updateQuantity = React.useCallback(
    (slug: string, quantity: number) => {
      setQuantity(slug, quantity);
    },
    [setQuantity],
  );

  const removeItem = React.useCallback(
    (slug: string) => {
      remove(slug);
    },
    [remove],
  );

  const clearAll = React.useCallback(() => {
    clear();
  }, [clear]);

  const value = React.useMemo(
    () => ({
      lines,
      count,
      add,
      addItem,
      increment,
      updateQuantity,
      setQuantity,
      remove,
      removeItem,
      clear,
      clearAll,
    }),
    [
      lines,
      count,
      add,
      addItem,
      increment,
      updateQuantity,
      setQuantity,
      remove,
      removeItem,
      clear,
      clearAll,
    ],
  );

  return (
    <RfqCartContext.Provider value={value}>{children}</RfqCartContext.Provider>
  );
}

export function useRfqCart(): RfqCartValue {
  const ctx = React.useContext(RfqCartContext);
  if (!ctx) {
    throw new Error("useRfqCart must be used within an RfqCartProvider");
  }
  return ctx;
}
