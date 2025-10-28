# OrderStream - Cryptocurrency Matching Engine Simulator

OrderStream is a high-fidelity, client-side simulation of a real-time cryptocurrency trading platform. It demonstrates a complete matching engine for the BTC/USDT pair, running entirely in the browser.

This project was built with Next.js and React, and showcases a reactive UI that allows users to place orders and observe market activity in real-time.

- **[System Architecture & Design Documentation](BONUS_FEATURES.md)**
- **[Bonus Features & Advanced Implementations](BONUS_FEATURES.md)**

## Features

- **Real-time Order Book:** View buy (bids) and sell (asks) orders, aggregated by price level and updated live.
- **Live Trade History:** See a feed of recently executed trades.
- **Best Bid and Offer (BBO):** A clear display of the highest bid and lowest ask prices, along with the current spread.
- **Interactive Order Form:** Place different types of orders:
  - **Limit:** Set a specific price for your order.
  - **Market:** Execute immediately at the best available price.
  - **Immediate-Or-Cancel (IOC):** Fill what you can immediately and cancel the rest.
  - **Fill-Or-Kill (FOK):** Execute the entire order immediately or cancel it completely.
- **Simulated Market Activity:** The engine automatically generates random market orders to create a dynamic and interactive trading environment.
- **Order Book Depth Visualization:** The UI includes a visual indicator to show the cumulative depth at different price levels, making it easier to gauge market sentiment.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 15 (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** Custom client-side store using React hooks.

## How to Run the Application

To get the application running locally, follow these steps.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (version 18 or later)
- [npm](https://www.npmjs.com/) (or another package manager like yarn or pnpm)

### 1. Install Dependencies

Navigate to the project directory in your terminal and install the required packages.

```bash
npm install
```

### 2. Run the Development Server

Once the dependencies are installed, run the following command to start the Next.js development server.

```bash
npm run dev
```

### 3. Open the Application

The application will be running at [http://localhost:9002](http://localhost:9002). Open this URL in your web browser to start using OrderStream.
