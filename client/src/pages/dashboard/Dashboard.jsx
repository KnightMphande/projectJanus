import { useEffect, useState } from "react";
import { FaCar, FaWrench, FaClipboardList, FaMoneyBill } from "react-icons/fa";
import ContentHeader from "../../components/content-header/ContentHeader";
import Sidebar from "../../components/sidebar/Sidebar";
import styles from "./Dashboard.module.scss";
import { removeTimeFromTimestamp } from "../../utils/Helper";
import { useSelector } from "react-redux";

export default function Dashboard() {
    // Retrieve the persisted user from the local storage
    const { currentUser } = useSelector((state) => state.user);
    const role = currentUser?.role;
    const userId = role === "admin" || role === "employee" ? currentUser?.staff_id : currentUser?.customer_id;

    const [openSidebar, setOpenSidebar] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [maintenanceVehiclesTotal, setmaintenanceVehiclesTotal] = useState(0);
    const [fleetTotal, setFleetTotal] = useState(0);
    const [bookingsTotal, setBookingsTotal] = useState(0);
    const [earnings, setEarnings] = useState(0);

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

    const handleMenuClick = () => {
        setOpenSidebar(!openSidebar);
    }

    // Get data from backend
    useEffect(() => {
        async function fetchCustomers() {
            const response = await fetch('/api/reports/customers', {
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

            setCustomers(data.customers);
        }

        async function fetchCalculations() {
            try {
                const response = await fetch('/api/reports/calculations', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                const result = await response.json();
                const data = result.data;

                setmaintenanceVehiclesTotal(data.maintenance);
                setFleetTotal(data.fleet);
                setBookingsTotal(data.bookings);
                setEarnings(data.earnings);

            } catch (error) {
                toast.error("Something went worng");
                console.log(error);

            }
        }

        fetchCustomers();
        fetchCalculations();
    }, []);

    // console.log(customers);
    // console.log(maintenanceVehiclesTotal);

    return (
        <div className={styles.dashboard}>
            <Sidebar open={openSidebar} />

            <div className={styles.dashboardContent}>
                <div>
                    <ContentHeader handleMenuClick={handleMenuClick} title="Dashboard" />

                    {/* Cards Section */}
                    <div className={styles.cardsContainer}>
                        {
                            role === "admin" && (<div className={styles.card}>
                                <FaMoneyBill className={styles.icon} />
                                <h3>Total Earnings</h3>
                                <p>R{earnings}</p>
                            </div>)
                        }

                        <div className={styles.card}>
                            <FaCar className={styles.icon} />
                            <h3>Fleet Cars</h3>
                            <p>{fleetTotal}</p>
                        </div>

                        <div className={styles.card}>
                            <FaWrench className={styles.icon} />
                            <h3>Maintenance / Scheduled Cars</h3>
                            <p>{maintenanceVehiclesTotal}</p>
                        </div>

                        <div className={styles.card}>
                            <FaClipboardList className={styles.icon} />
                            <h3>Total Bookings</h3>
                            <p>{bookingsTotal}</p>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Names</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers?.length > 0 ? (
                                    customers.map((customer, index) => (
                                        <tr key={customer.customerid}>
                                            <td>{index + 1}</td>
                                            <td>{customer.names}</td>
                                            <td>{customer.email}</td>
                                            <td>{customer.phone}</td>
                                            <td>Joined {removeTimeFromTimestamp(customer.created_at)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center text-lg font-semibold">No customers found</td>
                                    </tr>
                                )}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
