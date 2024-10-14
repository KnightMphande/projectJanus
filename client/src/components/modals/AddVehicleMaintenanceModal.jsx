import { useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";

export default function AddVehicleMaintenanceModal({
  vehicles,
  close,
  handleAddVehicleMaintenance,
}) {
  const [formData, setFormData] = useState({
    description: "",
    scheduledDate: "",
    completed: false,
  });
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVehicleSelect = (e) => {
    const vehicleId = e.target.value;
    const vehicle = vehicles.find((v) => String(v.vehicle_id) === vehicleId || String(v.id) === vehicleId);
    setSelectedVehicle(vehicle); 
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedVehicle) {
      toast.error("Please select a vehicle.");
      return;
    }

    const updatedFormData = {
      ...formData,
      vehicleId: selectedVehicle.vehicle_id || selectedVehicle.id,
    };

    handleAddVehicleMaintenance(updatedFormData);

    close();
  };

  const today = new Date().toISOString().split("T")[0]; 

  return (
    <div className="modalContainer">
      <div className="modal">
        <div className="modalHeader">
          <h4 className="modalHeading">Add Vehicle Maintenance</h4>
          <button className="closeBtn" onClick={close}>
            <MdClose size={24} className="icon" />
          </button>
        </div>

        <div className="min-h-60 p-4 overflow-y-auto custom-scrollbar max-h-[65vh]">
          <form onSubmit={handleSubmit}>
            {/* Vehicle selection */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Select Vehicle
              </label>
              <select
                className="formInput"
                onChange={handleVehicleSelect}
                required
              >
                <option value="">-- Select Vehicle --</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.vehicle_id || vehicle.id} value={String(vehicle.vehicle_id || vehicle.id)}>
                    {vehicle.name} - {vehicle.model}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Maintenance Description
              </label>
              <textarea
                name="description"
                className="formInput"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter maintenance description"
                required
              ></textarea>
            </div>

            {/* Scheduled Date */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Scheduled Date
              </label>
              <input
                type="date"
                name="scheduledDate"
                className="formInput"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                min={today} 
                required
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-lg"
            >
              Add Maintenance
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
