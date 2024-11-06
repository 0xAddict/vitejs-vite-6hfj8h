import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { OrderState, ProductCategory, ProductType, JerseyModel, PantsModel, ExportRecord, TrelloConfig, Detail, SizeGroup } from '../types';

interface OrderStore {
  orders: Record<string, OrderState>;
  currentOrderId: string | null;
  
  // Order Status Management
  updateOrderStatus: (id: string, status: OrderState['status'], customerInfo?: { fullName: string; email: string }) => void;
  
  // Order Management
  createOrder: (title: string) => void;
  loadOrder: (id: string) => void;
  deleteOrder: (id: string) => void;
  updateOrderTitle: (id: string, title: string) => void;
  saveCurrentOrder: () => void;
  getCurrentOrder: () => OrderState | null;
  
  // Step Management
  getStep: () => number;
  setStep: (step: number) => void;
  
  // Order Data
  setCategory: (category: ProductCategory) => void;
  setProductType: (type: ProductType) => void;
  setModel: (model: JerseyModel | PantsModel) => void;
  setImage: (view: 'front' | 'back', url: string) => void;
  addDetail: (detail: Omit<Detail, 'id'>) => void;
  removeDetail: (id: string) => void;
  updateDetailPosition: (id: string, position: { x: number; y: number }) => void;
  updateDetailContentPosition: (id: string, position: { x: number; y: number }) => void;
  updateDetailsOrder: (orderedIds: string[]) => void;
  updateSizes: (sizeGroups: SizeGroup[]) => void;
  
  // Export Records
  addExportRecord: (record: ExportRecord) => void;
  removeExportRecord: (id: string) => void;
  
  // Utilities
  canProceed: (nextStep: number) => boolean;
}

