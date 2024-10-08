import { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { MdClose, MdDelete } from "react-icons/md";

export default function AddVehicleDetails({ handleCloseModal, handleVehicleDetailsSubmit, currentVehicle }) {
    const [formData, setFormData] = useState({
        color: '',
        numberOfSeats: '',
        mileage: '',
        file: null,
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [carFeatures, setCarFeatures] = useState({
        hasGPS: false,
        hasChildSeats: false,
        hasParkingSensors: false,
        hasAirConditioning: false,
        hasBluetooth: false,
    });

    const features = [
        { key: 'hasGPS', label: 'Has GPS' },
        { key: 'hasChildSeats', label: 'Child Seats' },
        { key: 'hasParkingSensors', label: 'Parking Sensors' },
        { key: 'hasAirConditioning', label: 'Air Conditioning' },
        { key: 'hasBluetooth', label: 'Bluetooth' },
    ];

    const toggleFeature = (key) => {
        setCarFeatures((prevFeatures) => ({
            ...prevFeatures,
            [key]: !prevFeatures[key],
        }));
    };

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

    // Handle submit
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        
        handleVehicleDetailsSubmit(formData, carFeatures)
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg m-2 lg:m-0 lg:max-h-[90vh]">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl text-slate-900 font-semibold">Add Vehicle Details</h2>
                        <button onClick={() => handleCloseModal("vehicle-details")}>
                            <MdClose size={24} className="w-7 h-7" />
                        </button>
                    </div>

                    <div className="mt-2 flex justify-start items-center gap-2">
                        <p className="font-medium text-gray-600">{currentVehicle.make}</p>
                        <p className="flex justify-start items-center font-medium text-gray-600 gap-2">
                            <span>{currentVehicle.model}</span>
                            <span>{currentVehicle.year}</span>
                        </p>
                    </div>
                </div>

                {/* Modal Body with Scroll */}
                <div className="p-6 overflow-y-auto custom-scrollbar max-h-[50vh]">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-4">
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
                                    <option value="black">Black</option>
                                    <option value="blue">Blue</option>
                                    <option value="red">Red</option>
                                    <option value="green">Green</option>
                                    <option value="yellow">Yellow</option>
                                    <option value="orange">Orange</option>
                                    <option value="purple">Purple</option>
                                    <option value="pink">Pink</option>
                                    <option value="brown">Brown</option>
                                    <option value="cyan">Cyan</option>
                                    <option value="lime">Lime</option>
                                    <option value="teal">Teal</option>
                                    <option value="navy">Navy</option>
                                    <option value="maroon">Maroon</option>
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

                            {/* Features Section */}
                            <div className="mb-6 w-full lg:w-1/2">
                                <p className="my-1 text-base">Select features</p>
                                {features.map(({ key, label }) => (
                                    <div
                                        key={key}
                                        onClick={() => toggleFeature(key)}
                                        className={`my-1 p-2 border rounded cursor-pointer hover:bg-green-500 hover:text-white transition-all ${carFeatures[key] ? 'bg-green-500 text-white' : 'bg-gray-200'
                                            }`}
                                    >
                                        {label}
                                    </div>
                                ))}
                            </div>

                            {/* File Upload Section */}
                            {previewUrl ? (
                                <div>
                                    <div className="mt-6 w-full relative h-auto p-1 border border-gray-200 rounded-md max-w-sm">
                                        <img src={previewUrl} alt="Image" className="rounded-md max-w-full h-auto" />
                                    </div>
                                    <div className="mt-2 flex justify-start items-center cursor-pointer" onClick={() => clearImagePreview()}>
                                        <MdDelete className="text-red-600 w-7 h-7" />
                                        <p className="text-base font-semibold">Remove Image</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full py-9 bg-gray-50 rounded-2xl border border-gray-300 gap-3 grid border-dashed">
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
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="mt-6 w-full lg:w-1/2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none"
                            >
                                Submit Vehicle Details
                            </button>
                        </div>
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t flex justify-end">
                    <button
                        className="text-green-500 hover:text-green-600 font-semibold"
                        onClick={() => handleCloseModal("vehicle-details")}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>

    );
}