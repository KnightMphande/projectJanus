import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import client from "./configs/db.configs.js";
import cors from "cors";
import auth_router from "./routes/auth.routes.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerui from "swagger-ui-express";
import vehicle_router from "./routes/vehicle.routes.js";

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

// Router level middlewares
app.use('/api/auth', auth_router);
app.use('/api/vehicle', vehicle_router);