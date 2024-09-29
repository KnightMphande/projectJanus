import Header from "../../components/header/Header";
import styles from "./Signup.module.scss";

export default function Signup() {
    return (
        <section>
            <Header />

            <div className={styles.formContainer}>
                <form className={styles.form}>
                    <h2 className={styles.heading}>Signup</h2>
                    <div className={styles.grid}>
                        {/* First name */}
                        <div>
                            <input name="firstName"
                                type="text"
                                className={styles.input}
                                placeholder="First Name" />
                        </div>

                        {/* Last name */}
                        <div>
                            <input name="lastName"
                                type="text"
                                className={styles.input}
                                placeholder="Last Name" />
                        </div>

                        {/* Phone */}
                        <div>
                            <input name="phone"
                                type="text"
                                className={styles.input}
                                placeholder="Phone" />
                        </div>

                        {/* email */}
                        <div>
                            <input name="email"
                                type="text"
                                className={styles.input}
                                placeholder="Enter email" />
                        </div>

                        {/* Password */}
                        <div>
                            <input name="password"
                                type="password"
                                className={styles.input}
                                placeholder="Password" />
                        </div>

                        {/* Street */}
                        <div>
                            <input name="street"
                                type="text"
                                className={styles.input}
                                placeholder="street" />
                        </div>

                        {/* City */}
                        <div>
                            <input name="city"
                                type="text"
                                className={styles.input}
                                placeholder="City" />
                        </div>

                        {/* Province */}
                        <div>
                            <input name="province"
                                type="text"
                                className={styles.input}
                                placeholder="Province" />
                        </div>

                        {/* Zip code */}
                        <div>
                            <input name="zipCode"
                                type="text"
                                className={styles.input}
                                placeholder="Zip Code" />
                        </div>

                        {/* Country */}
                        <div>
                            <input name="country"
                                type="text"
                                className={styles.input}
                                placeholder="country" />
                        </div>

                        <div className="mt-4 ">
                            <button type="button" className="py-2.5 px-10 text-sm font-semibold rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none">
                                Signup
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}