import { MdAdd } from "react-icons/md";

export default function CarCard({ url }) {
    return (
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <img src={url} alt="Car Image" className="w-full h-56 object-cover" />
            <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800">Luxury Car</h3>
                <p className="mt-2 text-gray-600">Luxury car for a premium driving experience.</p>
                <div className="flex justify-between items-center mt-2">
                    <h4 className="text-lg font-semibold text-gray-800">R3000/day</h4>
                    <button className="flex items-center px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-400 focus:ring-opacity-80">
                        <MdAdd className="w-5 h-5 mx-1" />
                        <span className="mx-1">Book</span>
                    </button>
                </div>
            </div>
        </div>
    );
}