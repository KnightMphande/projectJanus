import { NavLink, useNavigate } from "react-router-dom";
import { TfiMenu } from "react-icons/tfi";
import { FaUser } from "react-icons/fa";
import styles from "./Header.module.scss";
import { useState, useEffect, useRef } from "react";
import SigninModal from "../modals/SigninModal";
import SignupModal from "../modals/SignupModal";
import { useDispatch, useSelector } from "react-redux";
import { signinSuccess, signoutUserStart } from "../../redux/user/userSlice";
import { toast } from "react-toastify";
import { MdNotifications } from "react-icons/md";
import NotificationDropdown from "../notification/NotificationDropdown";


export default function Header() {
    const { currentUser } = useSelector((state) => state.user);
    const role = currentUser?.role;
    const userId = role === "admin" ? currentUser?.staff_id : currentUser?.customer_id;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const [showNotificationDropdown, setNotificationDropdown] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const loadNotifications = async () => {
        try {
            const response = await fetch(`/api/notifications/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            console.log(data);
            
            setNotifications(data?.notifications);
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch notifications when the component mounts
    useEffect(() => {
        loadNotifications();
    }, [userId]);

    // Function to mark a notification as read
    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(`/api/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Update the local state to mark the notification as read
                setNotifications((prevNotifications) =>
                    prevNotifications.map((notification) =>
                        notification.id === notificationId
                            ? { ...notification, is_read: true }
                            : notification
                    )
                );

                loadNotifications();
            } else {
                console.error('Failed to mark notification as read');
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleModalOpen = (type) => {
        setIsModalOpen(true);
        setModalType(type);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalType("");
    };

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
            navigate('/');
            dispatch(signinSuccess());
        } catch (error) {
            console.log(error);
        }
    };

    const handleNotificationClick = () => {
        setNotificationDropdown(!showNotificationDropdown);
    };

    const closeNotification = () => {
        setNotificationDropdown(!showNotificationDropdown);
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
                        {
                            !currentUser && (
                                <div className="hidden sm:flex sm:gap-2">
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
                            )
                        }

                        {
                            currentUser && (
                                <NavLink
                                    onClick={handleSignout}
                                    className="hidden sm:flex items-center rounded-md px-2 py-2 bg-red-500 hover:bg-red-600 text-white transition">
                                    <span className="text-sm font-medium">Signout</span>
                                </NavLink>
                            )
                        }

                        {
                            currentUser && (
                                <div className="relative" onClick={handleNotificationClick}>
                                    <div className="flex justify-center items-center p-[6px] bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-full">
                                        <MdNotifications className="h-7 w-7 text-gray-700" />
                                    </div>
                                    {
                                        (notifications?.length > 0) && (<span className="absolute -top-1 -right-[8px] bg-red-600 p-[3px] px-2 rounded-full text-xs text-white font-medium">{notifications?.length}</span>)
                                    }
                                </div>
                            )
                        }

                        {
                            currentUser && currentUser.role === "admin" && (
                                <NavLink to="/dashboard" className={styles.accountLink}>
                                    <span className="text-sm font-medium">Admin</span>
                                </NavLink>
                            )
                        }

                        {
                            currentUser && currentUser.role !== "admin" && (
                                <div onClick={() => navigate(`/profile/${userId}`)} className="cursor-pointer">
                                    <img className='w-10 h-10 rounded-full' src='https://pagedone.io/asset/uploads/1704275541.png' alt='Large avatar' />
                                </div>
                            )
                        }

                        {/* Mobile Menu Button */}
                        <div className="block md:hidden">
                            <button className={styles.menuBtn}>
                                <TfiMenu className="size-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notification dropdown */}
                {showNotificationDropdown && (
                    <div>
                        <NotificationDropdown closeNotification={closeNotification} notifications={notifications} markAsRead={markAsRead} />
                    </div>
                )}
            </nav>

            {isModalOpen && modalType === "signin" && (
                <SigninModal open={isModalOpen} close={handleModalClose} switchToSignup={() => handleModalOpen("signup")} />
            )}

            {isModalOpen && modalType === "signup" && (
                <SignupModal open={isModalOpen} close={handleModalClose} switchToSignin={() => handleModalOpen("signin")} />
            )}
        </header>
    );
}
