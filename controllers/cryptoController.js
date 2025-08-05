// controllers/cryptoController.js
const {
  fetchCryptoListFromDB,
  fetchCryptoByIdFromAPI,
  fetchHistoryFromDB,
} = require("../services/cryptoService.js");

async function getCryptoData(req, res) {
  try {
    const data = await fetchCryptoListFromDB();
    res.json(data);
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    res.status(500).json({ error: "Error al obtener los datos de las criptomonedas" });
  }
}

async function getDataById(req, res) {
  const id = req.query.id;
  try {
    const criptoData = await fetchCryptoByIdFromAPI(id);
    res.json(criptoData);
  } catch (error) {
    console.error(`Error al obtener datos para el ID ${id}:`, error.message);
    res.status(400).json({ error: `Error al obtener datos para el ID ${id}` });
  }
}

async function getCryptoHistory(req, res) {
  const id = req.query.id;
  try {
    const historyData = await fetchHistoryFromDB(id);
    res.json(historyData);
  } catch (e) {
    console.error(`Error al obtener historial para el ID ${id}:`, e.message);
    res.status(400).json({ error: `Error al obtener historial para el ID ${id}` });
  }
}

// Al final de cryptoController.js
module.exports = {
  getCryptoData,
  getDataById,
  getCryptoHistory,
};
