const express = require("express")
const router = express.Router()
const purchaseController = require("../controllers/purchaseController")

router.get("/", purchaseController.getAllPurchases)
router.get("/daily-earnings", purchaseController.getDailyEarnings)
router.get("/earnings-today", purchaseController.getTodayEarnings)
router.post("/", purchaseController.createPurchase)
router.delete("/", purchaseController.deleteAllPurchases)
router.delete("/:id", purchaseController.deletePurchase)
router.put("/:id/pay", purchaseController.payPurchase)

module.exports = router
