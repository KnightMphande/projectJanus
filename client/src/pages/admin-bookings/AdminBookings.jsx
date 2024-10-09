import { useEffect, useState } from "react";
import styles from "../dashboard/Dashboard.module.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import ContentHeader from "../../components/content-header/ContentHeader";
import { removeTimeFromTimestamp } from "../../utils/Helper";
import BookingModal from "../../components/modals/BookingModal";
import { toast } from "react-toastify";

export default function AdminBookings() {
    const [openSidebar, setOpenSidebar] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookings, setBookings] = useState([]);

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

    async function fetchBookings() {
        try {
            const response = await fetch(`/api/booking`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const result = await response.json();

            setBookings(result.bookings);

        } catch (error) {
            console.log(error);

        }
    };

    // Fetch data
    useEffect(() => {
        fetchBookings();
    }, []);


    // Handle menu click
    const handleMenuClick = () => {
        setOpenSidebar(!openSidebar);
    };

    // Open modal and set the selected booking
    const openModal = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    // Close modal and clear selected booking
    const closeModal = () => {
        setSelectedBooking(null);
        setIsModalOpen(false);
    };

    // Handle booking update logic
    const handleBookingUpdate = async (booking, newStatus) => {
        try {
            const updatedBooking = { ...booking, status: newStatus };

            const response = await fetch(`/api/booking/${booking.booking_id}/update?status=${newStatus}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedBooking),
            });

            const result = await response.json();

            if (result.success) {
                toast.success(result.message);
                fetchBookings();
            } else {
                toast.error('Failed to update booking status.');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while updating booking status.');
        }
    };



    return (
        <div className={styles.dashboard}>
            <Sidebar open={openSidebar} />

            <div className={styles.dashboardContent}>
                <div>
                    <ContentHeader handleMenuClick={handleMenuClick} title="Bookings" />
                </div>
                <section className="my-8 container">
                    <div className="flex justify-between items-center gap-x-3">
                        <h2 className="text-lg font-medium text-gray-800">Bookings</h2>

                        <span className="px-3 py-1 text-[14px] bg-slate-300 rounded-full">{bookings?.length} Bookings</span>
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

                                                <th scope="col" className="px-12 py-3.5 text-sm font-medium text-center text-gray-500">
                                                    <button className="">
                                                        <span>Status</span>
                                                    </button>
                                                </th>

                                                <th scope="col" className="px-4 py-3.5 text-sm font-medium text-center text-gray-500">CheckIn</th>
                                                <th scope="col" className="px-4 py-3.5 text-sm font-medium text-center text-gray-500">CheckOut</th>
                                                <th scope="col" className="px-4 py-3.5 text-sm font-medium text-center text-gray-500">PickUp</th>
                                                <th scope="col" className="px-4 py-3.5 text-sm font-medium text-center text-gray-500">DropOff</th>

                                                <th scope="col" className="px-4 py-3.5 text-sm font-medium text-start text-gray-500">Processing</th>

                                                <th scope="col" className="relative py-3.5 px-4">
                                                    <span className="sr-only">Edit</span>
                                                </th>
                                            </tr>
                                        </thead>

                                        {/* Table Body: List of the vehicles */}
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {
                                                bookings?.map((booking) => (
                                                    <tr>
                                                        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                                            <div className="inline-flex items-center gap-x-3">
                                                                <div className="flex items-center gap-x-2">
                                                                    <img className="object-cover w-10 h-10 rounded-md" src={`http://localhost:5000/image/${booking.vehicle_id}/${booking.filename}`} alt="" />
                                                                    <div>
                                                                        <h2 className="font-medium text-gray-800">{booking.make}</h2>
                                                                        <p className="text-sm font-normal text-gray-600">{booking.model}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                                            <div className="p-1 rounded-full text-center bg-emerald-100/60">
                                                                <h2 className="text-sm font-normal text-emerald-500">{booking.status}</h2>
                                                            </div>
                                                        </td>

                                                        {/* CheckIn */}
                                                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center">{removeTimeFromTimestamp(booking.check_in)}</td>

                                                        {/* CheckOut */}
                                                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center">{removeTimeFromTimestamp(booking.check_out)}</td>

                                                        {/* Pickup */}
                                                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center">{booking.pick_up_location}</td>

                                                        {/* Dropoff */}
                                                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center">{booking.drop_off_location}</td>

                                                        {/* Update Status */}
                                                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                            <button
                                                                className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                                                                onClick={() => openModal(booking)}
                                                            >
                                                                Edit
                                                            </button>
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

                <BookingModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    booking={selectedBooking}
                    onUpdate={handleBookingUpdate}
                />
            </div>

        </div>
    );
}