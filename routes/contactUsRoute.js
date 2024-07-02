const express = require("express");
const { contactUs } = require("../controllers/contactusController");
const router =express.Router();
const authGard = require("../middleWare/authMiddleware");
router.post('/', authGard, contactUs)

module.exports = router