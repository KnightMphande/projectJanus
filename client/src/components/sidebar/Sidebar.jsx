import { FaCarAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { MdAddBox } from "react-icons/md";
import { PiCarSimpleFill } from "react-icons/pi";
import { BsCartPlusFill } from "react-icons/bs";
import { IoSettings } from "react-icons/io5";
import { SiGoogleanalytics } from "react-icons/si";
import styles from "./Sidebar.module.scss";

export default function Sidebar({ open }) {
    return (
        <div className={`${ open ? styles.sidebar : "hidden"}`}>
            <div className={styles.logo}>
                <FaCarAlt className="w-5 h-5" />
                <NavLink>
                    JanusCars
                </NavLink>
            </div>

            <div className={styles.sidebarList}>
                {/* Dashboard */}
                <NavLink to="/dashboard" className={styles.sidebarItem}>
                    <MdDashboard className="w-5 h-5" />
                    Dashboard
                </NavLink>

                {/* Add a car */}
                <NavLink to="/new-vehicle" className={styles.sidebarItem}>
                    <MdAddBox className="w-5 h-5" />
                    Add Car
                </NavLink>

                {/* Fleet */}
                <NavLink className={styles.sidebarItem}>
                    <PiCarSimpleFill className="w-5 h-5" />
                    Fleet
                </NavLink>

                {/* Booking */}
                <NavLink className={styles.sidebarItem}>
                    <BsCartPlusFill className="w-5 h-5" />
                    Booking
                </NavLink>

                {/* Maintenance */}
                <NavLink className={styles.sidebarItem}>
                    <IoSettings className="w-5 h-5" />
                    Maintenance
                </NavLink>

                {/* Analytics */}
                <NavLink className={styles.sidebarItem}>
                    <SiGoogleanalytics className="w-5 h-5" />
                    Reports
                </NavLink>
            </div>
        </div>
    );
}