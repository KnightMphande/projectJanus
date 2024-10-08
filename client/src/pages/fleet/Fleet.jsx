import { useEffect, useState } from "react";
import styles from "../dashboard/Dashboard.module.scss";
import { toast } from "react-toastify";
import Sidebar from "../../components/sidebar/Sidebar";
import ContentHeader from "../../components/content-header/ContentHeader";
import AddNewVehicleModal from "../../components/modals/AddNewVehicleModal";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiEdit } from "react-icons/bi";
import AddVehicleDetails from "../../components/modals/AddVehicleDetails";

export default function Fleet() {
    const [openSidebar, setOpenSidebar] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const [vehicles, setVehicles] = useState([]);
    const [currentVehicle, setCurrentVehicle] = useState([]);

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

    async function fetchVehicles() {
        try {
            const response = await fetch(`/api/vehicle`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const result = await response.json();

            setVehicles(result.vehicles);

        } catch (error) {
            console.log(error);

        }
    };

    // Fetch data
    useEffect(() => {
        fetchVehicles();
    }, []);


    // Handle menu click
    const handleMenuClick = () => {
        setOpenSidebar(!openSidebar);
    };

    // Handle open modal
    const handleOpenModal = (type) => {
        setIsOpen(true);
        setModalType(type);
    };

    // Handle close modal
    const handleCloseModal = (type) => {
        setIsOpen(false);
        setModalType("");
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/vehicle/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const result = await response.json();

            if (!result.success) {
                toast.error(result.error)
                return
            }

            toast.success(result.message);

            fetchVehicles();

        } catch (error) {
            console.log(error);

        }
    }

    // Handle submit for adding new vehicle
    const handleAddNewVehicleSubmit = async (formData) => {
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
                return;
            }

            toast.success(result.message);

            fetchVehicles();
        } catch (error) {
            console.log(error);
        }
    };

    // Handle submit for vehicle details
    const handleVehicleDetailsSubmit = async (formData, carFeatures) => {

        try {
            // Create a new FormData object 
            const form = new FormData();

            // Append form fields to the FormData object
            form.append("color", formData.color);
            form.append("numberOfSeats", formData.numberOfSeats);
            form.append("mileage", formData.mileage);

            // Append the file to the FormData
            if (formData.file) {
                form.append("file", formData.file);
            }

            // Send the request using fetch for vehicle details
            const responseDetails = await fetch(`/api/vehicle/details/${currentVehicle.vehicle_id}`, {
                method: "POST",
                body: form,
            });

            const resultDetails = await responseDetails.json();

            // If the details update was not successful
            if (!resultDetails.success) {
                toast.error(resultDetails.error || "Failed to update vehicle details");
                return;
            }

            // Send the request using fetch for vehicle features
            const responseFeatures = await fetch(`/api/vehicle/features/${currentVehicle.vehicle_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(carFeatures),
            });

            const resultFeatures = await responseFeatures.json();

            // If the features update was not successful
            if (!resultFeatures.success) {
                toast.error(resultFeatures.error || "Failed to update vehicle features");
                return;
            }

            // Notify the user of success
            toast.success(resultDetails.message);
            handleCloseModal("vehicle-details");
            fetchVehicles();
        } catch (error) {
            console.error("Error during vehicle details submission:", error);
            toast.error("An unexpected error occurred. Please try again.");
        }
    };



    return (
        <div className={styles.dashboard}>
            <Sidebar open={openSidebar} />

            <div className={styles.dashboardContent}>
                <div>
                    <ContentHeader handleMenuClick={handleMenuClick} title="Fleet" />

                    {/* Add vehicle button */}
                    <div className="my-4 pt-6 gap-2 flex justify-start items-center">
                        <button
                            type="button"
                            onClick={() => handleOpenModal("new-vehicle")}
                            className="rounded border border-green-600 bg-green-600 px-8 py-2.5 text-sm font-medium text-white hover:bg-transparent hover:text-green-600 focus:outline-none focus:ring active:text-green-500"
                        >
                            Add vehicle
                        </button>
                    </div>

                    {/* List of vehicles */}
                    <section className="my-8 container">
                        <div className="flex justify-between items-center gap-x-3">
                            <h2 className="text-lg font-medium text-gray-800">All Vehicles</h2>

                            <span className="px-3 py-1 text-[14px] bg-slate-300 rounded-full">{vehicles.length} vehicles</span>
                        </div>

                        <div className="flex flex-col mt-6">
                            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                    <div className="overflow-hidden border border-gray-200  md:rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="py-3.5 px-4 text-sm font-medium text-left text-gray-500">
                                                        <div className="flex items-center gap-x-3">
                                                            Name
                                                        </div>
                                                    </th>

                                                    <th scope="col" className="px-4 py-3.5 text-sm font-medium text-left text-gray-500">

                                                        <span>Year</span>

                                                    </th>

                                                    <th scope="col" className="px-4 py-3.5 text-sm font-medium text-left text-gray-500">

                                                        <span>Type</span>

                                                    </th>

                                                    <th scope="col" className="px-12 py-3.5 text-sm font-medium text-center text-gray-500">
                                                        <button className="">
                                                            <span>Status</span>
                                                        </button>
                                                    </th>

                                                    <th scope="col" className="px-4 py-3.5 text-sm font-medium text-center text-gray-500">Add</th>

                                                    <th scope="col" className="px-4 py-3.5 text-sm font-medium text-start text-gray-500">Actions</th>

                                                    <th scope="col" className="relative py-3.5 px-4">
                                                        <span className="sr-only">Edit</span>
                                                    </th>
                                                </tr>
                                            </thead>

                                            {/* Table Body: List of the vehicles */}
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {
                                                    vehicles?.map((vehicle) => (
                                                        <tr>
                                                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                                                <div className="inline-flex items-center gap-x-3">
                                                                    <div className="flex items-center gap-x-2">
                                                                        <img className="object-cover w-10 h-10 rounded-md" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" alt="" />
                                                                        <div>
                                                                            <h2 className="font-medium text-gray-800">{vehicle.make}</h2>
                                                                            <p className="text-sm font-normal text-gray-600">{vehicle.model}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">{vehicle.year}</td>
                                                            <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">{vehicle.category}</td>
                                                            <td className="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                                                <div className="p-1 rounded-full text-center bg-emerald-100/60">
                                                                    <h2 className="text-sm font-normal text-emerald-500">{vehicle.status}</h2>
                                                                </div>
                                                            </td>

                                                            {/* Add details data */}
                                                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                                <div className="flex justify-center items-center gap-x-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            setCurrentVehicle(vehicle);
                                                                            handleOpenModal("vehicle-details")
                                                                        }}
                                                                        className="px-3 py-1 text-sm rounded-full bg-green-500 hover:bg-green-600 text-white">Add details</button>
                                                                </div>
                                                            </td>
                                                            {/* Actions data */}
                                                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                                <div className="flex items-center gap-x-6">
                                                                    <button className="text-gray-500 transition-colors duration-200 hover:text-red-500 focus:outline-none">
                                                                        <RiDeleteBin6Line onClick={() => handleDelete(vehicle.vehicle_id)} className="h-5 w-5" />
                                                                    </button>

                                                                    <button className="text-gray-500 transition-colors duration-200 hover:text-green-500 focus:outline-none">
                                                                        <BiEdit className="h-5 w-5" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between mt-6">
                            <a href="#" className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                                </svg>

                                <span>
                                    previous
                                </span>
                            </a>

                            <div className="items-center hidden lg:flex gap-x-3">
                                <a href="#" className="px-2 py-1 text-sm text-blue-500 rounded-md bg-blue-100/60">1</a>
                                <a href="#" className="px-2 py-1 text-sm text-gray-500 rounded-md hover:bg-gray-100">2</a>
                                <a href="#" className="px-2 py-1 text-sm text-gray-500 rounded-md hover:bg-gray-100">3</a>
                            </div>

                            <a href="#" className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100">
                                <span>
                                    Next
                                </span>

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                </svg>
                            </a>
                        </div>
                    </section>

                    {/* Modals */}
                    {isOpen && modalType === "new-vehicle" && (
                        <AddNewVehicleModal
                            handleCloseModal={handleCloseModal}
                            handleAddNewVehicleSubmit={handleAddNewVehicleSubmit}
                        />
                    )}

                    {isOpen && modalType === "vehicle-details" && (
                        <AddVehicleDetails
                            handleCloseModal={handleCloseModal}
                            handleVehicleDetailsSubmit={handleVehicleDetailsSubmit}
                            currentVehicle={currentVehicle}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
