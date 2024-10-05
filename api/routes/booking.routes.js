import express from "express";
import { verifyJwt } from "../middlewares/verifyJwt.middleware.js";
import { createBookingController, deleteBookingController, getAllBookingsController, getBookingByIdController, updateBookingController } from "../controllers/booking.controllers.js";

const booking_router = express.Router();

booking_router.use(verifyJwt);

booking_router.post('/', createBookingController);
booking_router.get('/', getAllBookingsController);
booking_router.get('/:bookingId', getBookingByIdController);
booking_router.delete('/:bookingId', deleteBookingController);
booking_router.put('/:bookingId/update', updateBookingController);

export default booking_router;