// seed.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const schemaPath = path.resolve(__dirname, 'schema.sql');

// Remove the old database if it exists to start fresh
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
        return;
    }
    
    // Read and execute schema synchronously relative to connection setup
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema, (err) => {
        if(err) {
            console.error("Could not run schema setup", err);
            return;
        }
        
        console.log("Database schema applied.");
        
        // Now seed the database
        db.serialize(() => {
            const insertSupplier = db.prepare("INSERT INTO suppliers (name, city) VALUES (?, ?)");
            insertSupplier.run("Tech Haven", "San Francisco");
            insertSupplier.run("FurniSpace", "Chicago");
            insertSupplier.run("Office Needs", "New York");
            insertSupplier.finalize();
        
            const insertInventory = db.prepare("INSERT INTO inventory (supplier_id, product_name, category, quantity, price) VALUES (?, ?, ?, ?, ?)");
            // Tech Haven (supplier 1)
            insertInventory.run(1, "Wireless Mouse", "Electronics", 150, 25.50);
            insertInventory.run(1, "Mechanical Keyboard", "Electronics", 45, 85.00);
            insertInventory.run(1, "USB-C Hub", "Electronics", 80, 45.00);
            insertInventory.run(1, "Monitor Stand", "Furniture", 30, 60.00);
        
            // FurniSpace (supplier 2)
            insertInventory.run(2, "Ergonomic Office Chair", "Furniture", 20, 250.00);
            insertInventory.run(2, "Standing Desk", "Furniture", 10, 400.00);
            insertInventory.run(2, "File Cabinet", "Furniture", 15, 120.00);
            insertInventory.run(2, "Desk Lamp", "Electronics", 40, 35.00);
        
            // Office Needs (supplier 3)
            insertInventory.run(3, "A4 Paper Pack", "Stationery", 200, 15.00);
            insertInventory.run(3, "Ballpoint Pens (Box)", "Stationery", 120, 8.50);
            insertInventory.run(3, "Gel Pens (Box)", "Stationery", 85, 12.00);
            insertInventory.run(3, "Stapler", "Stationery", 50, 10.00);
            insertInventory.run(3, "Whiteboard Markers", "Stationery", 75, 18.00);
            insertInventory.run(3, "Desk Organizer", "Furniture", 60, 22.00);
        
            insertInventory.finalize();
        
            console.log("Database seeded successfully.");
            db.close();
        });
    });
});
