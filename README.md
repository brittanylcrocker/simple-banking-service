# Mable Back End Code Challenge

A simple banking system that loads account balances from a CSV file and processes a day's transfers.

## Prerequisites

- Node.js
- npm

## Setup

```bash
npm install
```

## Run Tests

```bash
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

## Run the Bank App

The app loads account balances from a CSV file, then processes transfers from a second CSV file.

```bash
npm start -- <balances.csv> <transfers.csv>
```

**Example** (using the sample files in `src/db/`):

```bash
npm start -- src/db/mable_account_balances.csv src/db/mable_transactions.csv
```

Or with `ts-node` directly:

```bash
npx ts-node src/BankApp.ts src/db/mable_account_balances.csv src/db/mable_transactions.csv
```

**CSV formats:**

- **Balances:** `accountNumber,balance` (one per line, no header)
- **Transfers:** `from,to,amount` (one per line, no header)
