import express from "express";
import { verifyJwt } from "../middlewares/verifyJwt.middleware.js";
import { generateInvoiceController } from "../controllers/invoice.controllers.js";

const invoice_router = express.Router();

invoice_router.use(verifyJwt);

invoice_router.post('/generate/:bookingId', generateInvoiceController);

export default invoice_router;