import React, { useState, useEffect } from 'react';
import { MdClose, MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { removeTimeFromTimestamp } from '../../utils/Helper';
import Select from 'react-select';
import { FiUpload } from 'react-icons/fi';

const BookingModal = ({ isOpen, onClose, booking, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAdditionalChargesInput, setShowAdditionalChargesInput] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [damages, setDamages] = useState([]);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  async function fetchDamages() {
    const response = await fetch('/api/admin/damages', {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (!data.success) {
      toast.error(data.error);
      return
    }

    setDamages(data.damages);
  }

  useEffect(() => {
    fetchDamages();
  }, []);

  console.log(damages);
  console.log("Seleted Options: ", selectedOptions);

  // Handle file upload
  const handleFileChange = (e) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      }

      reader.readAsDataURL(file);

      setFormData((prevData) => ({
        ...prevData,
        file,
      }));
    }
  };

  // Clear selected file
  const clearImagePreview = () => {
    setPreviewUrl(null);
  }


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

    const additionalCharges = showAdditionalChargesInput ? selectedOptions : null;

    console.log("Additionmal Chrges: ", additionalCharges);
    


    onUpdate(booking, selectedStatus, additionalCharges);
    onClose();
  };

  // Toggle additional charges input
  const handleCheckbox = () => {
    setShowAdditionalChargesInput(!showAdditionalChargesInput);
  };

  const options = damages?.map((damage) => {
    return {
      value: `${damage.name} - ${damage.price}`,
      label: `${damage.name} - R${damage.price}`,
    };
  });

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
        <form onSubmit={handleSubmit} className="overflow-y-auto custom-scrollbar max-h-[65vh]">
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
              <div className="mt-6">
                <Select
                  defaultValue={selectedOptions}
                  onChange={setSelectedOptions}
                  options={options}
                  isMulti
                />
              </div>
            )}

            {/* File Upload Section */}
            {previewUrl ? (
              <div>
                <div className="mt-6 w-full relative h-auto p-1 rounded-md max-w-72 h-44">
                  <img src={previewUrl} alt="Image" className="w-full h-full rounded-md object-fill" />
                </div>
                <div className="mt-2 flex justify-start items-center cursor-pointer" onClick={() => clearImagePreview()}>
                  <MdDelete className="text-red-600 w-7 h-7" />
                  <p className="text-base font-semibold">Remove Image</p>
                </div>
              </div>
            ) : (
              <div className="w-full mt-6 py-4 bg-gray-50 rounded-2xl border border-gray-300 gap-3 grid border-dashed">
                <div className="grid gap-1 text-center">
                  {/* SVG Icon */}
                  <FiUpload className="mx-auto text-4xl text-blue-500" />

                  {/* File Input */}
                  <input
                    type="file"
                    className="mx-auto mt-6"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  <p className="text-xs text-gray-500">
                    Upload a picture of the damaged vehicle.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6">
              <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-700">
                Select Status
              </label>
              <select
                id="status"
                name="status"
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
