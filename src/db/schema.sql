-- schema.sql
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS suppliers;

CREATE TABLE suppliers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  city TEXT NOT NULL
);

CREATE TABLE inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  price REAL NOT NULL CHECK (price > 0),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
);
