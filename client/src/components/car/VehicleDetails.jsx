import React, { useState } from 'react';
import { FiUpload } from 'react-icons/fi'; // Importing an upload icon
import { FaCar } from 'react-icons/fa'; // Importing a car icon
import { MdDelete } from 'react-icons/md';

export default function VehicleDetails() {
    const [formData, setFormData] = useState({
        color: '',
        numberOfSeats: '',
        mileage: '',
        file: null,
    });
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

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

    const clearImagePreview = () => {
        setPreviewUrl(null);
    }

    // Handle Submit
    const handleVehicleDetailsSubmit = (e) => {
        e.preventDefault();

        try {
            console.log(formData);
            
            
        } catch (error) {
            console.log(error);
            
        }
    }

    return (
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
            <div className="h-32 rounded-lg lg:col-span-2">
                {/* Vehicle Details Form */}
                <form onSubmit={handleVehicleDetailsSubmit}>
                    <h2 className="text-2xl text-slate-900 font-semibold">
                        Add Vehicle Details
                    </h2>

                    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {/* Color */}
                        <select
                            name="color"
                            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                            value={formData.color}
                            onChange={handleChange}
                        >
                            <option value="">Select Color</option>
                            <option value="white">White</option>
                            <option value="silver">Silver</option>
                            <option value="gray">Gray</option>
                            <option value="blue">Blue</option>
                            <option value="red">Red</option>
                            <option value="black">Black</option>
                            <option value="green">Green</option>
                            <option value="yellow">Yellow</option>
                            <option value="orange">Orange</option>
                            <option value="purple">Purple</option>
                            <option value="pink">Pink</option>
                            <option value="brown">Brown</option>
                            <option value="cyan">Cyan</option>
                            <option value="magenta">Magenta</option>
                            <option value="lime">Lime</option>
                            <option value="teal">Teal</option>
                            <option value="navy">Navy</option>
                            <option value="gold">Gold</option>
                            <option value="peach">Peach</option>
                            <option value="mint">Mint</option>
                            <option value="beige">Beige</option>
                        </select>

                        {/* Number of Seats */}
                        <input
                            type="number"
                            name="numberOfSeats"
                            placeholder="Number of Seats"
                            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                            value={formData.numberOfSeats}
                            onChange={handleChange}
                        />

                        {/* Mileage */}
                        <input
                            type="number"
                            name="mileage"
                            placeholder="Mileage (km)"
                            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                            value={formData.mileage}
                            onChange={handleChange}
                        />
                    </div>

                    {/* File Upload Section */}

                    {
                        previewUrl ? (<div>
                            <div className="mt-6 w-full relative h-auto p-1 border border-gray-200 rounded-md max-w-sm">
                                <img src={previewUrl} alt="Image" className="rounded-md max-w-full h-auto" />
                            </div>
                            <div className="mt-2 flex justify-start items-center cursor-pointer" onClick={() => clearImagePreview()}>
                                <MdDelete className="text-red-600 w-7 h-7" />
                                <p className="text-base font-semibold">Remove Image</p>
                            </div>
                        </div>) : (<div className="w-full py-9 bg-gray-50 rounded-2xl border border-gray-300 gap-3 grid border-dashed">
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
                                    Upload a picture of the vehicle or related documents.
                                </p>
                            </div>
                        </div>)
                    }

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="mt-6 w-full lg:w-1/2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none"
                    >
                        Submit Vehicle Details
                    </button>
                </form>
            </div>
        </div>
    );
}
