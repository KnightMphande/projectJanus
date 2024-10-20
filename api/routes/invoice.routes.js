import express from "express";
import { verifyJwt } from "../middlewares/verifyJwt.middleware.js";
import { getInvoiceController } from "../controllers/invoice.controllers.js";

const invoice_router = express.Router();

invoice_router.use(verifyJwt);

invoice_router.get('/:bookingId', getInvoiceController);

export default invoice_router;