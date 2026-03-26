import { Request, Response, NextFunction } from "express";
import * as postService from "../services/eventPostService";
import { successResponse } from "../models/responseModel";
import { events} from "../models/eventPostModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";


// Create post handler - validates body only
export const createPostHandler = async (
    req: Request,
    res: Response,  
    next: NextFunction  
): Promise<void> => {
    try{
        const events =await postService.createEventPost(req.body);
        res.status(HTTP_STATUS.CREATED).json(successResponse(events, "Event created"));
    } catch (error: unknown) {
        next(error);
    }
};

export const getAllPostsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const events: events[] = await postService.getAllEventPosts();
        res.status(HTTP_STATUS.OK).json(successResponse(events));
    } catch (error: unknown) {
        next(error);
    }
};

export const getPostByIdHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {id} = req.params;
        const events = await postService.getPostById(id as string);
        res.status(HTTP_STATUS.OK).json(successResponse(events, "Event retrieved successfully"));
    } catch (error: unknown) {
        next(error);    
    }
};

export const updatePostHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {id} = req.params;
        const updatedData = req.body as Partial<events>;
        const updatedPost = await postService.updatePostEvent({ 
            id: id as string,
            name: updatedData.name ?? "",
            capacity: updatedData.capacity ?? 0,
            registrationCount: updatedData.registrationCount ?? 0,
            date: updatedData.date ?? new Date(),   
            status: updatedData.status!,
            category: updatedData.category!
        });
        if (updatedPost) {
            res.status(HTTP_STATUS.OK).json(successResponse(updatedPost, "Event updated successfully"));
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).json(successResponse(null, "Event not found"));
        }
    } catch (error: unknown) {
        next(error);
    }
};

export const deletePostHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {id} = req.params;
        await postService.deletePostEvent(id as string);
        res.status(HTTP_STATUS.OK).json(successResponse(null, "Event deleted successfully"));
    } catch (error: unknown) {
        next(error);
    }
};

