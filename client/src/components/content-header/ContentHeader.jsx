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
            <div className={styles.profile}>
            <img class='w-12 h-12 rounded-full' src='https://pagedone.io/asset/uploads/1704275541.png' alt='Large avatar' />
            </div>
        </div>
    );
}