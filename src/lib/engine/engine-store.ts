"use client"

import type { Order, Trade, OrderBook, BBO, OrderSide, OrderType, Symbol, OrderBookLevel } from './types';
import { v4 as uuidv4 } from 'uuid';

interface EngineState {
  bids: Order[];
  asks: Order[];
  trades: Trade[];
  orderBook: OrderBook;
  bbo: BBO;
  isInitialized: boolean;
  symbol: Symbol;
}

let state: EngineState = {
  bids: [],
  asks: [],
  trades: [],
  orderBook: { bids: [], asks: [] },
  bbo: { bestBid: null, bestAsk: null, spread: null },
  isInitialized: false,
  symbol: 'BTC-USDT',
};

const listeners = new Set<() => void>();
let simulationInterval: NodeJS.Timeout | null = null;

const notify = () => {
  listeners.forEach(l => l());
};

const updateOrderBook = () => {
  const aggregate = (orders: Order[]): Map<number, number> => {
    const map = new Map<number, number>();
    for (const order of orders) {
      if (order.price) {
        map.set(order.price, (map.get(order.price) || 0) + (order.quantity - order.filledQuantity));
      }
    }
    return map;
  };

  const bidsMap = aggregate(state.bids);
  const asksMap = aggregate(state.asks);

  const formatLevels = (map: Map<number, number>, descending: boolean): OrderBookLevel[] => {
    const sorted = Array.from(map.entries()).sort((a, b) => descending ? b[0] - a[0] : a[0] - b[0]);
    let total = 0;
    return sorted.slice(0, 15).map(([price, quantity]) => {
      total += quantity;
      return [price.toFixed(2), quantity.toFixed(4), total.toFixed(4)];
    });
  };

  state.orderBook = {
    bids: formatLevels(bidsMap, true),
    asks: formatLevels(asksMap, false),
  };

  const bestBid = state.bids.length > 0 ? state.bids[0].price ?? null : null;
  const bestAsk = state.asks.length > 0 ? state.asks[0].price ?? null : null;
  const spread = bestBid !== null && bestAsk !== null ? bestAsk - bestBid : null;
  state.bbo = { bestBid, bestAsk, spread };
};

const addTrade = (takerOrder: Order, makerOrder: Order, quantity: number, price: number) => {
  const trade: Trade = {
    trade_id: uuidv4(),
    symbol: state.symbol,
    price,
    quantity,
    aggressor_side: takerOrder.side,
    maker_order_id: makerOrder.id,
    taker_order_id: takerOrder.id,
    timestamp: Date.now(),
  };
  state.trades.unshift(trade);
  if (state.trades.length > 50) {
    state.trades.pop();
  }
};

const matchOrder = (order: Order) => {
  const book = order.side === 'buy' ? state.asks : state.bids;
  let remainingQty = order.quantity;

  while (remainingQty > 0 && book.length > 0) {
    const bestPriceMaker = book[0];
    const canMatch = order.side === 'buy'
      ? (order.price ? order.price >= bestPriceMaker.price! : true)
      : (order.price ? order.price <= bestPriceMaker.price! : true);

    if (!canMatch) break;

    const tradeQty = Math.min(remainingQty, bestPriceMaker.quantity - bestPriceMaker.filledQuantity);
    const tradePrice = bestPriceMaker.price!;

    addTrade(order, bestPriceMaker, tradeQty, tradePrice);

    remainingQty -= tradeQty;
    order.filledQuantity += tradeQty;
    bestPriceMaker.filledQuantity += tradeQty;

    if (bestPriceMaker.filledQuantity >= bestPriceMaker.quantity) {
      book.shift();
    }
  }

  return remainingQty;
};

const canFOKFill = (order: Order): boolean => {
  const book = order.side === 'buy' ? state.asks : state.bids;
  let qtyToFill = order.quantity;
  for (const maker of book) {
    const canMatch = order.side === 'buy'
      ? (order.price! >= maker.price!)
      : (order.price! <= maker.price!);
    if (!canMatch) break;
    qtyToFill -= (maker.quantity - maker.filledQuantity);
    if (qtyToFill <= 0) return true;
  }
  return false;
};

const seedOrderBook = () => {
    const basePrice = 60000;
    for (let i = 1; i <= 15; i++) {
        const bidPrice = basePrice - i * 0.5;
        const askPrice = basePrice + i * 0.5;
        const qty = Math.random() * 5 + 0.1;
        
        state.bids.push({ id: uuidv4(), symbol: state.symbol, type: 'limit', side: 'buy', quantity: qty, price: bidPrice, timestamp: Date.now() - i*100, filledQuantity: 0 });
        state.asks.push({ id: uuidv4(), symbol: state.symbol, type: 'limit', side: 'sell', quantity: qty, price: askPrice, timestamp: Date.now() - i*100, filledQuantity: 0 });
    }
    state.bids.sort((a, b) => (b.price ?? 0) - (a.price ?? 0) || a.timestamp - b.timestamp);
    state.asks.sort((a, b) => (a.price ?? 0) - (b.price ?? 0) || a.timestamp - b.timestamp);
    updateOrderBook();
};

const startSimulation = () => {
    if (simulationInterval) clearInterval(simulationInterval);
    simulationInterval = setInterval(() => {
        const side: OrderSide = Math.random() > 0.5 ? 'buy' : 'sell';
        const basePrice = (state.bbo.bestBid ?? 60000) + (state.bbo.spread ?? 1) / 2;
        const price = basePrice + (Math.random() - 0.5) * 5;
        const quantity = Math.random() * 0.5 + 0.01;
        
        const newOrder: Order = {
            id: uuidv4(),
            symbol: state.symbol,
            type: 'limit',
            side,
            quantity,
            price,
            timestamp: Date.now(),
            filledQuantity: 0,
        };

        const remainingQty = matchOrder(newOrder);

        if (remainingQty > 0) {
            const book = newOrder.side === 'buy' ? state.bids : state.asks;
            book.push({ ...newOrder, quantity: remainingQty, filledQuantity: 0 });
            book.sort((a, b) => {
                if (a.side === 'buy') return (b.price ?? 0) - (a.price ?? 0) || a.timestamp - b.timestamp;
                return (a.price ?? 0) - (b.price ?? 0) || a.timestamp - b.timestamp;
            });
        }
        updateOrderBook();
        notify();
    }, 2000);
};

export const engineStore = {
  getState: () => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  actions: {
    submitOrder: (orderData: { symbol: Symbol; type: OrderType; side: OrderSide; quantity: number; price?: number }) => {
      const newOrder: Order = {
        ...orderData,
        id: uuidv4(),
        timestamp: Date.now(),
        filledQuantity: 0,
      };

      if (newOrder.type === 'fok') {
        if (!canFOKFill(newOrder)) return; // Reject FOK
      }

      const remainingQty = matchOrder(newOrder);

      if (remainingQty > 0 && newOrder.type === 'limit') {
        newOrder.quantity = remainingQty;
        const book = newOrder.side === 'buy' ? state.bids : state.asks;
        book.push(newOrder);
        book.sort((a, b) => {
            if (a.side === 'buy') return (b.price ?? 0) - (a.price ?? 0) || a.timestamp - b.timestamp;
            return (a.price ?? 0) - (b.price ?? 0) || a.timestamp - b.timestamp;
        });
      }

      updateOrderBook();
      notify();
    }
  },
  init: () => {
    if (state.isInitialized) return;
    state.isInitialized = true;
    seedOrderBook();
    startSimulation();
    notify();
  },
  cleanup: () => {
    if (simulationInterval) clearInterval(simulationInterval);
    simulationInterval = null;
  }
};
