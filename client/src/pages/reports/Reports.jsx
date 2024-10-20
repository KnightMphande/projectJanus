import { useEffect, useState } from "react";
import styles from "../dashboard/Dashboard.module.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import ContentHeader from "../../components/content-header/ContentHeader";
import { BarGraph } from "../../components/charts/BarGraph";
import { PieGraph } from "../../components/charts/PieChart";

export default function Reports() {
    const [openSidebar, setOpenSidebar] = useState(true);
    const [newFleetReports, setNewFleetReports] = useState([]);
    const [customerActivity, setCustomerActivity] = useState([]);
    const [usageStats, setUsageStats] = useState([]);

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

    // Function to fetch customer activity reports
    const fetchCustomerActivity = async () => {
        try {
            const response = await fetch('/api/reports/customer-activity', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            setCustomerActivity(data.reports);
        } catch (error) {
            console.log(error);
        }
    };

    // Function to fetch usage statistics
    const fetchUsageStats = async () => {
        try {
            const response = await fetch('/api/reports/usage-statistics', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            setUsageStats(data.stats);
        } catch (error) {
            console.log(error);
        }
    };

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

    // Fetch Fleet reports data
    useEffect(() => {
        fetchFleetReports();
        fetchCustomerActivity();
        fetchUsageStats();

    }, []);

    console.log("Fleet Reports: ", newFleetReports);
    console.log("Customer Activity: ", customerActivity);
    console.log("Usage Statistics: ", usageStats);




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
            scales: {
                y: {
                    beginAtZero: true
                }
            }
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

    const optionsPie = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Pie Chart',
          },
        },
      };
      

    const pieData = {
        labels: ['Total Rented', 'Total Cancelled', 'Overdue Returns'],
        datasets: [
            {
                label: 'Rental Status Distribution',
                data: [
                    customerActivity.reduce((acc, report) => acc + parseInt(report.total_rented), 0),
                    customerActivity.reduce((acc, report) => acc + parseInt(report.total_cancelled), 0),
                    customerActivity.reduce((acc, report) => acc + parseInt(report.overdue_returns), 0),
                ],
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 206, 86, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)'],
                borderWidth: 1,
            },
        ],
    };

      // Usage Statistics Pie Chart Data
  const optionsUsagePie = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Vehicle Usage Statistics',
      },
    },
  };

  const usageLabels = usageStats.map(stat => `${stat.make} ${stat.model}`);
  const usagePieData = {
    labels: usageLabels,
    datasets: [
      {
        label: 'Times Rented',
        data: usageStats.map(stat => parseInt(stat.times_rented)),
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 206, 86, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1,
      },
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
                        <div className="rounded-lg border border-gray-800 p-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Customer Activity Reports</h2>

                                <PieGraph optionsPie={optionsPie} data={pieData} />
                            </div>
                        </div>

                        {/* Usage Statistics */}
                        <div className="rounded-lg border border-gray-800 p-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Usage Statistics</h2>

                                <PieGraph optionsPie={optionsUsagePie} data={usagePieData} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}


