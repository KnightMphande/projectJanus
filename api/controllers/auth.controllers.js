import client from "../configs/db.configs.js";
import { AuthenticationService } from "../services/auth.services.js";
import { HelperFunc } from "../utils/helper.utils.js";
import { DataValidation } from "../utils/validations.utils.js";
import jwt from "jsonwebtoken";

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

    if (emailExists?.exists) {
      return res
        .status(409)
        .json({ success: false, error: "User already exist, please login." });
    }

    // check if phone does exist
    const phoneExists = await AuthenticationService.checkPhoneExists(
      customerDetails?.phone
    );

    if (phoneExists?.exists) {
      return res
        .status(409)
        .json({ success: false, error: "Phone number already used" });
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
    console.error("Failed to register user: ", error);

    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const loginController = async (req, res) => {
  const userDetails = req.body;

  try {
    // Check missing information
    const missingFieldsArr = DataValidation.checkMissingInfo(userDetails);

    if (missingFieldsArr?.length > 0) {
      return res
        .status(400)
        .json({ success: false, error: `${missingFieldsArr[0]} is missing` });
    }

    // Validate email
    const isEmailValid = DataValidation.validateEmail(userDetails?.email);

    if (!isEmailValid) {
      return res
        .status(400)
        .json({ success: false, error: "Email not valid." });
    }

    // check if email does exist
    const emailExists = await AuthenticationService.checkEmailExists(
      userDetails?.email
    );

    if (!emailExists?.exists) {
      return res
        .status(409)
        .json({ success: false, error: "User not found, please register." });
    }

    const user = emailExists?.user;
    let isPasswordValid;

    if (user) {
      if (user.role === "admin" && user.must_change_password === true) {
        isPasswordValid = true;

        // Remove password
        const { password: userPassword, ...rest } = user;

        // Create a token for the user
        const token = jwt.sign(
          {
            userId: user.staff_id,
            role: "admin",
          },
          process.env.SECRET,
          {
            expiresIn: "2h",
          }
        );

        return res
          .cookie('access_token', token, { httpOnly: true })
          .status(200)
          .json({ success: true, message: "Login successfully", user: rest });
      } 
      
    else {
        isPasswordValid = DataValidation.validatePassword(
          userDetails?.password
        );

        if (!isPasswordValid) {
          return res
            .status(400)
            .json({ success: false, error: "Password not valid." });
        }

        const passwordMatch = await HelperFunc.isPasswordFound(
          userDetails.password,
          user
        );

        if (!passwordMatch) {
          return res
            .status(401)
            .json({ success: false, error: "Invalid password" });
        }

        // Remove password
        const { password: userPassword, ...rest } = user;

        // Create a token for the user
        const token = jwt.sign(
          {
            userId: user.role === "customer" ? user.customer_id : user.staff_id,
            role: user.role,
          },
          process.env.SECRET,
          {
            expiresIn: "2h",
          }
        );

        return res
          .set("Authorization", `Bearer ${token}`)
          .cookie("access_token", token, { httpOnly: true })
          .status(200)
          .json({ success: true, message: "Login successfully", user: rest });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const logoutController = async (req, res) => {
  try {
    return res.clearCookie('access_token').status(200).json({ success: true, message: "Successsfully logged out" });
  } catch (error) {
    console.error("Failed to signout user: ", error);

    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  
  }
};
