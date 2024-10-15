import { CgMenu } from "react-icons/cg";
import styles from "./ContentHeader.module.scss";
import { MdOutlineCameraswitch } from "react-icons/md";
import { NavLink } from "react-router-dom";

export default function ContentHeader({ title, handleMenuClick }) {
    return (
        <div className={styles.contentHeader}>
            <div className={styles.titleHeader}>
                <CgMenu
                    onClick={() => handleMenuClick()}
                    className="w-7 h-7 cursor-pointer hover:text-slate-600" />
                <h2 className={styles.title}>{title}</h2>
            </div>

            <NavLink to="/">
            <MdOutlineCameraswitch className="h-6 w-6 text-gray-700 hover:text-gray-900 cursor-pointer" /></NavLink>

        </div>
    );
}