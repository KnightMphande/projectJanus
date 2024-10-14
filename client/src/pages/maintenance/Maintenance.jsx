import { useEffect, useState } from "react";
import styles from "../dashboard/Dashboard.module.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import ContentHeader from "../../components/content-header/ContentHeader";
import MaintenainceCard from "../../components/maintenance/MaintenanceCard";
import AddVehicleMaintenanceModal from "../../components/modals/AddVehicleMaintenanceModal";
import { toast } from "react-toastify";

export default function Maintenance() {
    const [openSidebar, setOpenSidebar] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [maintenanceVehicles, setMaintenanceVehicles] = useState([]);

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

    // Fetch all vehicles
    async function fetchVehicles() {
        try {
            const response = await fetch('/api/vehicle', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const result = await response.json();

            const data = result.vehicles;

            setVehicles(data);
            
        } catch (error) {
            console.log(error);
            
        }
    }

    // Fetch all vehicles on maintenance or completed
    async function fetchMaintenanceVehicles() {
        try {
            const response = await fetch('/api/maintenance', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const result = await response.json();

            const data = result.maintenanceRecords;            

            setMaintenanceVehicles(data);
            
        } catch (error) {
            console.log(error);
            
        }
    }


    useEffect(() => {
        fetchVehicles();
        fetchMaintenanceVehicles();
    }, []);

    console.log("All maintenance Vehicles: ", maintenanceVehicles);
    
    const handleMenuClick = () => {
        setOpenSidebar(!openSidebar);
    }

    const handleModalOpen = () => {
        setIsOpen(true);
    }

    const handleModalClose = () => {
        setIsOpen(false);
    }

    // Handle add vehicle to maintenance
    const handleAddVehicleMaintenance = async (formData) => {
        try {
            const response = await fetch('/api/maintenance', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if(!result.success) {
                toast.error(result.error);
                return
            }

            toast.success(result.message);

            // Fetch all maintenance vehicles
            fetchMaintenanceVehicles();

            handleModalClose();
        } catch (error) {
            console.log(error);
            
        }
    }

    // Handle update maintenance
    const handleManitenanceUpdate = async (formData) => {
        try {
            const response = await fetch(`/api/maintenance/${formData.maintenance_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if(!result.success) {
                toast.error(result.error);
                return
            }

            toast.success(result.message);

            // Fetch all maintenance vehicles
            fetchMaintenanceVehicles();

            handleModalClose();
        } catch (error) {
            console.log(error);
            
        }
    }

    return (
        <div className={styles.dashboard}>
            <Sidebar open={openSidebar} />

            <div className={styles.dashboardContent}>
                <div>
                    <ContentHeader handleMenuClick={handleMenuClick} title="Maintenance" />

                    <div className="my-8 flex flex-col">
                        <div>
                            {/* Base */}

                            <button
                                onClick={() => handleModalOpen()}
                                className="mb-4 rounded border border-green-600 bg-green-600 px-8 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring"
                            >
                                Maintain vehicle
                            </button>

                        </div>

                        <div>
                            <h2 className="text-lg font-semibold mb-4">Vehicles under maintenance</h2>
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                                {
                                    maintenanceVehicles?.map((vehicle) => (
                                        <div key={vehicle.maintenance_id} className="rounded-lg">
                                    <MaintenainceCard vehicle={vehicle} handleManitenanceUpdate={handleManitenanceUpdate} />
                                </div>
                                    ))
                                }
                                
                            </div>
                        </div>
                    </div>

                    {
                        isOpen && <AddVehicleMaintenanceModal 
                                    vehicles={vehicles}
                                    handleAddVehicleMaintenance={handleAddVehicleMaintenance}
                                    close={handleModalClose} />
                    }

                </div>
            </div>
        </div>
    );
}
