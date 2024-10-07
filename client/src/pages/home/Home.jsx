import { FaMapMarkerAlt, FaCalendarAlt, FaCar, FaSearch } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import Header from "../../components/header/Header";
import CarCard from "../../components/car/CarCard";
import { useEffect, useState } from "react";

export default function Home() {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        async function fetchLocations() {
            try {
                const response = await fetch('/api/booking/locations', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                const result = await response.json();

                const data = result.locations;

                setLocations(data);
                
            } catch (error) {
                console.log(error);
                
            }
        } 

        fetchLocations();
    }, []);

    
    return (
        <>
            <Header />

            {/* Car Rental Search Section */}
            <section className="py-10">
                <div className="w-full max-w-[1500px] mx-auto px-4 md:px-8">
                    <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
                        {/* Search Form */}
                        <form className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full">
                            {/* Pickup Location */}
                            <div className="flex items-center border border-gray-300 rounded-md p-2 w-full lg:max-w-xs">
                                <FaMapMarkerAlt className="text-gray-500 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Pickup location"
                                    className="border-none outline-none text-sm py-1 w-full"
                                />
                            </div>

                            {/* Pickup Date */}
                            <div className="flex items-center border border-gray-300 rounded-md p-2 w-full lg:max-w-xs">
                                <FaCalendarAlt className="text-gray-500 mr-2" />
                                <input
                                    type="date"
                                    className="border-none outline-none text-sm py-1 w-full"
                                    placeholder="Pickup date"
                                />
                            </div>

                            {/* Drop off Location */}
                            <div className="flex items-center border border-gray-300 rounded-md p-2 w-full lg:max-w-xs">
                                <FaMapMarkerAlt className="text-gray-500 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Drop off location"
                                    className="border-none outline-none text-sm py-1 w-full"
                                />
                            </div>

                            {/* Drop off Date */}
                            <div className="flex items-center border border-gray-300 rounded-md p-2 w-full lg:max-w-xs">
                                <FaCalendarAlt className="text-gray-500 mr-2" />
                                <input
                                    type="date"
                                    className="border-none outline-none text-sm py-1 w-full"
                                    placeholder="Drop off date"
                                />
                            </div>

                            {/* Vehicle Type */}
                            <div className="relative w-full lg:max-w-xs">
                                <div className="flex items-center border border-gray-300 rounded-md p-2">
                                    <FaCar className="text-gray-500 " />
                                    <select
                                        className="border-none outline-none text-sm py-1 w-full appearance-none bg-white px-4"
                                        defaultValue="default"
                                    >
                                        <option value="default" disabled>
                                            Select vehicle type
                                        </option>
                                        <option value="economy">Economy</option>
                                        <option value="luxury">Luxury</option>
                                        <option value="suv">SUV</option>
                                        <option value="sedan">Sedan</option>
                                    </select>
                                </div>
                            </div>

                            {/* Search Button */}
                            <button
                                type="submit"
                                className="flex items-center justify-center px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition duration-300 ease-in-out"
                            >
                                <FaSearch className="w-6 h-6 mr-2" />
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Show features */}
                    <div className="showFeatures block md:hidden">
                        <button className="border-2 p-2 w-full bg-green-500 hover:bg-green-600 mt-4 rounded-lg text-white" type="button">Apply Features</button>
                    </div>

                    {/* Filters Section */}
                    <div className="hidden md:block">
                        <div className="mt-6 md:mt-8 grid grid-cols-12 gap-4">
                            <div className="col-span-12 md:col-span-3">
                                {/* Filters Card */}
                                <div className="bg-white rounded-xl border border-gray-300 shadow-md p-6 w-full">
                                    <h6 className="font-semibold text-base text-gray-800 mb-4">Filter Options</h6>
                                    <div className="flex flex-col gap-4">
                                        {/* Price Range */}
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Price Range</label>
                                            <div className="flex items-center mt-2">
                                                <div className="relative w-full">
                                                    <select
                                                        className="h-10 border border-gray-300 text-gray-700 text-xs font-medium rounded-md w-full px-3 py-1 appearance-none bg-white"
                                                    >
                                                        <option>Min</option>
                                                        <option value="500">R500</option>
                                                        <option value="800">R800</option>
                                                        <option value="1000">R1000</option>
                                                        <option value="1500">R1500</option>
                                                        <option value="2000">R2000</option>
                                                        <option value="3000">R3000</option>
                                                    </select>
                                                </div>
                                                <span className="mx-2 text-sm font-medium text-gray-600">to</span>
                                                <div className="relative w-full">
                                                    <select
                                                        className="h-10 border border-gray-300 text-gray-700 text-xs font-medium rounded-md w-full px-3 py-1 appearance-none bg-white"
                                                    >
                                                        <option>Max</option>
                                                        <option value="1000">R1000</option>
                                                        <option value="1500">R1500</option>
                                                        <option value="2000">R2000</option>
                                                        <option value="3000">R3000</option>
                                                        <option value="5000">R5000</option>
                                                        <option value="10000">R10000</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Vehicle Brand */}
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Vehicle Brand</label>
                                            <select className="mt-2 h-10 border border-gray-300 text-gray-700 text-xs font-medium rounded-md w-full px-3 py-1 bg-white">
                                                <option>All Brands</option>
                                                <option value="toyota">Toyota</option>
                                                <option value="bmw">BMW</option>
                                                <option value="mercedes">Mercedes</option>
                                                <option value="audi">Audi</option>
                                                <option value="ford">Ford</option>
                                            </select>
                                        </div>

                                        {/* Number of Seats */}
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Seats</label>
                                            <select className="mt-2 h-10 border border-gray-300 text-gray-700 text-xs font-medium rounded-md w-full px-3 py-1 bg-white">
                                                <option>Any</option>
                                                <option value="2">2</option>
                                                <option value="4">4</option>
                                                <option value="6">6</option>
                                                <option value="8">8</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Content Section */}
                            <div className="col-span-12 md:col-span-9">
                                {/* Image Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <CarCard url="https://cdn.pixabay.com/photo/2017/11/12/09/58/renault-2942017_960_720.jpg" />    
                                    <CarCard url="https://cdn.pixabay.com/photo/2016/11/18/15/11/car-1835246_1280.jpg" />  
                                    <CarCard url="https://cdn.pixabay.com/photo/2023/03/05/06/55/car-7830737_640.jpg" />  
                                    <CarCard url="https://cdn.pixabay.com/photo/2016/11/23/17/24/woman-1853936_960_720.jpg" />  
                                    <CarCard url="https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg" />                                  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
