const express = require("express");
const router = express.Router();

const commentCtrl = require("../controllers/comment");

router.post("/", commentCtrl.create);
router.get("/post/:id", commentCtrl.readAll);
router.get("/:id", commentCtrl.readOne);
router.put("/:id", commentCtrl.update);
router.delete("/:id", commentCtrl.delete);

module.exports = router;
