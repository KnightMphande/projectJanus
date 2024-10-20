import express from "express";
import { verifyJwt } from "../middlewares/verifyJwt.middleware.js";
import { getAllCustomersController, getCalculationsController, getCustomerActivityReportsController, getFleetReports, getUsageStatisticsController } from "../controllers/reports.controllers.js";

const reports_router = express.Router();

reports_router.use(verifyJwt);

reports_router.get('/fleet', getFleetReports);
reports_router.get('/calculations', getCalculationsController);
reports_router.get('/customer-activity', getCustomerActivityReportsController);
reports_router.get('/usage-statistics', getUsageStatisticsController);

reports_router.get('/customers', getAllCustomersController);

export default reports_router;