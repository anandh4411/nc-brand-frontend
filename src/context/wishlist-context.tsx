import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface WishlistItem {
  productGroupId: number;
  name: string;
  basePrice: number;
  imageUrl?: string;
  categoryName: string;
  addedAt: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, "addedAt">) => void;
  removeItem: (productGroupId: number) => void;
  isInWishlist: (productGroupId: number) => boolean;
  toggleWishlist: (item: Omit<WishlistItem, "addedAt">) => void;
  clearWishlist: () => void;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "textilehub_wishlist";

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Failed to parse wishlist:", e);
      }
    }
  }, []);

  // Save wishlist to localStorage on change
  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: Omit<WishlistItem, "addedAt">) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.productGroupId === item.productGroupId);
      if (exists) return prev;

      toast.success("Added to wishlist");
      return [...prev, { ...item, addedAt: new Date().toISOString() }];
    });
  }, []);

  const removeItem = useCallback((productGroupId: number) => {
    setItems((prev) => prev.filter((item) => item.productGroupId !== productGroupId));
    toast.success("Removed from wishlist");
  }, []);

  const isInWishlist = useCallback((productGroupId: number): boolean => {
    return items.some((item) => item.productGroupId === productGroupId);
  }, [items]);

  const toggleWishlist = useCallback((item: Omit<WishlistItem, "addedAt">) => {
    if (isInWishlist(item.productGroupId)) {
      removeItem(item.productGroupId);
    } else {
      addItem(item);
    }
  }, [isInWishlist, removeItem, addItem]);

  const clearWishlist = useCallback(() => {
    setItems([]);
    toast.success("Wishlist cleared");
  }, []);

  const itemCount = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
        itemCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
