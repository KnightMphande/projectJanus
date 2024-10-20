import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { toast } from 'react-toastify';
import { removeTimeFromTimestamp } from '../../utils/Helper';

const BookingModal = ({ isOpen, onClose, booking, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAdditionalChargesInput, setShowAdditionalChargesInput] = useState(false);
  const [pricingData, setPricingData] = useState({ typeOfFee: '', price: '' });

  // Update selectedStatus when booking changes
  useEffect(() => {
    setSelectedStatus(booking?.status || '');
  }, [booking]);

  // Handle status change
  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedStatus) {
      toast.error('Please select a status to update.');
      return;
    }

    // Pass pricing data only if additional charges are being applied
    const additionalCharges = showAdditionalChargesInput ? pricingData : null;

    onUpdate(booking, selectedStatus, additionalCharges);
    onClose();
  };

  // Toggle additional charges input
  const handleCheckbox = () => {
    setShowAdditionalChargesInput(!showAdditionalChargesInput);
    // Reset pricing data if checkbox is unchecked
    if (showAdditionalChargesInput) {
      setPricingData({ typeOfFee: '', price: '' });
    }
  };

  // Handle changes to pricing data
  const handlePricingChange = (event) => {
    const { name, value } = event.target;
    setPricingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full sm:max-w-lg mx-5 sm:mx-auto transition-all ease-out duration-500">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h4 className="text-sm text-gray-900 font-medium">Update Booking</h4>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-all duration-300">
            <MdClose size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-center gap-6 mb-4">
              <img
                className="w-24 h-24 rounded-md"
                src={`http://localhost:5000/image/${booking.vehicle_id}/${booking.filename}`}
                alt={`${booking.make} ${booking.model}`}
              />
              <div>
                <h2 className="font-medium text-gray-800">{booking.make}</h2>
                <p className="text-sm text-gray-600">Model: {booking.model}</p>
                <p className="text-sm text-gray-600">Year: {booking.year}</p>
                <p className="text-sm text-gray-600">Category: {booking.category}</p>
              </div>
            </div>
            <div className="grid gap-4 grid-cols-2">
              <p><strong>CheckIn:</strong> {removeTimeFromTimestamp(booking.check_in)}</p>
              <p><strong>CheckOut:</strong> {removeTimeFromTimestamp(booking.check_out)}</p>
              <p><strong>PickUp Location:</strong> {booking.pick_up_location}</p>
              <p><strong>DropOff Location:</strong> {booking.drop_off_location}</p>
              <p><strong>Amount:</strong> {booking.amount}</p>
              <p><strong>Days:</strong> {booking.total_days}</p>
            </div>
            <div className="grid gap-4 grid-cols-1 mt-4">
              <label>
                <input
                  onChange={handleCheckbox}
                  checked={showAdditionalChargesInput}
                  type="checkbox"
                /> Charge additional price
              </label>
            </div>
            {showAdditionalChargesInput && (
              <div className="grid gap-4 grid-cols-2 mt-4">
                <select
                  name="typeOfFee"
                  className="formInput"
                  value={pricingData.typeOfFee}
                  onChange={handlePricingChange}
                >
                  <option value="">Select type for fee</option>
                  <option value="Car Scratches">Car Scratches</option>
                  <option value="Late Fees">Late Fees</option>
                  <option value="Paint Damage">Paint Damage</option>
                  <option value="Damaged Bumpers">Damaged Bumpers</option>
                  <option value="Cracked Windshield">Cracked Windshield</option>
                </select>
                <input
                  type="text"
                  name="price"
                  placeholder="Price"
                  onChange={handlePricingChange}
                  value={pricingData.price}
                  className="formInput"
                />
              </div>
            )}
            <div className="mt-6">
              <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-700">
                Select Status
              </label>
              <select
                id="status"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={selectedStatus}
                onChange={handleStatusChange}
              >
                <option value="" disabled>Select Status</option>
                <option value="confirmed">Confirm</option>
                <option value="cancelled">Cancel</option>
                <option value="completed">Check In</option>
                <option value="rented">Check Out</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-end p-4 border-t border-gray-200 space-x-4">
            <button
              type="button"
              className="py-2.5 px-5 text-xs bg-green-50 text-green-500 rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:bg-green-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-5 text-xs bg-green-600 text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:bg-green-700"
            >
              Update Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
