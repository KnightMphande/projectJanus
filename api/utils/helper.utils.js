import bcryptjs from "bcryptjs";

// #################### Helper Class ####################

export class HelperFunc {

    static hashFunc = (strValue) => {
      return bcryptjs.hashSync(strValue, 12);
    };

    static isPasswordFound = (password, user) => {
      return bcryptjs.compareSync(password, user?.password);
    }
  
    static capitalizeVariable = (variable) => {
      if (typeof variable !== 'string' || variable.length === 0) {
        return variable;
      }
      return variable.charAt(0).toUpperCase() + variable.slice(1);
    }
  
    static removeProperties = (user, ...properties) => {
      // Destructure the specified properties from the user object
      const userWithoutProperties = { ...user };
      properties.forEach(property => {
        delete userWithoutProperties[property];
      });
      return userWithoutProperties;
    }
  
    static isObjEmpty = (obj) => {
      return Object.keys(obj).length === 0;
    }
  
    static separateAndCapitalize = (camelCaseString) => {
      // Separate camelCase string into words
      const words = camelCaseString.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');
    
      // Capitalize the first word
      if (words.length > 0) {
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      }
    
      // Join the words back into a single string with spaces
      return words.join(' ');
    }
  }