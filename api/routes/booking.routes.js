import express from "express";
import { verifyJwt } from "../middlewares/verifyJwt.middleware.js";
import { createBookingController, getAllBookingsController, getBookingByIdController } from "../controllers/booking.controllers.js";

const booking_router = express.Router();

booking_router.use(verifyJwt);

booking_router.post('/', createBookingController);
booking_router.get('/', getAllBookingsController);
booking_router.get('/:bookingId', getBookingByIdController);

export default booking_router;