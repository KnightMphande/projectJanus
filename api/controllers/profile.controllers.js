import { ProfileService } from "../services/profile.services.js";
import path from "path";
import fs from "fs";

export const getCustomerProfileController = async (req, res) => {
  // Access the userId and role from the req object
  const userId = req.user;
  const role = req.role;

  try {
    const profile = await ProfileService.getCustomerProfile(userId);

    if (profile.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Customer not found" });
    }

    return res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const updateProfileController = async (req, res) => {
  const userId = req.user;
  const role = req.role;

  const { names, address, phone } = req.body;

  // Get the new profile picture file if provided
  let profilePic = req.file ? req.file.filename : null;

  try {

    if (!profilePic) {
      const userProfileDir = path.join("uploads/profiles", `user-${userId}`);

      // Check if the directory exists
      if (fs.existsSync(userProfileDir)) {
        const files = fs.readdirSync(userProfileDir);

        // Find the first image file in the user's directory
        const existingProfilePic = files.find((file) => file.startsWith("profile"));

        if (existingProfilePic) {
          profilePic = existingProfilePic;
        }
      }
    }

    const updatedProfile = await ProfileService.updateProfileService(userId, { names, address, phone, profilePic });

    if (updatedProfile) {
      return res.status(200).json({ success: true, message: 'Profile updated successfully', profile: updatedProfile });
    } else {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export const updateDriversLicenseController = async (req, res) => {
  // Access the userId and role from the req object
  const userId = req.user;
  const role = req.role;

  const driversLicenseData = req.body;

  try {
    const updatedDriversLicense = await ProfileService.updateDriversLicense(userId, driversLicenseData);

    if (updatedDriversLicense) {
      return res.status(200).json({ success: true, message: 'Profile updated successfully', driversLicense: updatedDriversLicense });
    } else {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }
  } catch (error) {
    console.error("Error updating drivers license:", error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

