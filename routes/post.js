const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const setPost = require("../middlewares/setPost");
const accesPost = require("../middlewares/accesPost");
const postCtrl = require("../controllers/post");

router.post("/", auth, postCtrl.create);
router.get("/", auth, postCtrl.readAll);
router.get("/:id", auth, postCtrl.readOne);
router.put("/:id", auth, setPost, accesPost, postCtrl.update);
router.delete("/:id", auth, setPost, accesPost, postCtrl.delete);
router.post("/like/:id", auth, postCtrl.like);
router.post("/unlike/:id", auth, postCtrl.unlike);

module.exports = router;
