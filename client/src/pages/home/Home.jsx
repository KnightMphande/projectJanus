import { FaCalendarAlt, FaCar, FaSearch } from "react-icons/fa";
import Header from "../../components/header/Header";
import CarCard from "../../components/car/CarCard";
import { useEffect, useState } from "react";
import bgHomeImgUrl from "../../assets/bgimg.jpg";

export default function Home() {
    const [locations, setLocations] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [vehicleType, setVehicleType] = useState("default");
    const [vehicleBrand, setVehicleBrand] = useState("All Brands");
    const [seats, setSeats] = useState("Any");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLocations() {
            try {
                const response = await fetch('/api/booking/locations');
                const result = await response.json();
                setLocations(result.locations);
            } catch (error) {
                console.log(error);
            }
        }

        async function fetchVehicles() {
            setLoading(true);
            try {
                const response = await fetch('/api/vehicle');
                const result = await response.json();
                setVehicles(result.vehicles);
                setFilteredVehicles(result.vehicles);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        fetchLocations();
        fetchVehicles();
    }, []);

    const handleSearch = () => {    

        let filtered = vehicles;

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(vehicle => {
                return vehicle.make.toLowerCase().includes(searchQuery.toLowerCase())
            }
                
            );
        }

        // Filter by vehicle type
        if (vehicleType !== "default") {
            filtered = filtered.filter(vehicle => vehicle.category === vehicleType);
        }

        // Filter by vehicle brand
        if (vehicleBrand !== "All Brands") {
            filtered = filtered.filter(vehicle => vehicle.make === vehicleBrand);
        }

        // Filter by number of seats
        if (seats !== "Any") {
            filtered = filtered.filter(vehicle => vehicle.seats === Number(seats));
        }

        setFilteredVehicles(filtered);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setVehicleType("default");
        setVehicleBrand("All Brands");
        setSeats("Any");
        setFilteredVehicles(vehicles);
    };

    // Trigger search whenever relevant fields change
    useEffect(() => {
        handleSearch();
    }, [vehicleType, vehicleBrand, seats]);

    return (
        <>
            <Header />
            <div className="mt-16 relative w-full h-80 bg-cover bg-center" style={{ backgroundImage: `url(${bgHomeImgUrl})` }}>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative flex flex-col items-center justify-center h-full">
                    <h1 className="text-white text-xl lg:text-4xl font-bold mb-4">Find Your Perfect Car Rental</h1>
                    <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="w-full max-w-md">
                        <div className="flex items-center px-4">
                            <input
                                type="text"
                                placeholder="Search for a vehicle..."
                                className="h-12 border border-gray-300 rounded-l-md text-gray-700 px-4 w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="h-12 bg-blue-600 text-white rounded-r-md px-4 flex items-center"
                            >
                                <FaSearch />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <section className="py-10">
                <div className="w-full max-w-[1500px] mx-auto px-4 md:px-8">
                    <div className="mt-6 md:mt-8 grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-3">
                            <div className="bg-white rounded-xl border border-gray-300 shadow-md p-6 w-full">
                                <h6 className="font-semibold text-base text-gray-800 mb-4">Filter Options</h6>

                                {/* Vehicle Type */}
                                <div className="mt-4">
                                    <label className="text-sm font-medium text-gray-700">Vehicle Type</label>
                                    <select
                                        className="mt-2 h-10 border border-gray-300 text-gray-700 text-xs font-medium rounded-md w-full px-3 py-1 bg-white"
                                        value={vehicleType}
                                        onChange={(e) => setVehicleType(e.target.value)}
                                    >
                                        <option value="default" disabled>Select vehicle type</option>
                                        <option value="economy">Economy</option>
                                        <option value="luxury">Luxury</option>
                                        <option value="suv">SUV</option>
                                        <option value="sedan">Sedan</option>
                                    </select>
                                </div>

                                {/* Vehicle Brand */}
                                <div className="mt-4">
                                    <label className="text-sm font-medium text-gray-700">Vehicle Brand</label>
                                    <select
                                        className="mt-2 h-10 border border-gray-300 text-gray-700 text-xs font-medium rounded-md w-full px-3 py-1 bg-white"
                                        value={vehicleBrand}
                                        onChange={(e) => setVehicleBrand(e.target.value)}
                                    >
                                        <option>All Brands</option>
                                        <option value="BMW">BMW</option>
                                        <option value="Honda">Honda</option>
                                        <option value="Ford">Ford</option>
                                    </select>
                                </div>

                                {/* Number of Seats */}
                                <div className="mt-4">
                                    <label className="text-sm font-medium text-gray-700">Number of Seats</label>
                                    <select
                                        className="mt-2 h-10 border border-gray-300 text-gray-700 text-xs font-medium rounded-md w-full px-3 py-1 bg-white"
                                        value={seats}
                                        onChange={(e) => setSeats(e.target.value)}
                                    >
                                        <option value="Any">Any</option>
                                        <option value="2">2</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="7">7</option>
                                    </select>
                                </div>

                                {/* Clear Filters Button */}
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs text-gray-500 hover:text-blue-500"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-9">
                            <h6 className="font-semibold text-base text-gray-800 mb-4">Available Vehicles</h6>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {loading ? (
                                    <p>Loading vehicles...</p>
                                ) : (
                                    filteredVehicles.map(vehicle => (
                                        <CarCard id={vehicle.id} vehicle={vehicle} />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
