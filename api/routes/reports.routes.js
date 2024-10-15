import express from "express";
import { verifyJwt } from "../middlewares/verifyJwt.middleware.js";
import { getAllCustomersController, getFleetReports } from "../controllers/reports.controllers.js";

const reports_router = express.Router();

reports_router.use(verifyJwt);

reports_router.get('/fleet', getFleetReports);


// Incoporate route to get all customers since it more related or data to be accessed by admin
reports_router.get('/customers', getAllCustomersController);

export default reports_router;