import express from "express";
import { validateRequest } from "../middleware/validate";
import * as postController from "../controllers/eventControllers";
import { postSchemas } from "../validation/eventPostSchemas";



const router = express.Router();

// Create post - validates body only
router.post("/", validateRequest(postSchemas.create), postController.createPostHandler);
router.get("/", postController.getAllPostsHandler);
router.get("/:id", validateRequest(postSchemas.getById), postController.getPostByIdHandler);
router.put("/:id", validateRequest(postSchemas.update), postController.updatePostHandler);
router.delete("/:id", validateRequest(postSchemas.delete), postController.deletePostHandler);

export default router;