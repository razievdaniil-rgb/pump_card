import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DutyPoint, PumpProduct, SpecificationItem } from '../domain/types';

interface SpecificationState {
  items: SpecificationItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (product: PumpProduct, context: DutyPoint, quantity: number, comment: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useSpecificationStore = create<SpecificationState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      add: (product, context, quantity, comment) =>
        set((state) => {
          const existing = state.items.find((item) =>
            item.product.sku === product.sku && item.context.q === context.q && item.context.h === context.h,
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === existing.id
                  ? { ...item, quantity: item.quantity + quantity, comment: comment || item.comment }
                  : item,
              ),
              isOpen: true,
            };
          }
          return {
            items: [
              ...state.items,
              {
                id: crypto.randomUUID(),
                product,
                context: { ...context },
                quantity,
                comment,
                addedAt: new Date().toISOString(),
              },
            ],
            isOpen: true,
          };
        }),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((item) => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item),
      })),
      remove: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'apgs-specification-v1',
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
