import path from "path";
import fs from "fs";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const vehicleId = req.params.vehicleId; 

    if(!vehicleId) {
        return cb(new Error("Cannot create storage for car without id"));
    }

    const uploadDir = path.join("uploads/vehicles", `car-${vehicleId}`);

    // Check if the directory exists, if not, create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);

    const isImage = file.mimetype.startsWith("image");

    if (!isImage) {
      return cb(new Error("Only image files are allowed!"));
    }

    cb(null, "car-image-" + uniqueSuffix + ext);
  },
});


const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.user;

    if (!userId) {
      return cb(new Error("Cannot create storage for profile without user ID"));
    }

    const uploadDir = path.join("uploads/profiles", `user-${userId}`);

    // Check if the directory exists, if not, create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    } else {
      // If the directory exists, check for existing files and delete them
      const existingFiles = fs.readdirSync(uploadDir);

      existingFiles.forEach((existingFile) => {
        const filePath = path.join(uploadDir, existingFile);
        fs.unlinkSync(filePath); // Delete the existing file
      });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);

    const isImage = file.mimetype.startsWith("image");

    if (!isImage) {
      return cb(new Error("Only image files are allowed!"));
    }

    cb(null, "profile-image-" + uniqueSuffix + ext);
  },
});

const damages = multer.diskStorage({
  destination: function (req, file, cb) {
    const vehicleId = req.params.vehicleId; 

    if(!vehicleId) {
        return cb(new Error("Cannot create storage for car without id"));
    }

    const uploadDir = path.join("uploads/damages", `car-${vehicleId}`);

    // Check if the directory exists, if not, create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);

    const isImage = file.mimetype.startsWith("image");

    if (!isImage) {
      return cb(new Error("Only image files are allowed!"));
    }

    cb(null, "car-image-" + uniqueSuffix + ext);
  },
});

// Initialize multer with the storage
export const upload = multer({ storage: storage });

// Initialize multer with the storages
export const uploadDamages = multer({ storage: damages });

// Initialize multer with the profile storage
export const uploadProfile = multer({ storage: profileStorage });