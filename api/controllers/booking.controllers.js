import { BookingService } from "../services/booking.services.js";

export const createBookingController = async (req, res) => {
  const bookingData = req.body;
  const customerId = parseInt(req.params.customerId);

  try {
    bookingData.customerId = customerId;
    bookingData.status = 'in-progress';

    const newBooking = await BookingService.createBooking(bookingData);

    return res.status(201).json({ success: true, data: newBooking });
  } catch (error) {
    console.error("Failed to make a booking: ", error);

    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};
