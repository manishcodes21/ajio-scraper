// server.js
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 3000;
require("dotenv").config();
app.use(bodyParser.json());

app.use(
  cors({
    origin: "chrome-extension://gjekjmdledcmnkhakiicihmjkklenimd", 
  })
);

const db = mysql.createConnection({
  host: process.env.HOSTNAME, 
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD, 
  database: process.env.DB_NAME, 
});
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to database");
});
app.get("/", (req, res) => {
  res.send("Hello, World!"); 
});

app.post("/api/products", (req, res) => {
  let {
    productId,
    productName,
    productMrp,
    productSp,
    productDiscount,
    breadcrumbs,
    imageUrl,
    brandName,
    siteId,
    updatedAt,
  } = req.body;
  console.log("Product data received:", req.body);
  if(!productMrp){
    productMrp = productSp;
  }
  console.log(productDiscount)
 
  const checkQuery =
    "SELECT COUNT(*) AS count FROM products WHERE productId = ? AND siteId = ?";

  db.query(checkQuery, [productId, siteId], (err, results) => {
    if (err) {
      console.error("Error checking product existence:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    const count = results[0].count;

    if (count > 0) {
      
      const updateQuery = `
                UPDATE products SET 
                    productName = ?, 
                    productMrp = ?, 
                    productSp = ?, 
                    productDiscount = ?, 
                    breadcrumbs = ?, 
                    imageUrl = ?, 
                    brandName = ?,  
                    updatedAt = ? 
                WHERE productId = ? AND siteId = ?`;

      db.query(
        updateQuery,
        [
          productName,
          productMrp,
          productSp,
          productDiscount,
          breadcrumbs,
          imageUrl,
          brandName,
          updatedAt,
          productId,
          siteId,
        ],
        (err) => {
          if (err) {
            console.error("Error updating product:", err);
            return res.status(500).json({ error: "Database update failed" });
          }
          console.log("Product updated successfully")
          return res
            .status(200)
            .json({ message: "Product updated successfully" });
        }
      );
    } else {
     
      const insertQuery = `
                INSERT INTO products (productId, productName, productMrp, productSp, productDiscount, breadcrumbs, imageUrl, brandName, siteId, updatedAt) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      db.query(
        insertQuery,
        [
          productId,
          productName,
          productMrp,
          productSp,
          productDiscount,
          breadcrumbs,
          imageUrl,
          brandName,
          siteId,
          updatedAt,
        ],
        (err) => {
          if (err) {
            console.error("Error inserting product:", err);
            return res.status(500).json({ error: "Database insertion failed" });
          }
          console.log("Product inserted successfully");
          return res
            .status(201)
            .json({ message: "Product inserted successfully" });
        }
      );
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
