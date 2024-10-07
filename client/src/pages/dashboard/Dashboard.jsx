import { useState } from "react";
import ContentHeader from "../../components/content-header/ContentHeader";
import Sidebar from "../../components/sidebar/Sidebar";
import styles from "./Dashboard.module.scss";

export default function Dashboard() {
    const [openSidebar, setOpenSidebar] = useState(true);

    const handleMenuClick = () => {
        setOpenSidebar(!openSidebar);
    }

    return (
        <div className={styles.dashboard}>
            <Sidebar open={openSidebar} />

            <div className={styles.dashboardContent}>
                <div>
                    <ContentHeader handleMenuClick={handleMenuClick} title="Dashboard" />
                </div>
            </div>
        </div>
    );
}