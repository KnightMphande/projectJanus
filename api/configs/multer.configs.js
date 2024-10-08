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

// Initialize multer with the storage
export const upload = multer({ storage: storage });