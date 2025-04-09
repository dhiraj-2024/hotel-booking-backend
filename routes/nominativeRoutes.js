// backend/routes/nominativeRoutes.js
const express = require("express");
const { 
  createNominativeEntry, 
  checkNominativeStatus, 
  getNominativeDetails 
} = require("../controllers/nominativeController.js"); 

const router = express.Router();

router.post("/", createNominativeEntry);
router.get("/status/:order_id", checkNominativeStatus);
router.get("/:order_id", getNominativeDetails);

module.exports = router;