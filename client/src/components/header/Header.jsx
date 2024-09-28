import { NavLink } from "react-router-dom";
import { TfiMenu } from "react-icons/tfi";
import { FaMapMarkerAlt, FaSearch, FaUser } from "react-icons/fa";
import styles from "./Header.module.scss";

export default function Header() {
    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <div className={styles.navSubContainer}>
                    <div className={styles.logo}>
                        <NavLink className={styles.logoLink}>
                            JanusCars
                        </NavLink>
                    </div>

                    <div className="hidden xl:block">
                        <form className={styles.headerForm}>

                            <div className={styles.formInputContainer}>

                                <div className="flex items-center">
                                    {/* Pickup location */}
                                    <div className={styles.pickupLocationBox}>
                                        <FaMapMarkerAlt className="text-gray-500 mr-2" />
                                        <input
                                            type="text"
                                            placeholder="Enter pickup location"
                                            className={styles.input}
                                        />
                                    </div>

                                    {/* Pickup date */}
                                    <div className={styles.pickupDateBox}>
                                        <input
                                            type="date"
                                            className={styles.input}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    {/* Drop off location */}
                                    <div className={styles.dropoffLocationBox}>
                                        <FaMapMarkerAlt className="text-gray-500 mr-2" />
                                        <input
                                            type="text"
                                            placeholder="Enter drop off location"
                                            className={styles.input}
                                        />
                                    </div>

                                    {/* Drop off date */}
                                    <div className={styles.dropoffDateBox}>
                                        <input
                                            type="date"
                                            className={styles.input}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Search dropdown */}
                            <div className="ml-2">
                                <button type="submit" className={styles.headerSearchBtn}>
                                    <FaSearch className="w-6 h-6" />
                                </button>
                            </div>

                        </form>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="sm:flex sm:gap-4">
                            <NavLink
                                className={styles.accountLink}

                            >
                                <FaUser className="size-4 mr-2" />
                                <span className="text-sm font-medium">MY ACCOUNT</span>
                            </NavLink>

                        </div>

                        <div className="block md:hidden">
                            <button className={styles.menuBtn}>
                                <TfiMenu className="size-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}