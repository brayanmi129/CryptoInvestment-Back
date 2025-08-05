import sql from "mssql";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.SERVER,
  database: process.env.DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

let poolPromise;

async function getConnection() {
  if (!poolPromise) {
    poolPromise = sql.connect(config);
  }
  return poolPromise;
}

export { getConnection, sql };

// const data = JSON.parse(fs.readFileSync("./data.json", "utf8")).Data;

// async function init() {
//   try {
//     const pool = await getConnection();

//     await pool.query(`
//       IF NOT EXISTS (
//         SELECT * FROM INFORMATION_SCHEMA.TABLES
//         WHERE TABLE_NAME = 'crypto_moneda'
//       )
//       BEGIN
//         CREATE TABLE crypto_moneda (
//           id INT PRIMARY KEY,
//           name VARCHAR(100),
//           symbol VARCHAR(20),
//           logo VARCHAR(255) NULL,
//           price DECIMAL(18, 8) NULL,
//           percent_change_30d DECIMAL(18, 2) NULL
//         )
//       END
//     `);

//     for (const coin of data) {
//       await pool.query(`
//         MERGE crypto_moneda AS target
//         USING (SELECT ${coin.id} AS id) AS source
//         ON (target.id = source.id)
//         WHEN MATCHED THEN
//           UPDATE SET name = '${coin.name}', symbol = '${coin.symbol}', logo = '${coin.logo}', price = ${coin.price} , percent_change_30d = ${coin.percent_change_30d}
//         WHEN NOT MATCHED THEN
//           INSERT (id, name, symbol, logo, price, percent_change_30d)
//           VALUES (${coin.id}, '${coin.name}', '${coin.symbol}', '${coin.logo}', ${coin.price}, ${coin.percent_change_30d});
//       `);
//     }

//     console.log("Datos insertados o actualizados correctamente.");
//     pool.close();
//   } catch (err) {
//     console.error("Error:", err);
//   }
// }

// init();
