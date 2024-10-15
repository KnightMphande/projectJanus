import { BookingService } from "../services/booking.services.js";
import { HelperFunc } from "../utils/helper.utils.js";

export const createBookingController = async (req, res) => {
  const bookingData = req.body;

  // Access the userId and role from the req object
  const userId = req.user;
  const role = req.role;

  try {
    if (role === "admin") {
      return res
        .status(400)
        .json({ success: false, error: "Admin cannot book a car" });
    }

    bookingData.customerId = userId;
    bookingData.status = "in-progress";

    const newBooking = await BookingService.createBooking(bookingData);

    return res
      .status(201)
      .json({ success: true, message: "Car successfully booked", newBooking });
  } catch (error) {
    console.error("Failed to make a booking: ", error);

    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const getAllBookingsController = async (req, res) => {
  // Access the userId and role from the req object
  const userId = req.user;
  const role = req.role;
  try {
    if (role === "customer") {
      // Fetch bookings related to the customer
      const bookings = await BookingService.getAllBookings();

      return res.status(200).json({ success: true, bookings });
    }

    const bookings = await BookingService.getAllBookings();

    // console.log("Bookings: ", bookings);

    return res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Failed to fetch bookings: ", error);

    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const getBookingByIdController = async (req, res) => {
  // Access the userId and role from the req object
  const userId = req.user;
  const role = req.role;

  const bookingId = parseInt(req.params.bookingId);

  try {
    const booking = await BookingService.getBookingById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, error: "Booking not found" });
    }

    return res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error("Failed to fetch a single booking: ", error);

    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const deleteBookingController = async (req, res) => {
  // Access the userId and role from the req object
  const userId = req.user;
  const role = req.role;

  const bookingId = parseInt(req.params.bookingId);

  try {
    if (role === "admin") {
      return res
        .status(400)
        .json({ success: false, error: "Cannot delete customer booking" });
    }

    const deletedBooking = await BookingService.deleteBooking(bookingId);

    if (!deletedBooking)
      return res
        .status(404)
        .json({ success: false, error: "Booking not found" });
    else if (deletedBooking) {
      deletedBooking.status = "cancelled";

      const movedToHistoryBooking = await BookingService.moveBookingToHistory(
        bookingId,
        deletedBooking
      );

      if (movedToHistoryBooking) {
        return res.status(200).json({
          success: true,
          message: "Booking cancelled successfully",
        });
      }
    }
  } catch (error) {
    console.error("Failed to delete booking: ", error);

    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const updateBookingController = async (req, res) => {
  // Access the userId and role from the req object
  const userId = req.user;
  const role = req.role;

  const bookingId = parseInt(req.params.bookingId);
  const status = req.query.status;
  const bookingData = req.body;

  // console.log("Booking Data on the Controller: ", bookingData);

  try {
    if (role === "customer") {
      bookingData.status = "in-progress";

      const updatedBooking = await BookingService.updateBooking(
        bookingId,
        bookingData
      );

      if (!updatedBooking)
        return res
          .status(404)
          .json({ success: false, error: "Booking not found" });

      return res
        .status(200)
        .json({
          success: true,
          message: "Booking updated successfully",
          updatedBooking,
        });
    } else if (role === "admin") {
      bookingData.status = status;

      // Get the booking details from database to check if vehicle was rented or not
      const bookingRecord = await BookingService.getBookingById(bookingId);

      if (
        bookingData.status === "completed" &&
        bookingRecord.status !== "rented"
      ) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Cannot check in a vehicle that was not rented",
          });
      }

      // Check the current date and compare with checkout date to allow renting only if the checkout date has arrived
      if (bookingData.status === "rented") {
        const dateToday = await HelperFunc.getDateToday(); 
        
        const checkoutDate = new Date(bookingRecord.check_out).toISOString().split('T')[0]; 
        
        if (dateToday < checkoutDate) {
          return res.status(400).json({ success: false, error: "Cannot rent vehicle before checkout date." });
        }

      }      

      const updatedBooking = await BookingService.updateBooking(
        bookingId,
        bookingData
      );

      if (!updatedBooking)
        return res
          .status(404)
          .json({ success: false, error: "Booking not found" });

      if (
        updatedBooking.status === "completed" ||
        updatedBooking.status === "cancelled"
      ) {
        const deletedBooking = await BookingService.deleteBooking(
          updatedBooking.booking_id
        );

        if (deletedBooking) {
          const movedToHistoryBooking =
            await BookingService.moveBookingToHistory(
              bookingId,
              deletedBooking
            );

          if (movedToHistoryBooking) {
            return res
              .status(200)
              .json({
                success: true,
                message: "Booking updated successfully",
                updatedBooking,
              });
          }
        }
      }

      return res
        .status(200)
        .json({
          success: true,
          message: "Booking updated successfully",
          updatedBooking,
        });
    }
  } catch (error) {
    console.error("Failed to updated booking: ", error);

    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const getLocationsController = async (req, res) => {
  try {
    const locations = await BookingService.getLocations();

    return res.status(200).json({ success: true, locations });
  } catch (error) {
    console.log("Error fetching locations: ", error);

    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};
