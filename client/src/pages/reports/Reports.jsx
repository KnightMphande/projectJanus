import { useEffect, useState } from "react";
import styles from "../dashboard/Dashboard.module.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import ContentHeader from "../../components/content-header/ContentHeader";
import { BarGraph } from "../../components/charts/BarGraph";

export default function Reports() {
    const [openSidebar, setOpenSidebar] = useState(true);
    const [newFleetReports, setNewFleetReports] = useState([]);

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

    // Fetch Fleet reports data
    useEffect(() => {
        async function fetchFleetReports() {
            try {
                const response = await fetch('/api/reports/fleet', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                const result = await response.json();

                const data = result.data;

                setNewFleetReports(data);
                
            } catch (error) {
                console.log(error);
                
            }
        } 

        fetchFleetReports();
        
    }, []);

    console.log(newFleetReports)

    // Bargragh fleet options
    const fleetOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Status',
          },
        },
      };

      const fleetData = {
        labels: ['Available', 'Rented', 'Under-Maintenace', 'Out-of-service'],
        datasets: [
          {
            label: '',
            data: newFleetReports,
            backgroundColor: ['#16a34a', '#059669', '#0d9488', '#0891b2']
          }
        ],
      };

    return (
        <div className={styles.dashboard}>
            <Sidebar open={openSidebar} />

            <div className={styles.dashboardContent}>
                <div>
                    <ContentHeader handleMenuClick={handleMenuClick} title="Reports" />

                    <div className="my-8 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">

                        {/* Fleet Reports */}
                        <div className="rounded-lg border border-gray-800 p-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Fleet Reports</h2>
                                <BarGraph fleetOptions={fleetOptions} fleetData={fleetData} />
                            </div>
                        </div>

                        {/* Customer Activity Reports */}
                        <div className="h-32 rounded-lg bg-gray-200 p-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Customer Activity Reports</h2>
                            </div>
                        </div>

                        {/* Usage Statistics */}
                        <div className="h-32 rounded-lg bg-gray-200 p-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Usage Statistics</h2>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}


