import { FaStar } from 'react-icons/fa';
import Header from '../../components/header/Header';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function CarBooking() {
  const { vehicleId } = useParams();
  const [vehicle, setVehicle] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, [vehicleId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Header />
      <section className="max-w-[1500px] mt-8 sm:mt-12 relative mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
          <div className="h-64 md:h-96 sm:h-[500px] rounded-lg">
            <div className="w-full relative h-auto rounded-lg">
              {vehicle.filename ? (
                <img
                  src={`http://localhost:5000/image/${vehicle.vehicle_id}/${vehicle.filename}`}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full max-w-full h-auto rounded-lg"
                />
              ) : (
                <div className="w-full h-auto bg-gray-200 rounded-lg flex items-center justify-center">
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
            <p className="mt-2 text-lg font-medium">Price: R{vehicle.price}</p>
            <p className="mt-2 text-lg font-medium">Category: {vehicle.category}</p>
            <div className="mt-4 flex items-center bg-green-600 max-w-28 rounded-lg text-white font-medium">
              <p className="mx-auto">{vehicle.status}</p>
            </div>

            {/* Calender */}
            <div className="mt-6 rounded-lg bg-gray-200">
              
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
