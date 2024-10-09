import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import client from "./configs/db.configs.js";
import cors from "cors";
import auth_router from "./routes/auth.routes.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerui from "swagger-ui-express";
import vehicle_router from "./routes/vehicle.routes.js";
import booking_router from "./routes/booking.routes.js";
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import fs from "fs";
import maintenance_router from "./routes/maintenance.routes.js";

//Create app
const app = express();

//Configurations
dotenv.config();

//Other const vars
const port = process.env.PORT;

//Application Level Middlewares
app.use(
  cors({
    origin: ["http://localhost:3000/", "http://localhost:8080/"], //allow connection from these endpoints
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    //    methods: ["GET", "POST", "PATCH", "PUT", "OPTIONS", "HEAD"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "Car Rental Management System",
      version: "0.0.1",
      description: `A system for managing a car rental service, enabling the company 
      to handle vehicle fleets, track bookings, manage customer registrations, 
      and oversee check-ins, check-outs, and maintenance. Customers can search 
      and reserve cars, while staff can manage operations and generate reports.`
    },
    server: [
      {
        url: "http://localhost:5000/"
      }
    ]
  },
  apis: ['./routes*.js', './annotations/swaggerAuthAnnotations.js', './annotations/vehicleAnnotations.js'], 
};

const spacs = swaggerJSDoc(options);

app.use(
  '/api/docs',
  swaggerui.serve,
  swaggerui.setup(spacs)
);

// Establish database connection first before starting the server
const connect = async () => {
    try {
      // Wait for the database connection to be established
      await client.connect();
      console.log('Successfully connected to Database.');
  
      // Start the Express.js server
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    } catch (err) {
      console.error("Error connecting to the database", err.message);
    }
  };

//Invoke connect func
connect();


// Test api route
app.get('/api/test', (req, res) => {
    return res.status(200).json({ success: true, message: "Hello Knight, started Node.js Development" })
});


// Middleware to serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route to serve a specific image
app.get('/image/:vehicleId/:filename', (req, res) => {
  const { vehicleId, filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', 'vehicles', `car-${vehicleId}`, filename);

  // Check if the file exists
  fs.stat(filePath, (err) => {
      if (err) {
          return res.status(404).json({ success: false, error: "File not found" });
      }

      // Send the file to the client
      res.sendFile(filePath, (err) => {
          if (err) {
              res.status(err.status).end();
          } else {
              console.log('Sent:', filename);
          }
      });
  });
});

// Router level middlewares
app.use('/api/auth', auth_router);
app.use('/api/vehicle', vehicle_router);
app.use('/api/booking', booking_router);
app.use('/api/maintenance', maintenance_router);