const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: {},
      currentOrderId: null,

      createOrder: (title: string) => {
        const id = uuidv4();
        const newOrder: OrderState = {
          id,
          title,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          step: 1,
          details: [],
          exports: [],
          sizeGroups: []
        };

        set(state => ({
          orders: { ...state.orders, [id]: newOrder },
          currentOrderId: id
        }));
      },

      loadOrder: (id: string) => {
        set({ currentOrderId: id });
      },

      deleteOrder: (id: string) => {
        set(state => {
          const { [id]: _, ...remainingOrders } = state.orders;
          return {
            orders: remainingOrders,
            currentOrderId: state.currentOrderId === id ? null : state.currentOrderId
          };
        });
      },

      updateOrderTitle: (id: string, title: string) => {
        set(state => ({
          orders: {
            ...state.orders,
            [id]: {
              ...state.orders[id],
              title,
              updatedAt: new Date().toISOString()
            }
          }
        }));
      },

      saveCurrentOrder: () => {
        const { currentOrderId, orders } = get();
        if (!currentOrderId) return;

        const currentOrder = orders[currentOrderId];
        if (!currentOrder) return;

        set(state => ({
          orders: {
            ...state.orders,
            [currentOrderId]: {
              ...currentOrder,
              updatedAt: new Date().toISOString()
            }
          }
        }));
      },

      getCurrentOrder: () => {
        const { currentOrderId, orders } = get();
        return currentOrderId ? orders[currentOrderId] : null;
      },

      getStep: () => {
        const currentOrder = get().getCurrentOrder();
        return currentOrder?.step || 1;
      },

      setStep: (step: number) => {
        const { currentOrderId, orders, saveCurrentOrder } = get();
        if (!currentOrderId) return;

        set(state => ({
          orders: {
            ...state.orders,
            [currentOrderId]: {
              ...state.orders[currentOrderId],
              step
            }
          }
        }));
        saveCurrentOrder();
      },

      setCategory: (category: ProductCategory) => {
        const { currentOrderId, orders, saveCurrentOrder } = get();
        if (!currentOrderId) return;

        set(state => ({
          orders: {
            ...state.orders,
            [currentOrderId]: {
              ...state.orders[currentOrderId],
              category,
              productType: undefined,
              model: undefined
            }
          }
        }));
        saveCurrentOrder();
      },

      setProductType: (productType: ProductType) => {
        const { currentOrderId, orders, saveCurrentOrder } = get();
        if (!currentOrderId) return;

        set(state => ({
          orders: {
            ...state.orders,
            [currentOrderId]: {
              ...state.orders[currentOrderId],
              productType,
              model: undefined
            }
          }
        }));
        saveCurrentOrder();
      },

      setModel: (model: JerseyModel | PantsModel) => {
        const { currentOrderId, orders, saveCurrentOrder } = get();
        if (!currentOrderId) return;

        set(state => ({
          orders: {
            ...state.orders,
            [currentOrderId]: {
              ...state.orders[currentOrderId],
              model
            }
          }
        }));
        saveCurrentOrder();
      },

      setImage: (view: 'front' | 'back', url: string) => {
        const { currentOrderId, orders, saveCurrentOrder } = get();
        if (!currentOrderId) return;

        set(state => ({
          orders: {
            ...state.orders,
            [currentOrderId]: {
              ...state.orders[currentOrderId],
              [view === 'front' ? 'frontImage' : 'backImage']: url
            }
          }
        }));
        saveCurrentOrder();
      },

      addDetail: (detail: Omit<Detail, 'id'>) => {
        const { currentOrderId, orders, saveCurrentOrder } = get();
        if (!currentOrderId) return;

        const newDetail = { ...detail, id: uuidv4() };
        set(state => ({
          orders: {
            ...state.orders,
            [currentOrderId]: {
              ...state.orders[currentOrderId],
              details: [...state.orders[currentOrderId].details, newDetail]
            }
          }
        }));
        saveCurrentOrder();
      },

      removeDetail: (id: string) => {
        const { currentOrderId, orders, saveCurrentOrder } = get();
        if (!currentOrderId) return;

        set(state => ({
          orders: {
            ...state.orders,
            [currentOrderId]: {
              ...state.orders[currentOrderId],
              details: state.orders[currentOrderId].details.filter(d => d.id !== id)
            }
          }
        }));
        saveCurrentOrder();
      },

      updateDetailPosition: (id: string, position: { x: number; y: number }) => {
        const { currentOrderId, orders, saveCurrentOrder } = get();
        if (!currentOrderId) return;

        set(state => ({
          orders: {
            ...state.orders,
            [currentOrderId]: {
              ...state.orders[currentOrderId],
              details: state.orders[currentOrderId].details.map(d =>
                d.id === id ? { ...d, position } : d
              )
            }
          }
        }));
        saveCurrentOrder();
      },

      updateDetailContentPosition: (id: string, position: { x: number; y: number }) => {
        const { currentOrderId, orders, saveCurrentOrder } = get();
        if (!currentOrderId) return;

        set(state => ({
          orders: {
            ...state.orders,
            [currentOrderId]: {
              ...state.orders[currentOrderId],
              details: state.orders[currentOrderId].details.map(d =>
                d.id === id ? { ...d, contentPosition: position } : d
              )
            }
          }
        }));
        saveCurrentOrder();
      },

      updateDetailsOrder: (orderedIds: string[]) => {
        const { currentOrderId, orders, saveCurrentOrder } = get();
        if (!currentOrderId) return;

        const currentOrder = orders[currentOrderId];
        const orderedDetails = orderedIds
          .map(id => currentOrder.details.find(d => d.id === id))
          .filter(Boolean);

        set(state => ({
          orders: {
            ...state.orders,
            [currentOrderId]: {
              ...state.orders[currentOrderId],
              details: orderedDetails
            }
          }
        }));
        saveCurrentOrder();
      },

      updateSizes: (sizeGroups: SizeGroup[]) => {
        const { currentOrderId, orders, saveCurrentOrder } = get();
        if (!currentOrderId) return;

        set(state => ({
          orders: {
            ...state.orders,
            [currentOrderId]: {
              ...state.orders[currentOrderId],
              sizeGroups
            }
          }
        }));
        saveCurrentOrder();
      },

      setTrelloConfig: (config: TrelloConfig) => {
        set({ trelloConfig: config });
      },

      addExportRecord: (record: ExportRecord) => {
        const { currentOrderId, orders, saveCurrentOrder } = get();
        if (!currentOrderId) return;

        set(state => ({
          orders: {
            ...state.orders,
            [currentOrderId]: {
              ...state.orders[currentOrderId],
              exports: [...state.orders[currentOrderId].exports, record]
            }
          }
        }));
        saveCurrentOrder();
      },

      removeExportRecord: (id: string) => {
        const { currentOrderId, orders, saveCurrentOrder } = get();
        if (!currentOrderId) return;

        set(state => ({
          orders: {
            ...state.orders,
            [currentOrderId]: {
              ...state.orders[currentOrderId],
              exports: state.orders[currentOrderId].exports.filter(e => e.id !== id)
            }
          }
        }));
        saveCurrentOrder();
      },

      updateOrderStatus: (id: string, status: OrderState['status'], customerInfo?: { fullName: string; email: string }) => {
        set(state => ({
          orders: {
            ...state.orders,
            [id]: {
              ...state.orders[id],
              status,
              customer: customerInfo,
              updatedAt: new Date().toISOString()
            }
          }
        }));
      },

      canProceed: (nextStep: number) => {
        const currentOrder = get().getCurrentOrder();
        if (!currentOrder) return false;

        switch (nextStep) {
          case 2:
            return Boolean(currentOrder.category && currentOrder.productType && 
              (currentOrder.productType === 'Jersey + Pants' || currentOrder.model));
          case 3:
            return Boolean(currentOrder.frontImage && currentOrder.backImage);
          case 4:
            return currentOrder.details.length > 0;
          case 5:
            return Boolean(currentOrder.sizeGroups?.length);
          default:
            return false;
        }
      }
    }),
    {
      name: 'purchase-order-storage'
    }
  )
);

export { useOrderStore };