import { useEffect, useState } from "react";
import ContentHeader from "../../components/content-header/ContentHeader";
import { removeTimeFromTimestamp } from "../../utils/Helper";
import Sidebar from "../../components/sidebar/Sidebar";
import styles from "../../pages/dashboard/Dashboard.module.scss"
import AddEmployeeModal from "../../components/modals/AddEmployeeModal";
import { toast } from "react-toastify";
import { RiDeleteBinLine } from "react-icons/ri";
import { LiaEdit } from "react-icons/lia";

export default function Damages() {
    const [openSidebar, setOpenSidebar] = useState(true);
    const [damages, setDamages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [damage, setDamage] = useState("");
    const [price, setPrice] = useState("");

    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth <= 768;
            setOpenSidebar(!isMobile);
        };

        // Initial check on component mount
        handleResize();

        // Add event listener to handle screen resizing
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMenuClick = () => {
        setOpenSidebar(!openSidebar);
    }

    // Get data from backend
    async function fetchDamages() {
        const response = await fetch('/api/admin/damages', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (!data.success) {
            toast.error(data.error);
            return
        }

        setDamages(data.damages);
    }

    useEffect(() => {
        fetchDamages();
    }, []);

    // console.log(damages);


    const handleSubmit = async (formData) => {
        try {
            if (!damage || !price) {
                toast.error("Missing required fields")
                return
            }

            const response = await fetch("/api/admin/damages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ damage, price }),
            });

            const result = await response.json();

            if (!result.success) {
                toast.error(result.error);
                return;
            }

            toast.success(result.message);

            fetchDamages();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={styles.dashboard}>
            <Sidebar open={openSidebar} />

            <div className={styles.dashboardContent}>
                <div>
                    <ContentHeader handleMenuClick={handleMenuClick} title="Damages" />

                    <section className="my-8 container">

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
                            <div className="h-64 rounded-lg border p-4">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="damage" className="mb-2 block text-sm font-medium text-gray-700">
                                            Damage
                                        </label>
                                        <input
                                            type="text"
                                            id="damage"
                                            className="formInput"
                                            value={damage}
                                            onChange={(e) => setDamage(e.target.value)}
                                            placeholder="Enter damage name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="price" className="mb-2 block text-sm font-medium text-gray-700">
                                            Price
                                        </label>
                                        <input
                                            type="number"
                                            id="price"
                                            className="formInput"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="Enter price"
                                            min="0"
                                            step="50"
                                        />
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="min-h-64 rounded-lg border p-4">
                                {/* Table Section */}
                                <div className={styles.tableContainer}>
                                    <h2 className="mb-2 text-sm font-medium text-gray-700">Damages</h2>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Damage</th>
                                                <th>Price</th>
                                                <th>Created</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {damages?.length > 0 ? (
                                                damages.map((damage, index) => (
                                                    <tr className="py-0" key={damage.employee_id}>
                                                        <td className="text-sm">{index + 1}</td>
                                                        <td className="text-sm">{damage.name}</td>
                                                        <td className="text-sm">{damage.price}</td>
                                                        <td className="text-sm">Created {removeTimeFromTimestamp(damage.created_at)}</td>
                                                        <td className="">
                                                            <RiDeleteBinLine className="h-6 w-6 text-red-600 hover:text-red-700 cursor-pointer" />
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center text-lg font-semibold">No damages found</td>
                                                </tr>
                                            )}

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>

                    {
                        isOpen && <AddEmployeeModal
                            handleCloseModal={handleCloseModal}
                            handleAddNewEmployeeSubmit={handleAddNewEmployeeSubmit} />
                    }

                </div>
            </div>
        </div>
    );
}
