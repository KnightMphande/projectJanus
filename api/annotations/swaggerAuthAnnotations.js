// ########################## Register ##########################
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new customer
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Knight
 *               lastName:
 *                 type: string
 *                 example: Mavimbela
 *               phone:
 *                 type: string
 *                 example: "065498076"
 *               email:
 *                 type: string
 *                 example: "knight@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Mypass@123!"
 *               street:
 *                 type: string
 *                 example: "123 Main St"
 *               city:
 *                 type: string
 *                 example: "Cape Town"
 *               province:
 *                 type: string
 *                 example: "Western Cape"
 *               zipCode:
 *                 type: string
 *                 example: "8000"
 *               country:
 *                 type: string
 *                 example: "South Africa"
 *     responses:
 *       200:
 *         description: Customer registered successfully
 *       400:
 *         description: Missing required fields or invalid input
 *       409:
 *         description: User already exist, please login.
 *       500:
 *         description: Internal Server Error
 */

/// ########################## Login ##########################
/**
 * @swagger
 * /api/auth/login/{role}:
 *   post:
 *     summary: Login both customer and admin
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [customer, admin]
 *         description: Specify the role for login (customer or admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@email.com"
 *               password:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Login successfully
 *         headers:
 *           Set-Cookie:
 *             description: JWT token for authentication
 *             type: string
 *             example: "access_token=Bearer your_jwt_token; HttpOnly; Secure"
 *       400:
 *         description: Missing required fields or invalid input
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
export default {};
