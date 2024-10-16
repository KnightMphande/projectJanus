import { useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import styles from "./AuthModal.module.scss";

export default function SignupModal({ open, close, switchToSignin }) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        street: "",
        city: "",
        province: "",
        zipCode: "",
        country: "South Africa",
        licenseNumber: "",
        issueDate: "",
        expiryDate: ""
    });

    // Handle change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Convert email to lowercase
            formData.email.toLocaleLowerCase();

            const response = await fetch(`/api/auth/signup`, {
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
                return;
            }

            setFormData({
                firstName: "",
                lastName: "",
                phone: "",
                email: "",
                password: "",
                street: "",
                city: "",
                province: "",
                zipCode: "",
                country: "South Africa",
                licenseNumber: "",
                issueDate: "",
                expiryDate: ""
            })

            toast.success(data.message);
            switchToSignin();

        } catch (error) {
            console.log(error);
        }
    };

    if (!open) return null;

    const provinces = [
        "Eastern Cape",
        "Free State",
        "Gauteng",
        "KwaZulu-Natal",
        "Limpopo",
        "Mpumalanga",
        "Northern Cape",
        "North West",
        "Western Cape"
    ];

    const today = new Date().toISOString().split("T")[0]; 


    return (
        <div className="modalContainer">
            <div className="modal">
                <div className="modalHeader">
                    <h4 className="modalHeading">Signup</h4>
                    <button className="closeBtn" onClick={() => close("signup")}>
                        <MdClose size={24} className="icon" />
                    </button>
                </div>

                <div className={`${styles.modalBody} p-4 overflow-y-auto custom-scrollbar max-h-[65vh]`}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.grid}>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                onChange={handleChange}
                                value={formData.firstName}
                                className={styles.formInput}
                            />

                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                onChange={handleChange}
                                value={formData.lastName}
                                className={styles.formInput}
                            />
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                onChange={handleChange}
                                value={formData.phone}
                                className={styles.formInput}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                onChange={handleChange}
                                value={formData.email}
                                className={styles.formInput}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                                value={formData.password}
                                className={styles.formInput}
                            />

                            <input
                                type="text"
                                name="street"
                                placeholder="Street Address"
                                onChange={handleChange}
                                value={formData.street}
                                className={styles.formInput}
                            />

                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                onChange={handleChange}
                                value={formData.city}
                                className={styles.formInput}
                            />

                            <select
                                name="province"
                                className={styles.formInput}
                                value={formData.province}
                                onChange={handleChange}
                            >
                                <option value="">Select a province</option>
                                {provinces.map((province, index) => (
                                    <option key={index} value={province}>
                                        {province}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                name="zipCode"
                                placeholder="Zip Code"
                                onChange={handleChange}
                                value={formData.zipCode}
                                className={styles.formInput}
                            />

                            <input
                                type="text"
                                name="country"
                                placeholder="South Africa"
                                onChange={handleChange}
                                value={formData.country}
                                className={`${styles.formInput} disabled cursor-not-allowed`}
                            />

                            <label htmlFor="licenseNumber">
                                License Number
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    placeholder="License Number"
                                    onChange={handleChange}
                                    value={formData.licenseNumber}
                                    className={styles.formInput}
                                />
                            </label>

                            <label htmlFor="issueDate">
                                Issue Date
                                <input
                                    type="date"
                                    name="issueDate"
                                    placeholder="Issue Date"
                                    onChange={handleChange}
                                    value={formData.issueDate}
                                    className={styles.formInput}
                                    max={today} // Prevent selecting past dates
                                />
                            </label>

                            <label htmlFor="expiryDate">
                                Expiry Date
                                <input
                                    type="date"
                                    name="expiryDate"
                                    placeholder="Expiry Date"
                                    onChange={handleChange}
                                    value={formData.expiryDate}
                                    className={styles.formInput}
                                    min={formData.issueDate || today} // Prevent selecting a date before the issue date
                                />
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 bg-green-600 text-white rounded-lg shadow transition-all duration-500 hover:bg-green-700"
                        >
                            Signup
                        </button>

                    </form>
                </div>

                <div className={styles.modalFooter}>
                    <button
                        type="button"
                        className={styles.closeBtn}
                        onClick={() => close("signup")}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className={styles.switchBtn}
                        onClick={switchToSignin}
                    >
                        Already have an account?
                    </button>
                </div>
            </div>
        </div>
    );
}
