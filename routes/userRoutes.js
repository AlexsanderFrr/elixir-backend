"use-strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/usuarioController");
const auth = require("../middlewares/authMiddleware");
let _ctrl = new controller();

router.post("/register",_ctrl.post);
router.post("/authenticate",_ctrl.autheticate);

router.get("/",auth,_ctrl.get);
router.get("/:id",auth,_ctrl.get);
router.delete("/:id",auth,_ctrl.delete);

module.exports = router;