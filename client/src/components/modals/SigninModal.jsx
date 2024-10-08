import styles from "./AuthModal.module.scss"
import { useState } from "react";
import { MdClose } from "react-icons/md";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { signinFailure, signinStart, signinSuccess } from "../../redux/user/userSlice";

export default function SigninModal({ open, close, switchToSignup }) {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [role, setRole] = useState("");

    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const updateUserType = (role) => {
       setRole(role);
    }

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if(role === "") {
                toast.error("Select user type");
                return
            }

            // Convert email to lowercase
            formData.email.toLocaleLowerCase();

            // Start signin transaction
            dispatch(signinStart());

            const response = await fetch(`/api/auth/signin/${role}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log(data);

            if (!data.success) {
                toast.error(data.error);
                dispatch(signinFailure(data.error));
                return;
            }

            setFormData({
                email: "",
                password: "",
            })

            toast.success(data.message);
            dispatch(signinSuccess(data.user));
            close("signin");

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="w-full relative">
            <div className={styles.modalContainer}>
                {/* Modal Content */}
                <div className={styles.modal}>
                    {/* Modal Header */}
                    <div className={styles.modalHeader}>
                        <h4 className={styles.modalHeading}>Sign In</h4>
                        {/* Close Button */}
                        <button
                            className={styles.closeBtn}
                            onClick={() => close("signin")}
                        >
                            <MdClose size={24} className={styles.icon}/>
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className={styles.modalBody}>

                        <div className="flex justify-start items-center mb-4">
                            {/* Base */}

                            <button
                                onClick={() => updateUserType("customer")}
                                className={`${role === "customer" ? "bg-green-600 text-white" : "text-green-600"} rounded-lg border 
                                border-green-600 px-10 sm:px-12 py-2.5 text-sm font-medium hover:bg-green-600 
                                hover:text-white focus:outline-none mr-2 sm:mr-4`}

                            >
                                Customer
                            </button>

                            {/* Border */}

                            <button
                                onClick={() => updateUserType("admin")}
                                className={`${role === "admin" ? "bg-green-600 text-white" : "text-green-600"} rounded-lg border 
                                border-green-600 px-10 sm:px-12 py-2.5 text-sm font-medium hover:bg-green-600 
                                hover:text-white focus:outline-none`}

                            >
                                Admin
                            </button>
                        </div>

                        {/* Sign In Form */}
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                onChange={handleChange}
                                value={formData.email}
                                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                                value={formData.password}
                                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                            />
                            <button
                                type="submit"
                                className="w-full py-2 bg-green-600 text-white rounded-lg shadow transition-all duration-500 hover:bg-green-700"
                            >
                                Sign In
                            </button>
                        </form>
                    </div>

                    {/* Modal Footer */}
                    <div className={styles.modalFooter}>
                        <button
                            type="button"
                            className={styles.closeBtn}
                            onClick={() => close("signin")}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className={styles.switchBtn}
                            onClick={switchToSignup}
                        >
                            Don't have an account?
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}