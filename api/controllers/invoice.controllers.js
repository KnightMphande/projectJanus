import { AuthenticationService } from "../services/auth.services.js";
import { BookingService } from "../services/booking.services.js";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { InvoiceService } from "../services/invoice.services.js";
import { HelperFunc } from "../utils/helper.utils.js";

export const generateInvoiceController = async (req, res) => {
    // Access the userId and role from the req object
    const userId = req.user;
    const role = req.role;
  
    const bookingId = parseInt(req.params.bookingId);
    const { additionalCharges, totalAmount } = req.body;
  
    try {
      // Fetch booking details
      const booking = await BookingService.getHistoryBookingById(bookingId);
  
      if (!booking) {
        return res.status(404).json({ success: false, error: "Booking not found" });
      }
  
      const customer = await AuthenticationService.getUserById(userId, role);
  
      if (!customer) {
        return res.status(404).json({ success: false, error: "Customer not found" });
      }
  
      // Check if the invoice already exists
      const existingInvoice = await InvoiceService.checkInvoiceExists(bookingId);
  
      // Create PDF document
      const doc = new PDFDocument();
      const invoicePath = path.join("uploads", "invoices", `invoice_${bookingId}.pdf`);
      doc.pipe(fs.createWriteStream(invoicePath));
  
      // PDF content
      doc.fontSize(25).text("Invoice", { align: "center" });
      doc.moveDown();
  
      doc.fontSize(16).text(`Customer: ${customer.names}`);
      doc.text(`Email: ${customer.email}`);
      doc.text(`Phone: ${customer.phone}`);
      doc.moveDown();
  
      doc.text(`Booking ID: ${booking.booking_id}`);
      doc.text(`Vehicle ID: ${booking.vehicle_id}`);
      doc.text(`Check-in: ${await HelperFunc.removeTimeFromTimestamp(booking.check_in)}`);
      doc.text(`Check-out: ${await HelperFunc.removeTimeFromTimestamp(booking.check_out)}`);
      doc.text(`Amount: R${booking.amount}`);
  
      const finalTotal = additionalCharges ? booking.amount + additionalCharges : booking.amount;
      doc.text(`Additional costs: R${additionalCharges || 0}`);
      doc.moveDown();
      doc.text(`Total amount: R${finalTotal}`);
      doc.moveDown();
      doc.text("Thank you for choosing our service!", { align: "center" });
      doc.end();
  
      // If the invoice exists, update it; otherwise, save a new invoice
      if (existingInvoice) {
        await InvoiceService.updateInvoice(bookingId, userId, finalTotal, additionalCharges || 0);
      } else {
        await InvoiceService.saveInvoice(booking.booking_id, userId, booking.amount, additionalCharges || 0);
      }
  
      return res.status(201).json({
        success: true,
        message: "Invoice successfully downloaded",
        invoicePath,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };
  
