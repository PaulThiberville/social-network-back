const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const setComment = require("../middlewares/setComment");
const accesComment = require("../middlewares/accesComment");
const commentCtrl = require("../controllers/comment");

router.post("/:id", auth, commentCtrl.create);
router.put("/:id", auth, setComment, accesComment, commentCtrl.update);
router.delete("/:id", auth, setComment, accesComment, commentCtrl.delete);
router.post("/like/:id", auth, commentCtrl.like);
router.post("/unlike/:id", auth, commentCtrl.unlike);

module.exports = router;
