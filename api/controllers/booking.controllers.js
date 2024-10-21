import { BookingService } from "../services/booking.services.js";
import { NotificationService } from "../services/notifications.services.js";
import { VehicleService } from "../services/vehicle.services.js";
import { HelperFunc } from "../utils/helper.utils.js";
import { generateInvoice } from "./invoice.controllers.js";

export const createBookingController = async (req, res) => {
  const bookingData = req.body;

  // Access the userId and role from the req object
  const userId = req.user;
  const role = req.role;

  try {
    if (role === "admin" || role === "employee") {
      return res
        .status(400)
        .json({ success: false, error: "Staff cannot book a car" });
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
  const notificationService = new NotificationService();

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

      return res.status(200).json({
        success: true,
        message: "Booking updated successfully",
        updatedBooking,
      });
    } else if (role === "admin" || role === "employee") {
      bookingData.status = status;

      // Get the booking details from database to check if vehicle was rented or not
      const bookingRecord = await BookingService.getBookingById(bookingId);

      if (bookingData.status === "completed" && bookingRecord.status !== "rented") {
        return res.status(400).json({
          success: false,
          error: "Cannot check in a vehicle that was not rented",
        });
      }

      // Check the current date and compare with checkout date to allow renting only if the checkout date has arrived
      if (bookingData.status === "rented") {
        const dateToday = await HelperFunc.getDateToday();

        const checkoutDate = new Date(bookingRecord.check_out)
          .toISOString()
          .split("T")[0];

        if (dateToday < checkoutDate) {
          return res.status(400).json({
            success: false,
            error: "Cannot rent vehicle before checkout date.",
          });
        }
      }

      // Update booking
      const updatedBooking = await BookingService.updateBooking(
        bookingId,
        bookingData
      );

      const vehicle = await VehicleService.getVehicleById(updatedBooking.vehicle_id);

      updatedBooking.vehicle = vehicle;

      // Push notification
      if (bookingData.status === "completed") await notificationService.notifyBookingCompleted(updatedBooking);

      if (bookingData.status === "confirmed") await notificationService.notifyBookingConfirmed(updatedBooking);

      if (bookingData.status === "rented") await notificationService.notifyStatusChange(updatedBooking);

      const updatedStatus = updatedBooking.status;

      if (updatedStatus === "rented") {
        // Update vehicle that has been rented
        await VehicleService.updateVehicle(updatedBooking.vehicle_id, {
          status: updatedStatus,
          price: null,
        });
      }

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
          // Update vehicle that has been rented
          await VehicleService.updateVehicle(updatedBooking.vehicle_id, {
            status: "available",
            price: null,
          });

          // Check if booking has an damaged car image
          if (req.file) {
            deletedBooking.damaged_image_url = req.file.filename;
          }

          const movedToHistoryBooking =
            await BookingService.moveBookingToHistory(
              bookingId,
              deletedBooking
            );

          // console.log(bookingData);

          // Generate invoice
          const invoicePath = await generateInvoice(movedToHistoryBooking.booking_id, bookingData.customer_id, bookingData.additionalCharges);

          console.log(invoicePath);


          if (movedToHistoryBooking) {
            return res.status(200).json({
              success: true,
              message: "Booking updated successfully",
              updatedBooking,
            });
          }
        }
      }

      return res.status(200).json({
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
