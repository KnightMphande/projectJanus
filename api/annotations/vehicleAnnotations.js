// vehicleAnnotations.js

/**
 * @swagger
 * tags:
 *   name: Vehicle
 *   description: Vehicle management
 */


// ########################## Add new vehicle ##########################
/**
 * @swagger
 * /api/vehicle:
 *   post:
 *     summary: Add a new vehicle
 *     tags: [Vehicle]
 *     security:
 *       - BearerAuth: []  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               make:
 *                 type: string
 *                 example: "Chevrolet"
 *               model:
 *                 type: string
 *                 example: "Impala"
 *               year:
 *                 type: integer
 *                 example: 2021
 *               mileage:
 *                 type: integer
 *                 example: 1200
 *               color:
 *                 type: string
 *                 example: "Red"
 *               category: 
 *                 type: string
 *                 example: "Sedan"
 *               status:
 *                 type: string
 *                 example: "Available"
 *             required:
 *               - make
 *               - model
 *               - year
 *               - category
 *               - status
 *     responses:
 *       201:
 *         description: Vehicle added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Vehicle added successfully"
 *                 vehicle:
 *                   type: object
 *                   properties:
 *                     vehicle_id:
 *                       type: integer
 *                       example: 14
 *                     make:
 *                       type: string
 *                       example: "Chevrolet"
 *                     model:
 *                       type: string
 *                       example: "Impala"
 *                     year:
 *                       type: integer
 *                       example: 2021
 *                     category:
 *                       type: string
 *                       example: "Sedan"
 *                     status:
 *                       type: string
 *                       example: "Available"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-10-03T21:32:44.333Z"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-10-03T21:32:44.333Z"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Missing required information"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */




// ########################## Add vehicle details ##########################
/**
 * @swagger
 * /api/vehicle/details/{vehicleId}:
 *   post:
 *     summary: Add details for a vehicle
 *     tags: [Vehicle]
 *     security:
 *       - BearerAuth: []  
 *     parameters:
 *       - name: vehicleId
 *         in: path
 *         required: true
 *         description: ID of the vehicle to add details for
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mileage:
 *                 type: integer
 *                 example: 1200
 *               color:
 *                 type: string
 *                 example: White
 *               numberOfSeats:
 *                  type: integer
 *                  example: 4
 *             required:
 *               - mileage
 *               - color
 *               - numberOfSeats
 *     responses:
 *       200:
 *         description: Vehicle details saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   message: "Vehicle details successfully added"
 *                 details:
 *                   type: object
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Missing required information"
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Vehicle not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */




// ########################## Add vehicle features ##########################
/**
 * @swagger
 * /api/vehicle/features/{vehicleId}:
 *   post:
 *     summary: Add features for a vehicle
 *     tags: [Vehicle]
 *     security:
 *       - BearerAuth: []  
 *     parameters:
 *       - name: vehicleId
 *         in: path
 *         required: true
 *         description: ID of the vehicle to add features for
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - features
 *     responses:
 *       200:
 *         description: Vehicle features saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 details:
 *                   type: object
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */




// ########################## Add vehicle features ##########################
/**
 * @swagger
 * /api/vehicle/{vehicleId}:
 *   delete:
 *     summary: Delete a vehicle by ID
 *     tags: [Vehicle]
 *     security:
 *       - BearerAuth: []  
 *     parameters:
 *       - name: vehicleId
 *         in: path
 *         required: true
 *         description: ID of the vehicle to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */




// ########################## Update existing vehicle ##########################
/**
 * @swagger
 * /api/vehicle/{vehicleId}:
 *   put:
 *     summary: Update vehicle information
 *     tags: [Vehicle]
 *     security:
 *       - BearerAuth: []  
 *     parameters:
 *       - name: vehicleId
 *         in: path
 *         required: true
 *         description: ID of the vehicle to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: integer
 *               mileage:
 *                 type: integer
 *               color:
 *                 type: string
 *             required:
 *               - make
 *               - model
 *               - year
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 vehicle:
 *                   type: object
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */





// ########################## Update vehicle details ##########################
/**
 * @swagger
 * /api/vehicle/details/{vehicleId}:
 *   put:
 *     summary: Update vehicle details
 *     tags: [Vehicle]
 *     security:
 *       - BearerAuth: []  
 *     parameters:
 *       - name: vehicleId
 *         in: path
 *         required: true
 *         description: ID of the vehicle to update details for
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mileage:
 *                 type: integer
 *               color:
 *                 type: string
 *             required:
 *               - mileage
 *     responses:
 *       200:
 *         description: Vehicle details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 details:
 *                   type: object
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default {};