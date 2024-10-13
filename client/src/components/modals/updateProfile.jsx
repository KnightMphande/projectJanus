import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { toast } from 'react-toastify';

export default function UpdateProfileModal({ close, updateProfile, profileData }) {
  const [formData, setFormData] = useState({
    names: '',
    address: '',
    phone: '',
    profilePic: null,
  });
  const [preview, setPreview] = useState(null);

  // Prefill form data with profileData
  useEffect(() => {
    if (profileData) {
      setFormData({
        names: profileData.names || '',
        address: profileData.address || '',
        phone: profileData.phone || '',
        profilePic: null,
      });
    }
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      profilePic: file,
    }));

    // Create a preview using FileReader
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("File Check: ", formData.profilePic);
    
    formData.customerId = profileData.customer_id;
    updateProfile(formData);
  };

  return (
    <div className="w-full relative">
      <div className="modalContainer">
        {/* Modal Content */}
        <div className="modal">
          {/* Modal Header */}
          <div className="modalHeader">
            <h4 className="modalHeading">Update Profile</h4>
            {/* Close Button */}
            <button className="closeBtn" onClick={() => close("signin")}>
              <MdClose size={24} className="icon" />
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 overflow-y-auto custom-scrollbar">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="names"
                value={formData.names}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
              <input
                type="file"
                name="profilePic"
                onChange={handleFileChange}
                className="mt-1 block w-full"
              />
            </div>

            {/* Display the preview if available */}
            {preview && (
              <div>
                <img className="w-28 h-20 rounded mt-2" src={preview} alt="Profile Preview" />
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 focus:outline-none"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
