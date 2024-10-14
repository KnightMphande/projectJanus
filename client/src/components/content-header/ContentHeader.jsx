import { CgMenu } from "react-icons/cg";
import styles from "./ContentHeader.module.scss";

export default function ContentHeader({ title, handleMenuClick }) {
    return (
        <div className={styles.contentHeader}>
            <div className={styles.titleHeader}>
                <CgMenu 
                onClick={() => handleMenuClick()}
                className="w-7 h-7 cursor-pointer hover:text-slate-600" />
                <h2 className={styles.title}>{title}</h2>
            </div>

        </div>
    );
}