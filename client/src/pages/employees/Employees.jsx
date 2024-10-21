import { useEffect, useState } from "react";
import ContentHeader from "../../components/content-header/ContentHeader";
import { removeTimeFromTimestamp } from "../../utils/Helper";
import Sidebar from "../../components/sidebar/Sidebar";
import styles from "../../pages/dashboard/Dashboard.module.scss"
import AddEmployeeModal from "../../components/modals/AddEmployeeModal";
import { toast } from "react-toastify";

export default function Employees() {
    const [openSidebar, setOpenSidebar] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

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
    async function fetchEmployees() {
        const response = await fetch('/api/employees', {
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

        setEmployees(data.employees);
    }

    useEffect(() => {
        fetchEmployees();
    }, []);

    console.log(employees);

    // Handle open modal to open anew customer
    const handleOpenModal = () => setIsOpen(true);

    const handleCloseModal = () => setIsOpen(false);

    const handleAddNewEmployeeSubmit = async (formData) => {
        try {
            if(!formData.names || !formData.email || !formData.phone) {
                toast.error("Missing required fields")
                return
            }

            const response = await fetch("/api/employees", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!result.success) {
                toast.error(result.error);
                return;
            }

            toast.success(result.message);

            fetchEmployees();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={styles.dashboard}>
            <Sidebar open={openSidebar} />

            <div className={styles.dashboardContent}>
                <div>
                    <ContentHeader handleMenuClick={handleMenuClick} title="Employees" />

                    <section className="my-8 container">

                        <div className="flex justify-between items-center">
                            {/* Add vehicle button */}
                            <div className="my-6 gap-2 flex justify-start items-center">
                                <button
                                    type="button"
                                    onClick={() => handleOpenModal()}
                                    className="rounded border border-green-600 bg-green-600 px-8 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring"
                                >
                                    Create New Employee
                                </button>
                            </div>

                            <div className="flex justify-between items-center gap-x-3">
                                <h2 className="text-lg font-medium text-gray-800"></h2>

                                <span className="px-3 py-1 text-[14px] bg-slate-300 rounded-full">
                                    {employees?.length} Employees
                                </span>
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Names</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees?.length > 0 ? (
                                        employees.map((employee, index) => (
                                            <tr key={employee.employee_id}>
                                                <td>{index + 1}</td>
                                                <td>{employee.names}</td>
                                                <td>{employee.email}</td>
                                                <td>{employee.phone}</td>
                                                <td>Created {removeTimeFromTimestamp(employee.created_at)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center text-lg font-semibold">No employees found</td>
                                        </tr>
                                    )}

                                </tbody>
                            </table>
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
