import express from "express";
import { verifyJwt } from "../middlewares/verifyJwt.middleware.js";
import { getFleetReports } from "../controllers/reports.controllers.js";

const reports_router = express.Router();

reports_router.use(verifyJwt);

reports_router.get('/fleet', getFleetReports);

export default reports_router;