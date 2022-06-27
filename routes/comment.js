const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const setComment = require("../middlewares/setComment");
const accesComment = require("../middlewares/accesComment");
const commentCtrl = require("../controllers/comment");

router.post("/:id", auth, commentCtrl.create);
router.get("/post/:id", auth, commentCtrl.readAll);
router.get("/:id", auth, commentCtrl.readOne);
router.put("/:id", auth, setComment, accesComment, commentCtrl.update);
router.delete("/:id", auth, setComment, accesComment, commentCtrl.delete);

module.exports = router;
