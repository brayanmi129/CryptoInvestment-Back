// services/cryptoService.js
import axios from "axios";
import { getConnection } from "../config/db.js";

export async function fetchCryptoListFromDB() {
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

export async function fetchHistoryFromDB(id) {
  const pool = await getConnection();

  const result = await pool.request().input("cryptoId", id).query(`
      SELECT * 
      FROM historial_precio 
      WHERE crypto_id = @cryptoId
      ORDER BY date DESC
    `);

  return result.recordset;
}

export async function fetchCryptoByIdFromAPI(id) {
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

export async function actualizarCriptosEnDB() {
  try {
    const response = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY,
        },
      }
    );

    const data = response.data.data;
    const pool = await getConnection();

    for (const cripto of data) {
      const { id, quote } = cripto;
      console.log(id);
      const price = quote.USD.price;
      const percent_change_24h = quote.USD.percent_change_24h;
      const fecha = new Date().toISOString(); // Fecha actual en UTC ISO

      // Inserta en la tabla de historial
      await pool.request().query(`
        INSERT INTO historial_precio (crypto_id, price, date, percent_change_24h)
        VALUES (${id}, ${price}, '${fecha}', ${percent_change_24h})
      `);
    }

    console.log("Criptomonedas y su historial actualizados correctamente.");
  } catch (error) {
    console.error("Error al actualizar criptomonedas:", error.message);
  }
}
