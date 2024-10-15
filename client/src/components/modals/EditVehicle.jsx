import { useState } from "react";

export default function EditVehiclePriceModal({
  handleCloseModal,
  handleEditVehiclePriceSubmit,
  currentVehicle,
}) {
  const [price, setPrice] = useState(currentVehicle.price);

  const handleSubmit = (e) => {
    e.preventDefault()
    handleEditVehiclePriceSubmit({ price, status: currentVehicle.status });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Edit Price for {currentVehicle.make} {currentVehicle.model}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              New Price (R/day)
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
