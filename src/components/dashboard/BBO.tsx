"use client"

import type { BBO as BBOType } from "@/lib/engine/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface BBOProps {
  bbo: BBOType;
  isInitialized: boolean;
}

const useFlash = (value: any) => {
    const [flash, setFlash] = useState('');
    const prevValueRef = useRef(value);

    useEffect(() => {
        if (prevValueRef.current !== null && prevValueRef.current !== value) {
            const newFlash = value > prevValueRef.current ? 'bg-green-500/20' : 'bg-red-500/20';
            setFlash(newFlash);
            const timer = setTimeout(() => setFlash(''), 300);
            return () => clearTimeout(timer);
        }
        prevValueRef.current = value;
    }, [value]);

    return flash;
};

export function BBO({ bbo, isInitialized }: BBOProps) {
  const bidFlash = useFlash(bbo.bestBid);
  const askFlash = useFlash(bbo.bestAsk);

  if (!isInitialized) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-8 w-1/3" />
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="shrink-0">
      <CardContent className="p-3">
        <div className="flex justify-between items-center text-center">
            <div className="w-1/3">
                <div className="text-xs text-muted-foreground">Best Bid</div>
                <div className={cn("text-lg font-bold text-green-400 font-code transition-colors duration-100", bidFlash)}>
                    {bbo.bestBid?.toFixed(2) ?? '-'}
                </div>
            </div>
            <div className="w-1/3 border-x">
                <div className="text-xs text-muted-foreground">Spread</div>
                <div className="text-lg font-bold font-code">
                    {bbo.spread?.toFixed(2) ?? '-'}
                </div>
            </div>
            <div className="w-1/3">
                <div className="text-xs text-muted-foreground">Best Ask</div>
                <div className={cn("text-lg font-bold text-red-400 font-code transition-colors duration-100", askFlash)}>
                    {bbo.bestAsk?.toFixed(2) ?? '-'}
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
