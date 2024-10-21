import { useState } from 'react';
import { MdClose } from 'react-icons/md';

export default function AddEmployeeModal({ handleCloseModal, handleAddNewEmployeeSubmit }) {
    const [formData, setFormData] = useState({
        names: '',
        phone: '',
        email: ''
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
        e.preventDefault();
        await handleAddNewEmployeeSubmit(formData);
        handleCloseModal();
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="m-2 md:m-0 bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <div className="mb-5 flex justify-between items-center">
                    <h2 className="text-2xl text-slate-900 font-semibold">Add New Customer</h2>
                    {/* Close Button */}
                    <button onClick={() => handleCloseModal()}>
                        <MdClose size={24} className="w-7 h-7" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <input
                            type="text"
                            name="names"
                            placeholder="First and Last Name"
                            onChange={handleChange}
                            value={formData.names}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                        />

                        <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            value={formData.email}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                        />

                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            onChange={handleChange}
                            value={formData.phone}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                        />

                        <button
                            type="submit"
                            className="rounded border border-green-600 bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-green-600 focus:outline-none focus:ring"
                        >
                            Add New Employee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
