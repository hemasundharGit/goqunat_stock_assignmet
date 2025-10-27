export type OrderSide = 'buy' | 'sell';
export type OrderType = 'market' | 'limit' | 'ioc' | 'fok';
export type Symbol = 'BTC-USDT';

export interface Order {
  id: string;
  symbol: Symbol;
  type: OrderType;
  side: OrderSide;
  quantity: number;
  price?: number;
  timestamp: number;
  filledQuantity: number;
}

export interface Trade {
  trade_id: string;
  symbol: Symbol;
  price: number;
  quantity: number;
  aggressor_side: OrderSide;
  maker_order_id: string;
  taker_order_id: string;
  timestamp: number;
}

export type OrderBookLevel = [string, string, string]; // [price, quantity, total]

export interface OrderBook {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

export interface BBO {
  bestBid: number | null;
  bestAsk: number | null;
  spread: number | null;
}
