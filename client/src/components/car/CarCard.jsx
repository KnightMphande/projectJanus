import { MdAdd } from "react-icons/md";
import { Link } from "react-router-dom";

export default function CarCard({ vehicle, id }) {
    return (
        <div key={id} className="bg-white shadow-lg rounded-2xl cursor-pointer">
            <img src={`http://localhost:5000/image/${vehicle.vehicle_id}/${vehicle.filename}`} alt="Car Image" className="w-full h-56 object-cover rounded-lg" />
            <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800">{vehicle.make}</h3>
                <p className="mt-2 text-gray-600 font-medium">{vehicle.model} {vehicle.year}</p>
                <p className="mt-2 text-gray-600 font-medium">{vehicle.category}</p>
                <div className="flex justify-between items-center mt-2">
                    <h4 className="text-lg font-semibold text-gray-800">R{vehicle.price}/day</h4>
                    <Link to={`/car-booking/${vehicle.vehicle_id}`} className="flex items-center px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-400 focus:ring-opacity-80">
                        <MdAdd className="w-5 h-5 mx-1" />
                        <span className="mx-1">Book</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}