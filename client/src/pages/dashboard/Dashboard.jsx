import { useEffect, useState } from "react";
import { FaCar, FaWrench, FaClipboardList, FaMoneyBill } from "react-icons/fa";
import ContentHeader from "../../components/content-header/ContentHeader";
import Sidebar from "../../components/sidebar/Sidebar";
import styles from "./Dashboard.module.scss";

export default function Dashboard() {
    const [openSidebar, setOpenSidebar] = useState(true);

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
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>John Doe</td>
                                    <td>john@example.com</td>
                                    <td>+123456789</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Jane Doe</td>
                                    <td>jane@example.com</td>
                                    <td>+987654321</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>Gary Barlow</td>
                                    <td>gary@example.com</td>
                                    <td>+123456123</td>
                                </tr>
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
