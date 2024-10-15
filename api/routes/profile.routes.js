import express from "express";
import {
  getCustomerProfileController,
  updateDriversLicenseController,
  updateProfileController,
} from "../controllers/profile.controllers.js";
import { verifyJwt } from "../middlewares/verifyJwt.middleware.js";
import { uploadProfile } from "../configs/multer.configs.js";

const profile_router = express.Router();

profile_router.use(verifyJwt);

profile_router.get("/:customerId", getCustomerProfileController);
profile_router.put(
  "/:customerId",
  uploadProfile.single("profilePic"),
  updateProfileController
);
profile_router.put("/license/:customerId", updateDriversLicenseController);

export default profile_router;
