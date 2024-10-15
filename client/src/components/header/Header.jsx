import { NavLink, useNavigate } from "react-router-dom";
import { TfiMenu } from "react-icons/tfi";
import { FaUser } from "react-icons/fa";
import styles from "./Header.module.scss";
import { useState } from "react";
import SigninModal from "../modals/SigninModal";
import SignupModal from "../modals/SignupModal";
import { useDispatch, useSelector } from "react-redux";
import { signinSuccess, signoutUserStart } from "../../redux/user/userSlice";
import { toast } from "react-toastify";
import { MdNotifications } from "react-icons/md";

export default function Header() {
    // Retrieve the persisted user from local storage
    const { currentUser, error, loading } = useSelector((state) => state.user);
    // console.log(currentUser);

    const role = currentUser?.role;
    const userId = role === "admin" ? currentUser?.staff_id : currentUser?.customer_id;

    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const handleSignout = async () => {
        try {
            dispatch(signoutUserStart());

            const response = await fetch('/api/auth/signout', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if (data.success === false) {
                toast.error(data.error || "Failed to signout");
                return;
            }

            toast.success(data.message);
            navigate('/')

            dispatch(signinSuccess());
        } catch (error) {
            console.log(error);

        }
    };

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
                        {
                            (currentUser === null || currentUser === undefined) && <div className="hidden sm:flex sm:gap-2">
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
                        }

                        {
                            currentUser && (
                                <NavLink
                                    onClick={() => handleSignout()}
                                    className="hidden sm:flex items-center rounded-md px-2 py-2 bg-red-500 hover:bg-red-600 text-white transition">
                                    <span className="text-sm font-medium">Signout</span>
                                </NavLink>
                            )
                        }

                        {
                            currentUser && <div className="relative">
                                <div className="flex justify-center items-center p-[6px] bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-full">
                                    <MdNotifications className="h-7 w-7 text-gray-700" />
                                </div>
                                <span className="absolute -top-1 -right-[8px] bg-red-600 p-[3px] px-2 rounded-full text-xs text-white font-medium">2</span>
                            </div>
                        }

                        {
                            (currentUser && currentUser.role === "admin") && <NavLink
                                to="/dashboard"
                                className={styles.accountLink}>
                                <span className="text-sm font-medium">Admin</span>
                            </NavLink>
                        }

                        {
                            (currentUser && currentUser.role !== "admin") && (<>
                                <div onClick={() => navigate(`/profile/${userId}`)} className="cursor-pointer">
                                    <img className='w-10 h-10 rounded-full' src='https://pagedone.io/asset/uploads/1704275541.png' alt='Large avatar' />
                                </div>

                            </>)

                        }

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
