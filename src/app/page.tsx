"use client"

import { BBO } from "@/components/dashboard/BBO";
import { Header } from "@/components/dashboard/Header";
import { OrderBook } from "@/components/dashboard/OrderBook";
import { OrderForm } from "@/components/dashboard/OrderForm";
import { TradeHistory } from "@/components/dashboard/TradeHistory";
import { useEngine } from "@/hooks/use-engine";

export default function Home() {
  const { bbo, orderBook, trades, submitOrder, isInitialized } = useEngine();

  return (
    <div className="flex flex-col h-screen bg-background font-body">
      <Header />
      <main className="flex-1 overflow-hidden p-4">
        <div className="grid grid-cols-12 gap-4 h-full">
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
            <OrderForm 
              isInitialized={isInitialized} 
              onSubmit={submitOrder} 
            />
          </div>
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
             <BBO bbo={bbo} isInitialized={isInitialized} />
             <OrderBook orderBook={orderBook} isInitialized={isInitialized} />
          </div>
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
            <TradeHistory trades={trades} isInitialized={isInitialized}/>
          </div>
        </div>
      </main>
    </div>
  );
}
