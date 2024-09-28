import { HelperFunc } from "./helper.utils.js";

export class DataValidation {
    // Validate email format
    static validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  
    static validatePassword(password) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
      return passwordRegex.test(password);
    }
  
    // Validate first name and last name (between 3 and 45 characters, only letters)
    static validateName(name) {
      const nameRegex = /^[a-zA-Z]{3,45}$/;
      const isValid = nameRegex.test(name.trim());
      return isValid;
    }
  
    /**
     * This function checks an object for missing values (either undefined or empty strings) and returns the keys with missing values.
     * @param {object} objValues The object to check for missing values.
     * @returns {Array} An array of keys that have missing values.
     */
    static checkMissingInfo = (objValues) => {
      const missingKeys = [];
  
      for (const key in objValues) {
        // Check if the value is either undefined or an empty string
        if (objValues[key] === undefined || objValues[key] === "") {
          missingKeys.push(HelperFunc.capitalizeVariable(key));
        }
      }
  
      return missingKeys;
    };
  }