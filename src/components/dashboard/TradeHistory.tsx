"use client"

import type { Trade } from "@/lib/engine/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader as THeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TradeHistoryProps {
  trades: Trade[];
  isInitialized: boolean;
}

export function TradeHistory({ trades, isInitialized }: TradeHistoryProps) {
    if (!isInitialized) {
        return (
            <Card className="h-full">
                <CardHeader><CardTitle className="text-lg">Trade History</CardTitle></CardHeader>
                <CardContent>
                    {Array.from({length: 15}).map((_, i) => <Skeleton key={i} className="h-7 w-full mb-1" />)}
                </CardContent>
            </Card>
        )
    }

  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Trade History</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 min-h-0">
        <ScrollArea className="h-full">
          <Table>
            <THeader>
              <TableRow className="text-xs">
                <TableHead className="h-8">Time</TableHead>
                <TableHead className="text-right h-8">Price (USD)</TableHead>
                <TableHead className="text-right h-8 pr-2">Size (BTC)</TableHead>
              </TableRow>
            </THeader>
            <TableBody>
              {trades.map((trade) => (
                <TableRow key={trade.trade_id} className="font-code text-sm h-7 animate-in fade-in-0 duration-500">
                  <TableCell className="py-0">{format(trade.timestamp, 'HH:mm:ss')}</TableCell>
                  <TableCell className={cn("text-right py-0", trade.aggressor_side === 'buy' ? 'text-green-400' : 'text-red-400')}>
                    {trade.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right py-0 pr-2">{trade.quantity.toFixed(4)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
