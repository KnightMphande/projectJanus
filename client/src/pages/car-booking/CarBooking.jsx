import Header from '../../components/header/Header';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar } from '@rewind-ui/core';
import { MdAdd } from 'react-icons/md';
import { format, differenceInDays, isValid, eachDayOfInterval } from 'date-fns';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

export default function CarBooking() {
    // Retrieve user from local storage
    const { currentUser } = useSelector((state) => state.user);

    const { vehicleId } = useParams();
    const [vehicle, setVehicle] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectingStart, setSelectingStart] = useState(true);
    const [totalDays, setTotalDays] = useState(0);
    const [amount, setAmount] = useState(0);
    const [greenDates, setGreenDates] = useState([]);
    const [locations, setLocations] = useState();
    const [pickup, setPickupLocation] = useState('');
    const [dropoff, setDropoffLocation] = useState('');
    const [filteredPickupLocations, setFilteredPickupLocations] = useState([]);
    const [filteredDropoffLocations, setFilteredDropoffLocations] = useState([]);
    const [redDates, setRedDates] = useState([]);


    const navigate = useNavigate();

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

        const fetchVehicle = async () => {
            try {
                const response = await fetch(`/api/vehicle/${vehicleId}`);
                const data = await response.json();

                if (response.ok) {
                    setVehicle(data.vehicles);
                    setLoading(false);
                } else {
                    setError(data.error || 'Error fetching vehicle data');
                    setLoading(false);
                }
            } catch (error) {
                setError('Error fetching vehicle');
                setLoading(false);
            }
        };

        fetchVehicle();
        fetchLocations();
    }, [vehicleId]);

    useEffect(() => {
        if (startDate && endDate && isValid(startDate) && isValid(endDate)) {

            // +1 to include the start day
            const days = differenceInDays(endDate, startDate) + 1;
            setTotalDays(days);

            // Calculate amount based on days and vehicle price
            setAmount(days * vehicle.price);

            // Highlight the range of selected dates in green
            const greenDates = eachDayOfInterval({ start: startDate, end: endDate });
            setGreenDates(greenDates);
        } else {
            setTotalDays(0);
            setAmount(0);
            setGreenDates([]);
        }

        // Mark booked dates as red
        if (vehicle && vehicle.check_out && vehicle.check_in) {
            const checkOutDate = new Date(vehicle.check_out);
            const checkInDate = new Date(vehicle.check_in);

            // Ensure checkOutDate is before checkInDate
            if (isValid(checkOutDate) && isValid(checkInDate) && checkOutDate <= checkInDate) {
                const bookedDates = eachDayOfInterval({ start: checkOutDate, end: checkInDate });

                // Set the range as red dates
                setRedDates(bookedDates); 
            } else {
                // Clear red dates if invalid
                setRedDates([]); 
            }
        } else {
            // Clear red dates if no vehicle data
            setRedDates([]); 
        }

    }, [startDate, endDate, vehicle]);


    console.log("Vehicle: ", vehicle);

    const handlePickupChange = (e) => {
        const value = e.target.value;
        setPickupLocation(value);
        setFilteredPickupLocations(
            locations.filter(location => location.location.toLowerCase().includes(value.toLowerCase()))
        );
    };

    const handleDropoffChange = (e) => {
        const value = e.target.value;
        setDropoffLocation(value);
        setFilteredDropoffLocations(
            locations.filter(location => location.location.toLowerCase().includes(value.toLowerCase()))
        );
    };

    const handlePickupSelect = (location) => {
        setPickupLocation(location.location);
        setFilteredPickupLocations([]);
    };

    const handleDropoffSelect = (location) => {
        setDropoffLocation(location.location);
        setFilteredDropoffLocations([]);
    };

    const setToMidnightUTC = (date) => {
        const newDate = new Date(date);
        newDate.setUTCHours(0, 0, 0, 0); // Set to midnight UTC
        return newDate;
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            toast.error("Please sign in before booking");
            return;
        }


        // Convert start and end dates to UTC midnight
        const bookingData = {
            vehicleId: vehicleId,
            checkIn: endDate ? format(setToMidnightUTC(endDate), 'yyyy-MM-dd') : '',
            checkOut: startDate ? format(setToMidnightUTC(startDate), 'yyyy-MM-dd') : '',
            pickUpLocation: pickup,
            dropOffLocation: dropoff,
            amount: amount,
            totalDays: totalDays,
        };

        // console.log("Data to send to backend: ", bookingData);

        // Check if pickup and droff are not empty
        if (pickup === "") {
            toast.error("Please select pickup location");
            return
        }

        if (dropoff === "") {
            toast.error("Please select dropoff location");
            return
        }


        try {
            const response = await fetch('/api/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            const result = await response.json();

            if (!result.success) {
                toast.error(result.error);
                return;
            }

            navigate(`/profile/${currentUser?.customer_id}`);
            toast.success(result.message);
        } catch (error) {
            console.log(error);
        }
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleDateSelection = (date) => {
        if (selectingStart) {
            // Add 1 day to the selected start date
            const adjustedStartDate = new Date(date);
            adjustedStartDate.setDate(adjustedStartDate.getDate() + 1);

            setStartDate(setToMidnightUTC(adjustedStartDate));

            // Reset end date when selecting a new start date
            setEndDate(null);

            // Switch to selecting end date
            setSelectingStart(false);
        } else {
            if (date >= startDate) {
                // Add 1 day to the selected end date
                const adjustedEndDate = new Date(date);
                adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);

                setEndDate(setToMidnightUTC(adjustedEndDate));
            }

            // Switch back to selecting start date
            setSelectingStart(true);
        }
    };

    return (
        <>
            <Header />
            <section className="max-w-[1500px] mt-8 sm:mt-12 relative mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
                    <div className="h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-lg">
                        <div className="w-full h-full rounded-lg overflow-hidden">
                            {vehicle.filename ? (
                                <img
                                    src={`http://localhost:5000/image/${vehicle.vehicle_id}/${vehicle.filename}`}
                                    alt={`${vehicle.make} ${vehicle.model}`}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                    <p>No image available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Vehicle Details */}
                    <div className="rounded-lg p-4 bg-gray-100">
                        <h1 className="text-2xl font-bold">
                            {vehicle.make} {vehicle.model} ({vehicle.year})
                        </h1>
                        <p className="mt-2 text-lg font-medium">Price: R{vehicle.price}/day</p>
                        <p className="mt-2 text-lg font-medium">Category: {vehicle.category}</p>
                        <div className="mt-4 flex items-center justify-center bg-green-600 max-w-[200px] rounded-lg text-white font-medium">
                            <p className="mx-auto">{vehicle.status}</p>
                        </div>

                        {/* Calendar */}
                        <div className="mt-6 rounded-lg">
                            <p className="font-medium mb-4">
                                {selectingStart ? 'Select Start Date' : 'Select End Date'}
                            </p>
                            <Calendar
                                minDate={redDates[0] || new Date(new Date().setDate(new Date().getDate() - 1))}
                                onChange={handleDateSelection}
                                disabledWeekends={false}
                                greenDates={greenDates}
                                redDates={redDates}
                                disabledDates={redDates}
                            />

                            <div className="my-4">
                                {/* Pickup and Drop-off Locations */}
                                <div className="flex flex-col lg:flex-row items-center gap-4 bg-slate-100 border border-gray-300 rounded-md p-4 w-full">
                                    {/* Pickup Location */}
                                    <div className="relative flex items-center border border-gray-300 rounded-md p-2 w-full lg:max-w-xs bg-white">
                                        <FaMapMarkerAlt className="text-gray-500 mr-2" />
                                        <input
                                            type="text"
                                            placeholder="Pickup location"
                                            value={pickup}
                                            onChange={handlePickupChange}
                                            className="border-none outline-none text-sm py-1 w-full bg-transparent"
                                        />
                                        {filteredPickupLocations.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                                {filteredPickupLocations.map((location, index) => (
                                                    <p
                                                        key={index}
                                                        onClick={() => handlePickupSelect(location)}
                                                        className="p-2 cursor-pointer hover:bg-gray-200"
                                                    >
                                                        {location.location}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Drop-off Location */}
                                    <div className="relative flex items-center border border-gray-300 rounded-md p-2 w-full lg:max-w-xs bg-white">
                                        <FaMapMarkerAlt className="text-gray-500 mr-2" />
                                        <input
                                            type="text"
                                            placeholder="Drop-off location"
                                            value={dropoff}
                                            onChange={handleDropoffChange}
                                            className="border-none outline-none text-sm py-1 w-full bg-transparent"
                                        />
                                        {filteredDropoffLocations.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                                {filteredDropoffLocations.map((location, index) => (
                                                    <p
                                                        key={index}
                                                        onClick={() => handleDropoffSelect(location)}
                                                        className="p-2 cursor-pointer hover:bg-gray-200"
                                                    >
                                                        {location.location}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 rounded-lg bg-slate-300 max-h-44 p-4 font-medium space-y-1 text-gray-800">
                                <div className="flex flex-col justify-center items-start">
                                    <p>Check-out Date: {startDate && isValid(startDate) ? format(startDate, 'dd/MM/yyyy') : 'Not selected'}</p>
                                    <p>Check-in Date: {endDate && isValid(endDate) ? format(endDate, 'dd/MM/yyyy') : 'Not selected'}</p>
                                    <p>Number of Days: {totalDays}</p>
                                    <p>Amount: R{amount}</p>
                                    <button
                                        type="submit"
                                        onClick={handleSubmit}
                                        className="mt-2 flex items-center px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-400 focus:ring-opacity-80"
                                    >
                                        <MdAdd className="w-5 h-5 mx-1" />
                                        <span className="mx-1">Book</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
}
