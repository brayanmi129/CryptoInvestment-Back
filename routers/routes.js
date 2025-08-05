import controllers from "../controllers/cryptoController.js";
import express from "express";
const router = express.Router();

router.get("/getCryptoData", controllers.getCryptoData);
router.get("/getDataById", controllers.getDataById);
router.get("/getCryptoHistory", controllers.getCryptoHistory);

export default router;
