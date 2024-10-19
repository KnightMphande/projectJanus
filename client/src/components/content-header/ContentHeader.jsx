import { CgMenu } from "react-icons/cg";
import styles from "./ContentHeader.module.scss";
import { MdOutlineCameraswitch } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signinSuccess, signoutUserStart } from "../../redux/user/userSlice";
import { toast } from "react-toastify";

export default function ContentHeader({ title, handleMenuClick }) {
    const { currentUser } = useSelector((state) => state.user);
    const role = currentUser?.role;
    const userId = role === "admin" ? currentUser?.staff_id : currentUser?.customer_id;

    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    return (
        <div className={styles.contentHeader}>
            <div className={styles.titleHeader}>
                <CgMenu
                    onClick={() => handleMenuClick()}
                    className="w-7 h-7 cursor-pointer hover:text-slate-600" />
                <h2 className={styles.title}>{title}</h2>
            </div>

            <div className="flex items-center gap-4">
                {
                    currentUser && (
                        <NavLink
                            onClick={handleSignout}
                            className="hidden sm:flex items-center rounded-md px-2 py-2 bg-red-500 hover:bg-red-600 text-white transition">
                            <span className="text-sm font-medium">Signout</span>
                        </NavLink>
                    )
                }

                <NavLink to="/">
                    <MdOutlineCameraswitch className="h-6 w-6 text-gray-700 hover:text-gray-900 cursor-pointer" /></NavLink>
            </div>

        </div>
    );
}