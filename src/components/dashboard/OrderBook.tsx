"use client"

import type { OrderBook as OrderBookType, OrderBookLevel } from "@/lib/engine/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader as THeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

interface OrderBookProps {
  orderBook: OrderBookType;
  isInitialized: boolean;
}

const OrderBookTable = ({ rows, side }: { rows: OrderBookLevel[], side: 'buy' | 'sell' }) => {
  const maxTotal = rows.length > 0 ? parseFloat(rows[rows.length - 1][2]) : 0;
  
  return (
    <Table className="relative">
      <THeader>
        <TableRow className="text-xs">
          <TableHead className={cn("text-left h-8", side === 'buy' ? 'pl-8' : 'pr-8 text-right')}>Price (USD)</TableHead>
          <TableHead className="text-right h-8">Size (BTC)</TableHead>
          <TableHead className="text-right h-8 pr-2">Total</TableHead>
        </TableRow>
      </THeader>
      <TableBody>
        {rows.map(([price, size, total]) => {
          const depth = maxTotal > 0 ? (parseFloat(total) / maxTotal) * 100 : 0;
          return (
            <TableRow key={`${price}-${size}`} className="relative font-code text-sm h-7">
              <TableCell className={cn("py-0 z-10", side === 'buy' ? 'text-green-400 pl-8' : 'pr-8 text-right')}>{price}</TableCell>
              <TableCell className="py-0 text-right z-10">{size}</TableCell>
              <TableCell className="py-0 text-right pr-2 z-10 relative">
                {total}
                <div
                  className={cn(
                    "absolute top-0 h-full -z-10 transition-all duration-300",
                    side === 'buy' ? "right-0 bg-green-900/40" : "left-0 bg-red-900/40"
                  )}
                  style={{ width: `${depth}%` }}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};


export function OrderBook({ orderBook, isInitialized }: OrderBookProps) {
  if (!isInitialized) {
    return (
        <Card className="h-full">
            <CardHeader><CardTitle className="text-lg">Order Book</CardTitle></CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        {Array.from({length: 10}).map((_, i) => <Skeleton key={i} className="h-7 w-full mb-1" />)}
                    </div>
                    <div>
                        {Array.from({length: 10}).map((_, i) => <Skeleton key={i} className="h-7 w-full mb-1" />)}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Order Book</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0 p-0">
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <OrderBookTable rows={orderBook.bids} side="buy" />
            <OrderBookTable rows={orderBook.asks} side="sell" />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
