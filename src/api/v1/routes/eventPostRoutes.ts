import express from "express";
import { validateRequest } from "../middleware/validate";
import * as postController from "../controllers/eventControllers";
import { postSchemas } from "../validation/eventPostSchemas";




const router = express.Router();
/**
 * @openapi
 * /users:
 *   post:
 *      summary: Create a new user account
 *      tags: [Users]
 *      requestBody:
 *      required: true
 *   content:
 *      application/json:
 *          schema:
 *              type: object
 *              required:
 *              - name
 *              - email
 *   properties:
 *      name:
 *        type: string
 *        minLength: 3 
 *        maxLength: 100
 *        example: "Sample Event"
 *      date:
 *        type: string
 *        format: date-time
 *        example: "2024-12-31T23:59:59Z"
 *      capacity:
 *        type: integer
 *        minimum: 5
 *        example: 50
 *      registrationCount:
 *        type: integer
 *        minimum: 0
 *        maximum: 100
 *        example: 20
 *      status:
 *        type: string
 *        enum: [active, cancelled, completed]
 *      default: active
 *  responses:
 *      '201':
 *      description: Event created successfully
 *   content:
 *      application/json:
 *   schema:
 *   $ref: '#/components/validations/Event'
 *      '400':
 *      description: Invalid input data
 *      content:
 *          application/json:
 *              schema:
 *             $ref: '#/components/validations/Error'
 */
router.post("/", validateRequest(postSchemas.create), postController.createPostHandler);

/**
 * @openapi
 * /users:
 *   get:
 *   summary: Retrieve a list of all users
 *      tags: [Users]
 *      responses:
 *          '200':
 *          description: Successfully retrieved the list of users
 *          content:
 *          application/json:
 *          schema:
 *          type: array
 *          items:
 *          $ref: '#/components/validations/User'
 */
router.get("/", postController.getAllPostsHandler);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *   summary: Retrieve a user by ID
 *     tags: [Users]
 *    parameters:
 *    - name: id
 *     in: path
 *     required: true
 *     schema:
 *       type: string
 *       format: uuid
 *     description: Unique identifier of the user to retrieve
 *   responses:
 *   '200':
 *   description: User retrieved successfully
 *   content:
 *      application/json:
 *      schema:
 *   $ref: '#/components/validations/User'
 *      '404':
 *   description: User not found
 *   content:
 *      application/json:
 *      schema:
 *   $ref: '#/components/validations/Error'
 */
router.get("/:id", validateRequest(postSchemas.getById), postController.getPostByIdHandler);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *    tags: [Users]
 *  parameters:
 *    - name: id
 *    in: path
 *    required: true
 *    schema:
 *      type: string
 *      format: uuid
 *    description: Unique identifier of the user to update
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/validations/User'
 *   responses:
 *     '200':
 *       description: User updated successfully
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/validations/User'
 *     '400':
 *       description: Invalid input data
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/validations/Error'
 *     '404':
 *       description: User not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/validations/Error'

 */
router.put("/:id", validateRequest(postSchemas.update), postController.updatePostHandler);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *      summary: Delete a user by ID
 *          tags: [Users]
 *      parameters:
 *          - name: id
 *          in: path
 *      required: true
 *      schema:
 *          type: string
 *      format: uuid
 *      description: Unique identifier of the user to delete
 * responses:
 *    '204':
 *      description: User deleted successfully
 *    '404':
 *      description: User not found
 *      content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/validations/Error'
 */
router.delete("/:id", validateRequest(postSchemas.delete), postController.deletePostHandler);

export default router;