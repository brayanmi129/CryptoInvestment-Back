const controllers = require("../controllers/cryptoController.js");
const express = require("express");
const router = express.Router();

router.get("/getCryptoData", controllers.getCryptoData);
router.get("/getDataById", controllers.getDataById);
router.get("/getCryptoHistory", controllers.getCryptoHistory);

module.exports = router;
