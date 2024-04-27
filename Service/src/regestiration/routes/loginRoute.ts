/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
import * as loginController from "../controllers/loginController";
const verifyToken = require("../middleWare/verifyToken");
const verifyDoctor = require("../middleWare/verifyDoctor");
const router = express.Router();

router.post("/", loginController.loginUser);
router.get("/verify/", [verifyToken, verifyDoctor], loginController.logedIn);

export default router;
