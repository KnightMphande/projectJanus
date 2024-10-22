import { FaCarAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { MdAddBox } from "react-icons/md";
import { PiCarSimpleFill } from "react-icons/pi";
import { BsCartPlusFill } from "react-icons/bs";
import { IoSettings } from "react-icons/io5";
import { SiGoogleanalytics } from "react-icons/si";
import styles from "./Sidebar.module.scss";
import { FaUserFriends } from "react-icons/fa";
import { useSelector } from "react-redux";
import { MdCarCrash } from "react-icons/md";

export default function Sidebar({ open }) {
    const { currentUser } = useSelector((state) => state.user);
    const role = currentUser?.role;
    const userId = role === "admin" || role === "employee" ? currentUser?.staff_id : currentUser?.customer_id;
    const logoUrl = currentUser?.logo_url;

    return (
        <div className={`${open ? styles.sidebar : "hidden"}`}>
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

                {/* Dashboard */}
                {
                    role === "admin" && (
                        <NavLink to="/employees" className={styles.sidebarItem}>
                            <FaUserFriends className="w-5 h-5" />
                            Employees
                        </NavLink>)
                }

                {/* Fleet */}
                <NavLink to="/fleet" className={styles.sidebarItem}>
                    <PiCarSimpleFill className="w-5 h-5" />
                    Fleet
                </NavLink>

                {/* Booking */}
                <NavLink to="/admin-bookings" className={styles.sidebarItem}>
                    <BsCartPlusFill className="w-5 h-5" />
                    Booking
                </NavLink>

                {
                    role === "admin" && (<NavLink to="/damages" className={styles.sidebarItem}>
                        <MdCarCrash className="w-5 h-5" />
                        Damages
                    </NavLink>)
                }

                {/* Maintenance */}
                <NavLink to="/maintenance" className={styles.sidebarItem}>
                    <IoSettings className="w-5 h-5" />
                    Maintenance
                </NavLink>

                {/* Analytics */}
                {
                    role === "admin" && (<NavLink to="/reports" className={styles.sidebarItem}>
                        <SiGoogleanalytics className="w-5 h-5" />
                        Reports
                    </NavLink>)
                }
            </div>
        </div>
    );
}