const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const accesUser = require("../middlewares/accesUser");
const auth = require("../middlewares/auth");

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
router.get("/:id", auth, userCtrl.getOne);
router.put("/:id", auth, accesUser, userCtrl.update);
router.delete("/:id", auth, accesUser, userCtrl.delete);

module.exports = router;
