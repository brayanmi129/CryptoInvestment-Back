// services/cryptoService.js
const axios = require("axios");
const { getConnection } = require("../config/db.js");
async function fetchCryptoListFromDB() {
  const pool = await getConnection();

  const result = await pool.request().query(`
    SELECT 
      cm.*, 
      hp.price, 
      hp.percent_change_24h
    FROM crypto_moneda cm
    LEFT JOIN historial_precio hp
      ON cm.id = hp.crypto_id
      AND CAST(hp.date AS DATE) = CAST(GETDATE() AS DATE)
  `);

  return result.recordset;
}

async function fetchHistoryFromDB(id) {
  const pool = await getConnection();

  const result = await pool.request().input("cryptoId", id).query(`
      SELECT * 
      FROM historial_precio 
      WHERE crypto_id = @cryptoId
      ORDER BY date DESC
    `);

  return result.recordset;
}

async function fetchCryptoByIdFromAPI(id) {
  const response = await axios.get(
    `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${id}`,
    {
      headers: {
        "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY,
      },
    }
  );

  const data = response.data.data[id];
  const price = data.quote.USD.price;

  const calcPastPrice = (percent) => price / (1 + percent / 100);

  return {
    name: data.name,
    id: data.id,
    symbol: data.symbol,
    price: price,
    volume_24h: data.quote.USD.volume_24h,
    percent_change_1h: data.quote.USD.percent_change_1h,
    percent_change_24h: data.quote.USD.percent_change_24h,
    percent_change_7d: data.quote.USD.percent_change_7d,
    percent_change_30d: data.quote.USD.percent_change_30d,
    percent_change_60d: data.quote.USD.percent_change_60d,
    percent_change_90d: data.quote.USD.percent_change_90d,
    price_1h_ago: calcPastPrice(data.quote.USD.percent_change_1h).toFixed(2),
    price_24h_ago: calcPastPrice(data.quote.USD.percent_change_24h).toFixed(2),
    price_7d_ago: calcPastPrice(data.quote.USD.percent_change_7d).toFixed(2),
    price_30d_ago: calcPastPrice(data.quote.USD.percent_change_30d).toFixed(2),
    price_60d_ago: calcPastPrice(data.quote.USD.percent_change_60d).toFixed(2),
    price_90d_ago: calcPastPrice(data.quote.USD.percent_change_90d).toFixed(2),
  };
}

async function actualizarCriptosEnDB(random = null) {
  console.log("IDs random recibidos:", random);

  try {
    // 1️⃣ Obtener todas las monedas desde CoinMarketCap
    const response = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY,
        },
      }
    );

    const data = response.data.data; // lista completa
    const pool = await getConnection();

    // 2️⃣ Filtrar si recibimos random
    let monedasAProcesar = data;
    if (random) {
      // Si viene como string único, lo convertimos a array
      const randomIds = Array.isArray(random) ? random.map((id) => Number(id)) : [Number(random)];

      monedasAProcesar = data.filter((cripto) => randomIds.includes(cripto.id));
    }

    const hoy = new Date().toISOString().split("T")[0];

    // 3️⃣ Procesar solo las monedas seleccionadas
    for (const cripto of monedasAProcesar) {
      const { id, quote } = cripto;
      const price = quote.USD.price;
      const percent_change_24h = quote.USD.percent_change_24h;

      const existe = await pool.request().query(`
        SELECT COUNT(*) AS total
        FROM historial_precio
        WHERE crypto_id = ${id}
          AND CONVERT(date, date) = '${hoy}'
      `);

      if (existe.recordset[0].total === 0) {
        await pool.request().query(`
          INSERT INTO historial_precio (crypto_id, price, date, percent_change_24h)
          VALUES (${id}, ${price}, GETDATE(), ${percent_change_24h})
        `);
        console.log(`Insertado: crypto_id ${id}`);
      } else {
        console.log(`Ya existe registro para hoy: crypto_id ${id}`);
      }
    }

    console.log("Actualización completada.");
  } catch (error) {
    console.error("Error al actualizar criptomonedas:", error.message);
  }
}

module.exports = {
  fetchCryptoListFromDB,
  fetchHistoryFromDB,
  fetchCryptoByIdFromAPI,
  actualizarCriptosEnDB,
};
