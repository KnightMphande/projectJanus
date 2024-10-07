import { useEffect, useState } from "react";
import ContentHeader from "../../components/content-header/ContentHeader";
import Sidebar from "../../components/sidebar/Sidebar";
import styles from "../dashboard/Dashboard.module.scss";
import { toast } from "react-toastify";

export default function AddCar() {
    const [openSidebar, setOpenSidebar] = useState(true);
    const [formData, setFormData] = useState({
        make: "",
        model: "",
        year: "",
        category: ""
    });
    const [vehicleId, setVehicleId] = useState(null);

    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth <= 768;
            setOpenSidebar(!isMobile);
        };

        // Initial check on component mount
        handleResize();

        // Add event listener to handle screen resizing
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle menu click
    const handleMenuClick = () => {
        setOpenSidebar(!openSidebar);
    }

    // Hnadle Form change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/vehicle', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!result.success) {
                toast.error(result.error);
                return
            }

            setVehicleId(result.vehicleId);
            toast.success(result.message);

            setFormData({
                make: "",
                model: "",
                year: "",
                category: ""
            });


        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={styles.dashboard}>
            <Sidebar open={openSidebar} />

            <div className={styles.dashboardContent}>
                <div>
                    <ContentHeader handleMenuClick={handleMenuClick} title="Add vehicle" />

                    <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
                        <div className="h-32 rounded-lg lg:col-span-2">
                            {/* Add car form */}
                            <form onSubmit={handleSubmit}>
                                <h2 className="text-2xl text-slate-900 font-semibold">Add new vehicle</h2>

                                <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                                    <input
                                        type="text"
                                        name="make"
                                        placeholder="Make"
                                        onChange={handleChange}
                                        value={formData.make}
                                        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                                    />
                                    <input
                                        type="text"
                                        name="model"
                                        placeholder="Model"
                                        onChange={handleChange}
                                        value={formData.model}
                                        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                                    />
                                    <input
                                        type="text"
                                        name="year"
                                        placeholder="Year"
                                        onChange={handleChange}
                                        value={formData.year}
                                        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                                    />
                                    <select
                                        name="category"
                                        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        <option value="default" disabled>
                                            Select vehicle type
                                        </option>
                                        <option value="economy">Economy</option>
                                        <option value="luxury">Luxury</option>
                                        <option value="suv">SUV</option>
                                        <option value="sedan">Sedan</option>
                                    </select>

                                    <button type="submit"
                                        className="rounded border border-green-600 bg-green-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-green-600 focus:outline-none focus:ring active:text-green-500"

                                    >
                                        Add vehivle
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>)

}