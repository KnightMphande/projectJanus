import { useState } from "react";
import Header from "../../components/header/Header";
import styles from "./Signup.module.scss";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Signup() {
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
        country: ""
      });

      const navigate = useNavigate();

    // Handle change
    const handleChange = (e) => {
        const { name, value } = e.target;
    
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }
    
    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/auth/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log(data);

            if(!data.success) {
                toast.error(data.error);  
                return;
            }

            toast.success(data.message);
            navigate('/');
            
        } catch (error) {
            console.log(error);
            
        }
    }

    return (
        <section>
            <Header />

            <div className={styles.formContainer}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h2 className={styles.heading}>Signup</h2>
                    <div className={styles.grid}>
                        {/* First name */}
                        <div>
                            <input name="firstName"
                                type="text"
                                className={styles.input}
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                />
                        </div>

                        {/* Last name */}
                        <div>
                            <input name="lastName"
                                type="text"
                                className={styles.input}
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                />
                        </div>

                        {/* Phone */}
                        <div>
                            <input name="phone"
                                type="text"
                                className={styles.input}
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={handleChange}
                                />
                        </div>

                        {/* email */}
                        <div>
                            <input name="email"
                                type="text"
                                className={styles.input}
                                placeholder="Enter email"
                                value={formData.email} 
                                onChange={handleChange}
                                />
                        </div>

                        {/* Password */}
                        <div>
                            <input name="password"
                                type="password"
                                className={styles.input}
                                placeholder="Password" 
                                value={formData.password}
                                onChange={handleChange}
                                />
                        </div>

                        {/* Street */}
                        <div>
                            <input name="street"
                                type="text"
                                className={styles.input}
                                placeholder="street" 
                                value={formData.street}
                                onChange={handleChange}
                                />
                        </div>

                        {/* City */}
                        <div>
                            <input name="city"
                                type="text"
                                className={styles.input}
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                                />
                        </div>

                        {/* Province */}
                        <div>
                            <input name="province"
                                type="text"
                                className={styles.input}
                                placeholder="Province" 
                                value={formData.province}
                                onChange={handleChange}
                                />
                        </div>

                        {/* Zip code */}
                        <div>
                            <input name="zipCode"
                                type="text"
                                className={styles.input}
                                placeholder="Zip Code" 
                                value={formData.zipCode}
                                onChange={handleChange}
                                />
                        </div>

                        {/* Country */}
                        <div>
                            <input name="country"
                                type="text"
                                className={styles.input}
                                placeholder="Country" 
                                value={formData.country}
                                onChange={handleChange}
                                />
                        </div>

                        <div className="mt-4 ">
                            <button type="submit" className="py-2.5 px-10 text-sm font-semibold rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none">
                                Signup
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}