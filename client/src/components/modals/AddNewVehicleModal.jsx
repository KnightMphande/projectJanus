import { useState } from 'react';
import { MdClose } from 'react-icons/md';

export default function AddNewVehicleModal({ handleCloseModal, handleAddNewVehicleSubmit }) {
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: '',
        category: 'default',
        status: 'default',
    });

    // Handle change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        await handleAddNewVehicleSubmit(formData); 
        handleCloseModal("new-vehicle"); // Optionally close the modal after submission
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="m-2 md:m-0 bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <div className="mb-5 flex justify-between items-center">
                    <h2 className="text-2xl text-slate-900 font-semibold">Add New Vehicle</h2>
                    {/* Close Button */}
                    <button onClick={() => handleCloseModal("new-vehicle")}>
                        <MdClose size={24} className="w-7 h-7" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <input
                            type="text"
                            name="make"
                            placeholder="Make"
                            onChange={handleChange}
                            value={formData.make}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                        />
                        <input
                            type="text"
                            name="model"
                            placeholder="Model"
                            onChange={handleChange}
                            value={formData.model}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                        />
                        <input
                            type="text"
                            name="year"
                            placeholder="Year"
                            onChange={handleChange}
                            value={formData.year}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                        />
                        <select
                            name="category"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="default">Select vehicle type</option>
                            <option value="economy">Economy</option>
                            <option value="luxury">Luxury</option>
                            <option value="suv">SUV</option>
                            <option value="sedan">Sedan</option>
                        </select>

                        <select
                            name="status"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="default">Select status</option>
                            <option value="available">Available</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="booked">Booked</option>
                        </select>

                        <button
                            type="submit"
                            className="rounded border border-green-600 bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-green-600 focus:outline-none focus:ring"
                        >
                            Add Vehicle
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
