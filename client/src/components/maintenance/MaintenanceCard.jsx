export default function MaintenainceCard({ vehicle }) {
    return (
        <div className="relative flex flex-col items-center border border-solid border-gray-200 rounded-2xl transition-all duration-500 md:flex-row md:max-w-lg">
            <div className="block overflow-hidden h-28 pl-4">
                <img
                    src={`http://localhost:5000/image/${vehicle.vehicle_id}/${vehicle.filename}`}
                    alt="Card image"
                    className="h-full w-full rounded-2xl object-cover"
                />
            </div>
            <div className="p-4 flex-1">
                <h4 className="text-base font-semibold text-gray-900 mb-2 capitalize transition-all duration-500">
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                </h4>
                <p className="text-sm font-normal text-gray-500 transition-all duration-500 leading-5 mb-5">
                    {vehicle.description}
                </p>

                <div className="flex justify-between items-center">
                    <button className={`${vehicle.completed === false ? "bg-yellow-400" : "bg-green-600"} shadow-sm rounded-full py-2 px-5 text-xs text-white font-semibold cursor-not-allowed`}>
                        {
                            vehicle.completed === false ? "Pending" : "Completed"
                        }
                    </button>

                    <button className="bg-green-600 hover:bg-green-700 shadow-sm rounded-full py-2 px-5 text-xs text-white font-semibold">
                        Done maintaining
                    </button>
                </div>
            </div>
        </div>
    );
}