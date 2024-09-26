import client from "../configs/db.configs.js";
import { AuthenticationService } from "../services/auth.services.js";
import { HelperFunc } from "../utils/helper.utils.js";
import { DataValidation } from "../utils/validations.utils.js";

export const registerCustomerController = async (req, res) => {
  const customerDetails = req.body;
  try {
    // Check missing information
    const missingFieldsArr = DataValidation.checkMissingInfo(customerDetails);

    if (missingFieldsArr?.length > 0) {
      return res
        .status(400)
        .json({ success: false, error: `${missingFieldsArr[0]} is missing` });
    }

    // Validate email
    const isEmailValid = DataValidation.validateEmail(customerDetails?.email);

    if (!isEmailValid) {
      return res
        .status(400)
        .json({ success: false, error: "Email not valid." });
    }

    // Validate password
    const isPasswordValid = DataValidation.validatePassword(
      customerDetails?.password
    );

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, error: "Password not valid." });
    }

    // check if email does exist
    const emailExists = await AuthenticationService.checkEmailExists(
      customerDetails?.email
    );

    if (emailExists) {
      return res
        .status(409)
        .json({ success: false, error: "User already exist, please login." });
    }

    // Hash password
    const hashedPassword = await HelperFunc.hashFunc(customerDetails?.password);

    if (hashedPassword) {
      // update password to use the hashed one
      customerDetails.password = hashedPassword;

      const customerId = await AuthenticationService.register(customerDetails);

      if (customerId) {
        return res
          .status(200)
          .json({ success: true, message: "Customer registered successfully" });
      }
    }
  } catch (error) {
    await client.query("ROLLBACK");
    // Rollback transaction in case of error
    console.error("Failed to register user: ", error);

    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};
