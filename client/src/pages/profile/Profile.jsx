import { FaMobileButton } from "react-icons/fa6";
import styles from "./Profile.module.scss";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import { MdPreview } from "react-icons/md";
import { toast } from "react-toastify";
import UpdateProfileModal from "../../components/modals/updateProfile";
import { removeTimeFromTimestamp } from "../../utils/Helper";

export default function Profile() {
  const { customerId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("drivers-license");
  const [profile, setProfile] = useState({});
  const [userData, setUserData] = useState({});
  const [currentBookings, setCurrentBookings] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [vehicleDetails, setVehicleDetails] = useState({});
  const [driversLicense, setDriversLicense] = useState({});

  async function fetchProfile() {
    try {
      const response = await fetch(`/api/profile/${customerId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log(result);

      const data = result.profile;
      setProfile(data);
      setUserData(data.user);
      setCurrentBookings(data.currentBookings);
      setBookingHistory(data.bookingHistory);
      setDriversLicense(data.driversLicense);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  }

  // Fetch profile data
  useEffect(() => {
    fetchProfile();
  }, [customerId]);

  console.log("User Data: ", userData);
  console.log("Current Bookings: ", currentBookings);
  console.log("Booking History: ", bookingHistory);
  console.log("Drivers License: ", driversLicense);

  // Handle modal open
  const handleModalOpen = () => {
    setIsOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsOpen(false);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Cancel Booking
  const cancelBooking = async (id) => {
    try {
      const response = await fetch(`/api/booking/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      fetchProfile();

      toast.success(result.message);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle profile update submit
  const handleUpdateProfile = async (data) => {
    console.log("Data To Send: ", data);

    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append("names", data.names);
      formData.append("address", data.address);
      formData.append("phone", data.phone);
      formData.append("profilePic", data.profilePic);

      // Make the fetch request
      const response = await fetch(`/api/profile/${data.customerId}`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      // Refresh profile data
      fetchProfile();
      handleModalClose();

      toast.success(result.message);
    } catch (error) {
      console.log("Error: ", error);
      toast.error("An error occurred while updating the profile.");
    }
  };

  // Handle drivers license update submit
  const handleDriversLicenseSubmit = async (formData) => {
    console.log("Data to be sent: ", formData);
    try {
      const response = await fetch(
        `/api/profile/license/${formData.customerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            licenseNumber: formData.licenseNumber,
            issueDate: formData.issueDate,
            expiryDate: formData.expiryDate,
          }),
        }
      );

      const result = await response.json();

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);
      fetchProfile();
    } catch (error) {
      console.error(error);
    }
  };

  const urlLogo =
    userData?.logo_url === null
      ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwdIVSqaMsmZyDbr9mDPk06Nss404fosHjLg&s"
      : `http://localhost:5000/profile/${userData?.customer_id}/${userData?.logo_url}`;

  return (
    <>
      <Header />

      <section className="mt-8 p-4 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
          {/* Profile */}
          <div className="rounded-lg max-h-[400px]">
            <div className={`${styles.card} rounded-lg`}>
              <div
                className={`bg-green-600 rounded-lg ${styles.cardHeader}`}
              ></div>
              <div className={styles.cardAvatar}>
                <img
                  className="w-28 h-28 rounded-full shadow-lg"
                  src={urlLogo}
                  alt="Profile avatar"
                />
              </div>
              <div className={styles.cardTitle}>{userData?.names || ""}</div>
              <div className={styles.cardSubtitle}>{userData?.phone}</div>
              <div className={styles.cardSubtitle}>{userData?.email}</div>
              <div className="flex justify-between items-center gap-2 my-6">
                <button
                  onClick={handleModalOpen}
                  className="rounded border border-green-600 bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-transparent hover:text-green-600 focus:outline-none focus:ring active:text-green-500"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </div>

          {/* Customer Booking information */}
          <div className="rounded-lg lg:col-span-2">
            {/* Tabs */}
            <div className="block sm:hidden">
              <div className="text-base font-medium">Tabs</div>
              <div>
                <select
                  id="Tab"
                  className="w-full rounded-md border border-gray-200 p-1"
                  onChange={(e) => handleTabChange(e.target.value)}
                  value={activeTab}
                >
                  <option value="drivers-license">Driver's License</option>
                  <option value="current-bookings">Current Bookings</option>
                  <option value="booking-history">Booking History</option>
                </select>
              </div>
            </div>

            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex gap-6">
                  <Link
                    to="#"
                    onClick={() => handleTabChange("drivers-license")}
                    className={`shrink-0 border border-transparent p-3 text-sm font-medium ${
                      activeTab === "drivers-license"
                        ? "text-sky-600 border-b-white"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Driver's License
                  </Link>
                  <Link
                    to="#"
                    onClick={() => handleTabChange("current-bookings")}
                    className={`shrink-0 border border-transparent p-3 text-sm font-medium ${
                      activeTab === "current-bookings"
                        ? "text-sky-600 border-b-white"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Current Bookings
                  </Link>
                  <Link
                    to="#"
                    onClick={() => handleTabChange("booking-history")}
                    className={`shrink-0 border border-transparent p-3 text-sm font-medium ${
                      activeTab === "booking-history"
                        ? "text-sky-600 border-b-white"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Booking History
                  </Link>
                </nav>
              </div>
            </div>

            {/* Render Booking History or other tabs based on activeTab */}
            {activeTab === "booking-history" && (
              <BookingHistory bookingHistory={bookingHistory} />
            )}
            {activeTab === "current-bookings" && (
              <CurrentBookings
                currentBookings={currentBookings}
                cancelBooking={cancelBooking}
              />
            )}
            {activeTab === "drivers-license" && (
              <DriversLicense
                driversLicense={driversLicense}
                handleDriversLicenseSubmit={handleDriversLicenseSubmit}
                customerId={userData.customer_id}
              />
            )}
          </div>
        </div>

        {/* Handle profile udate modal */}
        {isOpen && (
          <UpdateProfileModal
            close={handleModalClose}
            updateProfile={handleUpdateProfile}
            profileData={userData}
          />
        )}
      </section>
    </>
  );
}

// Component for Booking History
const BookingHistory = ({ bookingHistory }) => {
  return (
    <div className="my-8">
      <h2 className="text-lg font-semibold">
        {bookingHistory?.length === 0
          ? "Booking history is empty"
          : "Your Booking History"}
      </h2>
      <div className="my-8">
        <ul className="space-y-4 mb-4">
          {bookingHistory?.map((booking) => (
            <li key={booking?.booking_id}>
              <div className="flex justify-between items-start w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100">
                <div className="block">
                  <div className="w-full text-lg font-semibold">
                    {booking?.vehicleDetails?.make}{" "}
                    {booking?.vehicleDetails?.model}
                  </div>
                  <div className="w-full text-gray-500">
                    Year: {booking?.vehicleDetails?.year}
                  </div>

                  <div className="flex my-2 bg-red-500 p-[2px] rounded-lg text-white w-32">
                    {booking?.status === "cancelled" && (
                      <p className="mx-auto">{booking?.status}</p>
                    )}
                  </div>
                </div>
                <img
                  className="w-28 h-20 rounded ml-4"
                  src={`http://localhost:5000/image/${booking?.vehicle_id}/${booking?.vehicleDetails?.filename}`}
                  alt={`${booking?.vehicleDetails?.make} ${booking?.vehicleDetails?.model}`}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Component for Current Bookings
const CurrentBookings = ({ currentBookings, cancelBooking }) => {
  console.log("Current Bookings To check Status: ", currentBookings);

  return (
    <div className="my-8">
      <h2 className="text-lg font-semibold">Your Current Bookings</h2>
      {/* Display current bookings */}
      <div className="my-8">
        <ul className="space-y-4 mb-4">
          {currentBookings?.map((booking) => (
            <li key={booking.booking_id}>
              <div className="flex justify-between items-start w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100">
                <div className="block">
                  <div className="w-full text-lg font-semibold">
                    {booking?.vehicleDetails?.make}{" "}
                    {booking?.vehicleDetails?.model}
                  </div>
                  <div className="w-full text-gray-500">
                    Year: {booking?.vehicleDetails?.year}
                  </div>
                  <div className="w-full text-gray-500">
                    {" "}
                    Check Out: {removeTimeFromTimestamp(booking?.check_out)}
                  </div>
                  <div className="w-full text-gray-500">
                    {" "}
                    Check In: {removeTimeFromTimestamp(booking?.check_in)}
                  </div>
                  <div className="w-full text-gray-500">
                    Invoice: {booking?.invoice}
                  </div>

                  <div className="mt-2 flex">
                    <button className="mr-2 flex items-center rounded-full border border-green-600 bg-green-600 px-2 py-[3px] text-xs font-medium text-white hover:bg-transparent hover:text-green-600 focus:outline-none focus:ring active:text-green-500">
                      Invoice
                    </button>
                    {(booking?.status === "confirmed" ||
                      booking?.status === "in-progress" ||
                      booking?.status === "cancelled") &&
                      booking?.status !== "rented" && (
                        <button
                          onClick={() => cancelBooking(booking?.booking_id)}
                          className="rounded-full border border-red-600 bg-red-600 px-2 py-[3px] text-xs font-medium text-white hover:bg-transparent hover:text-red-600 focus:outline-none focus:ring active:text-red-500"
                        >
                          Cancel Booking
                        </button>
                      )}
                  </div>
                </div>
                <div className="flex justify-start items-center flex-col ml-4">
                  <img
                    className="w-28 h-20 rounded"
                    src={`http://localhost:5000/image/${booking?.vehicle_id}/${booking?.vehicleDetails?.filename}`}
                    alt={`${booking?.vehicleDetails?.make} ${booking?.vehicleDetails?.model}`}
                  />
                  <div className="mt-2 w-full text-gray-500 font-medium text-sm">
                    {booking?.status === "rented" ? "Vehicle" : "booking"} {booking?.status}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Component for Driver's License
const DriversLicense = ({
  driversLicense,
  customerId,
  handleDriversLicenseSubmit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    licenseNumber: driversLicense?.license_number || "",
    issueDate: driversLicense?.issue_date?.split("T")[0] || "",
    expiryDate: driversLicense?.expiry_date?.split("T")[0] || "",
  });

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.expiryDate === "" ||
      formData.issueDate === "" ||
      formData.licenseNumber === ""
    ) {
      toast.error("Please fill in required information");
      return;
    }

    formData.customerId = customerId;

    handleDriversLicenseSubmit(formData);
    setIsEditing(false);
  };

  return (
    <div className="my-8 p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-semibold">Driver's License</h2>
      <div className="my-4">
        <p>
          <strong>License Number:</strong> {driversLicense?.license_number}
        </p>
        <p>
          <strong>Issue Date:</strong>{" "}
          {new Date(driversLicense?.issue_date).toLocaleDateString()}
        </p>
        <p>
          <strong>Expiry Date:</strong>{" "}
          {new Date(driversLicense?.expiry_date).toLocaleDateString()}
        </p>
      </div>

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleEditClick}
      >
        {isEditing ? "Cancel" : "Update"}
      </button>

      {isEditing && (
        <form className="mt-4" onSubmit={handleUpdateSubmit}>
          <label className="block mb-2">
            License Number
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="formInput"
              placeholder="License Number"
            />
          </label>

          <label className="block mb-2">
            Issue Date
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              className="formInput"
              max={today} // Prevent selecting past dates
            />
          </label>

          <label className="block mb-2">
            Expiry Date
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="formInput"
              min={formData.issueDate || today} // Prevent selecting a date before the issue date
            />
          </label>

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
};
