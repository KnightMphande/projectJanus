import { NavLink } from "react-router-dom";
import { TfiMenu } from "react-icons/tfi";
import { FaUser } from "react-icons/fa";
import styles from "./Header.module.scss";
import { useState } from "react";
import SigninModal from "../modals/SigninModal";
import SignupModal from "../modals/SignupModal";

export default function Header() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");

    const handleModalOpen = (type) => {
        if (type === "signin") {
            setIsModalOpen(true);
            setModalType(type);
        }
        else if (type === "signup") {
            setIsModalOpen(true);
            setModalType(type);
        };
    }

    const handleModalClose = (type) => {
        if (type === "signin") {
            setIsModalOpen(false);
            setModalType("");
        }
        else if (type === "signup") {
            setIsModalOpen(false);
            setModalType("");
        }
    }

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <div className={styles.navSubContainer}>
                    <div className={styles.logo}>
                        <NavLink to="/" className={styles.logoLink}>
                            JanusCars
                        </NavLink>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex sm:gap-4">
                            <NavLink
                                className={styles.accountLink}
                                onClick={() => handleModalOpen("signup")}
                            >
                                <FaUser className="size-4 mr-2" />
                                <span className="text-sm font-medium">Signup</span>
                            </NavLink>

                            <NavLink
                                className={styles.accountLink}
                                onClick={() => handleModalOpen("signin")}
                            >
                                <FaUser className="size-4 mr-2" />
                                <span className="text-sm font-medium">Signin</span>
                            </NavLink>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="block md:hidden">
                            <button className={styles.menuBtn}>
                                <TfiMenu className="size-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {
                (isModalOpen && modalType === "signin") && (<SigninModal open={isModalOpen} close={handleModalClose} switchToSignup={() => handleModalOpen("signup")} />)
            }

            {
                (isModalOpen && modalType === "signup") && (<SignupModal open={isModalOpen} close={handleModalClose} switchToSignin={() => handleModalOpen("signin")} />)
            }

        </header>
    );
}
