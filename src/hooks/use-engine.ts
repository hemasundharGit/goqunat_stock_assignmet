"use client"

import { useState, useEffect } from 'react';
import { engineStore } from '@/lib/engine/engine-store';
import type { Order, Trade, OrderBook, BBO, Symbol, OrderType, OrderSide } from '@/lib/engine/types';

interface EngineHook {
  bbo: BBO;
  orderBook: OrderBook;
  trades: Trade[];
  isInitialized: boolean;
  submitOrder: (orderData: {
    symbol: Symbol;
    type: OrderType;
    side: OrderSide;
    quantity: number;
    price?: number;
  }) => void;
}

export function useEngine(): EngineHook {
  const [state, setState] = useState(engineStore.getState());

  useEffect(() => {
    engineStore.init();
    
    const handleStateChange = () => {
      setState({ ...engineStore.getState() });
    };

    const unsubscribe = engineStore.subscribe(handleStateChange);
    
    return () => {
      unsubscribe();
      engineStore.cleanup();
    };
  }, []);

  return {
    bbo: state.bbo,
    orderBook: state.orderBook,
    trades: state.trades,
    isInitialized: state.isInitialized,
    submitOrder: engineStore.actions.submitOrder,
  };
}
