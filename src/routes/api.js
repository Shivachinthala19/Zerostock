// api.js
const express = require('express');
const router = express.Router();
const db = require('../db/connection.js');

router.post('/suppliers', (req, res) => {
    const { name, city } = req.body;
    if (!name || !city || name.trim() === '' || city.trim() === '') {
        return res.status(400).json({ message: "Supplier name and city are required." });
    }

    const stmt = db.prepare('INSERT INTO suppliers (name, city) VALUES (?, ?)');
    stmt.run([name.trim(), city.trim()], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, name, city });
    });
    stmt.finalize();
});

router.get('/reports/supplier-value', (req, res) => {
    const query = `
        SELECT 
            s.id, 
            s.name, 
            COALESCE(SUM(i.quantity * i.price), 0) AS total_inventory_value
        FROM suppliers s
        LEFT JOIN inventory i ON s.id = i.supplier_id
        GROUP BY s.id, s.name
        ORDER BY total_inventory_value DESC
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// GET /suppliers
router.get('/suppliers', (req, res) => {
    db.all('SELECT * FROM suppliers ORDER BY name ASC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST /inventory
router.post('/inventory', (req, res) => {
    let { supplier_id, product_name, category, quantity, price } = req.body;

    // Validation
    if (!supplier_id || !product_name || !category || quantity === undefined || price === undefined) {
        return res.status(400).json({ message: "All fields are required: supplier_id, product_name, category, quantity, price." });
    }

    quantity = parseInt(quantity, 10);
    price = parseFloat(price);

    if (quantity < 0) {
        return res.status(400).json({ message: 'Quantity must be 0 or more' });
    }

    if (price <= 0) {
        return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    // Check if supplier_id is valid
    db.get('SELECT id FROM suppliers WHERE id = ?', [supplier_id], (err, supplier) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!supplier) {
            return res.status(400).json({ message: 'Invalid supplier_id. Supplier does not exist.' });
        }

        const stmt = db.prepare('INSERT INTO inventory (supplier_id, product_name, category, quantity, price) VALUES (?, ?, ?, ?, ?)');
        stmt.run([supplier_id, product_name.trim(), category.trim(), quantity, price], function (insertErr) {
            if (insertErr) return res.status(500).json({ error: insertErr.message });
            res.status(201).json({ id: this.lastID, supplier_id, product_name, category, quantity, price });
        });
        stmt.finalize();
    });
});

// GET /inventory
router.get('/inventory', (req, res) => {
    const query = `
        SELECT i.*, s.name as supplier_name 
        FROM inventory i 
        JOIN suppliers s ON i.supplier_id = s.id
        ORDER BY i.product_name ASC
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.get('/search', (req, res) => {
    let { q, category, minPrice, maxPrice } = req.query;

    let baseQuery = `
        SELECT i.*, s.name as supplier_name 
        FROM inventory i 
        JOIN suppliers s ON i.supplier_id = s.id
        WHERE 1=1
    `;
    const params = [];

    // Filter by product_name (case-insensitive partial match)
    if (q && q.trim() !== '') {
        baseQuery += ` AND LOWER(i.product_name) LIKE ?`;
        params.push(`%${q.trim().toLowerCase()}%`);
    }

    // Filter by category
    if (category && category.trim() !== '') {
        baseQuery += ` AND i.category = ?`;
        params.push(category.trim());
    }

    // Filter by minPrice
    if (minPrice) {
        const min = Number(minPrice);
        if (!isNaN(min)) {
            baseQuery += ` AND i.price >= ?`;
            params.push(min);
        }
    }

    // Filter by maxPrice
    if (maxPrice) {
        const max = Number(maxPrice);
        if (!isNaN(max)) {
            // Price range validation check
            if (minPrice && !isNaN(Number(minPrice)) && Number(minPrice) > max) {
                return res.status(400).json({ message: '400 Bad Request: Invalid price range' });
            }
            baseQuery += ` AND i.price <= ?`;
            params.push(max);
        }
    }

    db.all(baseQuery, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        // The assignment specifies returning an empty array on no matches
        res.json(rows);
    });
});


module.exports = router;
