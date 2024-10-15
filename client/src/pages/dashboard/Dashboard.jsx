import { useEffect, useState } from "react";
import { FaCar, FaWrench, FaClipboardList, FaMoneyBill } from "react-icons/fa";
import ContentHeader from "../../components/content-header/ContentHeader";
import Sidebar from "../../components/sidebar/Sidebar";
import styles from "./Dashboard.module.scss";
import { removeTimeFromTimestamp } from "../../utils/Helper";

export default function Dashboard() {
    const [openSidebar, setOpenSidebar] = useState(true);
    const [customers, setCustomers] = useState([]);

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

        fetchCustomers();
    }, []);

    console.log(customers);


    return (
        <div className={styles.dashboard}>
            <Sidebar open={openSidebar} />

            <div className={styles.dashboardContent}>
                <div>
                    <ContentHeader handleMenuClick={handleMenuClick} title="Dashboard" />

                    {/* Cards Section */}
                    <div className={styles.cardsContainer}>
                        <div className={styles.card}>
                            <FaMoneyBill className={styles.icon} />
                            <h3>Total Earnings</h3>
                            <p>R250,000</p>
                        </div>

                        <div className={styles.card}>
                            <FaCar className={styles.icon} />
                            <h3>Fleet Cars</h3>
                            <p>45</p>
                        </div>

                        <div className={styles.card}>
                            <FaWrench className={styles.icon} />
                            <h3>Maintenance Cars</h3>
                            <p>5</p>
                        </div>

                        <div className={styles.card}>
                            <FaClipboardList className={styles.icon} />
                            <h3>Total Bookings</h3>
                            <p>120</p>
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
                                {
                                    customers?.map((customer, index) => (
                                        <tr key={customer.customerid}>
                                            <td>{index + 1}</td>
                                            <td>{customer.names}</td>
                                            <td>{customer.email}</td>
                                            <td>{customer.phone}</td>
                                            <td>Joined {removeTimeFromTimestamp(customer.created_at)}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
