"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { OrderSide, OrderType, Symbol } from "@/lib/engine/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  symbol: z.literal("BTC-USDT"),
  side: z.enum(["buy", "sell"]),
  type: z.enum(["market", "limit", "ioc", "fok"]),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  price: z.coerce.number().optional(),
}).refine(data => data.type !== "limit" || (data.price && data.price > 0), {
  message: "Price is required for limit orders and must be positive",
  path: ["price"],
});

type FormValues = z.infer<typeof formSchema>;

interface OrderFormProps {
    isInitialized: boolean;
    onSubmit: (data: Omit<FormValues, 'symbol'> & { symbol: Symbol }) => void;
}

export function OrderForm({ isInitialized, onSubmit }: OrderFormProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "BTC-USDT",
      side: "buy",
      type: "limit",
      quantity: 0.01,
      price: 60000,
    },
  });
  const orderType = form.watch("type");

  const handleFormSubmit = (values: FormValues) => {
    onSubmit(values);
    toast({
        title: "Order Submitted",
        description: `${values.side.toUpperCase()} ${values.type.toUpperCase()} order for ${values.quantity} ${values.symbol} placed.`,
    })
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Place Order</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="side"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Side</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="sell">Sell</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="limit">Limit</SelectItem>
                        <SelectItem value="market">Market</SelectItem>
                        <SelectItem value="ioc">IOC</SelectItem>
                        <SelectItem value="fok">FOK</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            {orderType === "limit" && (
                <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Price (USD)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="Enter price" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            )}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity (BTC)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter quantity" {...field} step="0.0001"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full font-bold" disabled={!isInitialized}>
              { !isInitialized ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null }
              {form.getValues('side') === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
