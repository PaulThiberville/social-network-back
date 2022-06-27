const express = require("express");
const router = express.Router();

const postCtrl = require("../controllers/post");

router.post("/", postCtrl.create);
router.get("/", postCtrl.readAll);
router.get("/:id", postCtrl.readOne);
router.put("/:id", postCtrl.update);
router.delete("/:id", postCtrl.delete);

module.exports = router;
