# Bonus Features & Advanced Implementations

This document details the advanced features implemented in the OrderStream application that go beyond a basic matching engine simulation.

---

### 1. Advanced Order Types (IOC & FOK)

Beyond standard `limit` and `market` orders, OrderStream includes support for two advanced order types that provide traders with more control over execution.

-   **Immediate-Or-Cancel (IOC):**
    -   **What it is:** An IOC order attempts to execute all or part of the order immediately at the limit price or better. Any portion of the order that cannot be filled instantly is canceled.
    -   **Implementation:** In `engine-store.ts`, when an `ioc` order is submitted, it is passed to the `matchOrder` function. Unlike a `limit` order, any `remainingQty` after the matching process is complete is simply discarded instead of being added to the order book. This ensures no part of the order remains open.

-   **Fill-Or-Kill (FOK):**
    -   **What it is:** A FOK order requires that the *entire* order quantity is filled immediately at the limit price or better. If this is not possible, the entire order is canceled (killed) before any trade occurs.
    -   **Implementation:** Before attempting to match a `fok` order, the `submitOrder` function calls a special helper function, `canFOKFill`. This function pre-scans the order book to check if sufficient volume is available to fill the entire order. If not, the function returns `false`, and the order is rejected immediately. If it can be filled, it is then passed to the `matchOrder` function for execution.

---

### 2. Dynamic Market Simulation

To create a realistic and interactive trading environment, OrderStream includes a built-in market simulator.

-   **What it is:** A mechanism that automatically generates random market activity, ensuring the order book is constantly changing and providing opportunities for user-placed orders to be matched.
-   **Why it was added:** A static order book would fail to demonstrate the real-time nature of a matching engine. The simulator makes the application feel "live" and allows users to see how the market reacts to their orders without needing to connect to an external data feed.
-   **How it works:**
    -   Inside `engine-store.ts`, the `startSimulation` function uses a `setInterval` loop that runs every two seconds.
    -   In each interval, it generates a new `limit` order with a random side (buy/sell), a quantity, and a price that is slightly offset from the current market price (mid-price).
    -   This new order is submitted to the matching engine just like a user-placed order, creating trades and modifying the order book. This process ensures the application is always dynamic.

---

### 3. Real-time Order Book Depth Visualization

To provide a richer user experience, the order book UI includes a visual representation of market depth.

-   **What it is:** In the Order Book table, each row has a colored background bar that represents the cumulative size of all orders up to that price level. A longer bar indicates greater market depth.
-   **Why it was added:** This feature allows traders to quickly and visually gauge market sentiment and identify significant price levels with high liquidity, which is much faster than manually reading and summing numbers.
-   **How it works:**
    -   The `updateOrderBook` function aggregates all raw orders into price levels. As it does this, it calculates a running `total` for both the bid and ask sides.
    -   In the `OrderBook.tsx` component, the `maxTotal` (the largest cumulative total on each side) is identified.
    -   For each row being rendered, a `depth` percentage is calculated: `(currentRowTotal / maxTotal) * 100`.
    -   This percentage is then used to set the `width` of an absolutely positioned `<div>` within the "Total" cell, creating the visual bar effect.
