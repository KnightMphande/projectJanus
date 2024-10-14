import bcryptjs from "bcryptjs";

// #################### Helper Class ####################

export class HelperFunc {
  static hashFunc = (strValue) => {
    return bcryptjs.hashSync(strValue, 12);
  };

  static isPasswordFound = (password, user) => {
    return bcryptjs.compareSync(password, user?.password);
  };

  static capitalizeVariable = (variable) => {
    if (typeof variable !== "string" || variable.length === 0) {
      return variable;
    }
    return variable.charAt(0).toUpperCase() + variable.slice(1);
  };

  static isObjEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  };

  static separateAndCapitalize = (camelCaseString) => {
    // Separate camelCase string into words
    const words = camelCaseString
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .split(" ");

    // Capitalize the first word
    if (words.length > 0) {
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    }

    // Join the words back into a single string with spaces
    return words.join(" ");
  };

  static async combineBookingWithVehicle(bookings, vehicles) {
    let newBookings = [];
  
    for (let i = 0; i < bookings.length; i++) {
      // Find the matching vehicle for the current booking
      const matchedVehicle = vehicles.find(vehicle => vehicle.vehicle_id === bookings[i].vehicle_id);
  
      if (matchedVehicle) {
        // Combine the booking and vehicle details
        const combinedObj = {
          ...bookings[i],
          vehicleDetails: {
            make: matchedVehicle.make,
            model: matchedVehicle.model,
            year: matchedVehicle.year,
            category: matchedVehicle.category,
            status: matchedVehicle.status,
            price: matchedVehicle.price,
            filename: matchedVehicle.filename,
          },
        };
  
        newBookings.push(combinedObj);
      } else {
        // If no matching vehicle is found, keep original booking details
        newBookings.push(bookings[i]);
      }
    }
  
    return newBookings;
  }

  static async setToMidnightUTC(date) {
    const newDate = new Date(date);
    newDate.setUTCHours(0, 0, 0, 0); 
    return newDate;
  };
  
}
