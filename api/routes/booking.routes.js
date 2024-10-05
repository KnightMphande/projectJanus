import express from "express";
import { verifyJwt } from "../middlewares/verifyJwt.middleware.js";
import { createBookingController } from "../controllers/booking.controllers.js";

const booking_router = express.Router();

booking_router.use(verifyJwt);

booking_router.post('/:customerId', createBookingController);

export default booking_router;