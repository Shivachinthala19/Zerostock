# ZeroStock - Premium Inventory Management

ZeroStock is a unified, high-performance inventory search and supplier management system. It seamlessly integrates a fast robust backend REST API with a modern, glassmorphic UI.

## Features

- **Advanced Search API**: Filter by case-insensitive partial names, exact category, and cross-reference numeric boundaries (`minPrice`/`maxPrice`).
- **Database Driven**: Powered by SQLite for reliable data storage.
- **Reporting**: Advanced SQL grouped query functionality to sort inventory by total monetary value per supplier.
- **Dynamic Frontend**: Modern responsive SPA design using Flexbox/Grid and Glassmorphism without heavyweight frameworks. Built using pure CSS + Vanilla JS.

## Project Structure

```text
zerostock/
├── src/
│   ├── db/
│   │   ├── schema.sql       (DB definitions)
│   │   ├── connection.js    (SQLite connection)
│   │   └── seed.js          (Mock Data population script)
│   └── routes/
│       └── api.js           (Express router logic)
├── public/                  (Frontend Artifacts)
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js                (Main Entry Point)
└── package.json
```

## Setup & Running

This project uses Node.js (18+) and SQLite.

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Initialize Database**
   This script builds the schemas and seeds the tables with default data.
   ```bash
   node src/db/seed.js
   ```

3. **Start the Server**
   ```bash
   node server.js
   ```
   Navigate to `http://localhost:3000`

## Optimization & Future Improvements

- **Database Indexes**: To scale up to millions of records, `CREATE INDEX idx_products_search ON inventory(product_name, category, price);` would vastly speed up `WHERE` clauses.
- **Pagination**: The `/search` API should introduce `limit` and `offset` variables.
- **Debounced Input**: On the frontend, replacing the `Search` button with an auto-fetch mechanism using `setTimeout` (debouncing) can return instant results as a user types.
