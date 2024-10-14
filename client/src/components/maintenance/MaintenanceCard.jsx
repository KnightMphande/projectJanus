import { removeTimeFromTimestamp } from "../../utils/Helper";

export default function MaintenainceCard({ vehicle, handleManitenanceUpdate }) {

    // Handle update
    const handleUpdate = () => {
        vehicle.completed = true;

        handleManitenanceUpdate(vehicle);
    }

    return (
        <div className="relative flex flex-col items-center border border-solid border-gray-200 rounded-2xl transition-all duration-500 md:flex-row md:max-w-lg h-36">
            <div className="block overflow-hidden w-32 h-24 pl-2">
                <img
                    src={`http://localhost:5000/image/${vehicle.vehicle_id}/${vehicle.filename}`}
                    alt="Card image"
                    className="h-full w-full rounded-2xl object-cover"
                />
            </div>
            <div className="p-2 flex-1">
                <h4 className="text-sm font-semibold text-gray-900 mb-2 capitalize transition-all duration-500">
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                </h4>
                <p className="text-sm font-normal text-gray-500 transition-all duration-500 leading-5 mb-1">
                    {vehicle.description}
                </p>

                <p className="text-sm font-normal text-gray-500 transition-all duration-500 leading-5 mb-2">
                    Scheduled Date: {removeTimeFromTimestamp(vehicle.scheduled_date)}
                </p>

                <div className="flex justify-between items-center">
                    <button className={`${vehicle.completed === false ? "bg-yellow-400" : "bg-green-600"} shadow-sm rounded-full py-[4px] px-5 text-xs text-white font-semibold cursor-not-allowed`}>
                        {
                            vehicle.completed === false ? "Pending" : "Completed"
                        }
                    </button>

                    {
                        vehicle.completed === false && <button
                         onClick={() => handleUpdate()}
                         className="bg-green-600 hover:bg-green-700 shadow-sm rounded-full py-[4px] px-5 text-xs text-white font-semibold">
                            Done
                        </button>
                    }
                </div>
            </div>
        </div>
    );
}