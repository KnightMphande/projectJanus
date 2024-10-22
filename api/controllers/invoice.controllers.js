import { AuthenticationService } from "../services/auth.services.js";
import { BookingService } from "../services/booking.services.js";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { InvoiceService } from "../services/invoice.services.js";
import { HelperFunc } from "../utils/helper.utils.js";

// Function to generate the invoice
export const generateInvoice = async (bookingId, userId, additionalCharges) => {

  console.log("Invoice Details: ", bookingId, userId, additionalCharges);

  // Fetch booking details
  const booking = await BookingService.getHistoryBookingById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  const customer = await AuthenticationService.getUserById(userId, "customer");

  if (!customer) {
    throw new Error("Customer not found");
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

  // Loop through additionalCharges to display on invoice
  if(additionalCharges !== null) {
    additionalCharges?.forEach((charge) => {
      const [name, price] = charge.value.split(' - '); // Split the value by ' - R' to get name and price
  
      // Display the name and price on the invoice
      doc.text(`${name} : R${price}`);
    });
  }

  // Calculate the final total including all additional charges
  const finalTotal = additionalCharges !== null
    ? Number(booking.amount) + additionalCharges.reduce((sum, charge) => {
      const [, price] = charge.value.split(' - R'); // Get the price part from the value
      return sum + Number(price); // Add the price to the sum
    }, 0)
    : booking.amount;

  doc.moveDown();
  doc.text(`Total amount: R${finalTotal}`);
  doc.moveDown();
  doc.text("Thank you for choosing our service!", { align: "center" });
  doc.end();

  // Save or update the invoice in the database
  if (existingInvoice) {
    await InvoiceService.updateInvoice(bookingId, userId, finalTotal, additionalCharges?.price || 0);
  } else {
    await InvoiceService.saveInvoice(booking.booking_id, userId, Number(booking.amount), additionalCharges);
  }

  return invoicePath;
};

// Controller to retrieve the invoice
export const getInvoiceController = async (req, res) => {
  const bookingId = parseInt(req.params.bookingId);

  try {
    const invoicePath = path.join("uploads", "invoices", `invoice_${bookingId}.pdf`);

    // Check if the invoice file exists
    if (!fs.existsSync(invoicePath)) {
      return res.status(404).json({ success: false, error: "Invoice not found" });
    }

    // Send the file if found in the response

    // Return the invoice file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice_${bookingId}.pdf`);
    fs.createReadStream(invoicePath).pipe(res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
