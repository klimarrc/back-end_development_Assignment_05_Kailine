import { db } from "../../../../config/firebaseConfig";
import { EventCategory, events, EventStatus } from "../models/eventPostModel";
import * as firestoreRepository from "../repositories/firestoreRepository";
const COLLECTION = "posts";

export const createEventPost = async (postData:
    {
        name: string,
        capacity: number,
        registrationCount: number,
        date: Date,
        status: EventStatus,
        category: EventCategory
    }): Promise<events> => {


    try {
        const count = (await db.collection(COLLECTION).get()).size;
        const id = `evt_${String(count + 1).padStart(6, "0")}`;

        const newEventPost = {
            id,
            ...postData,
            date: new Date(postData.date),
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        await firestoreRepository.createEventDocument<events>(COLLECTION, newEventPost);
        return newEventPost;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to create post: ${errorMessage}`
        );
    }
};

export const getAllEventPosts = async (): Promise<events[]> => {
    try {
        const posts = await firestoreRepository.getAllEventDocuments<events>(COLLECTION);
        return posts;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to get all posts: ${errorMessage}`
        );
    }
};

export const getPostById = async (id: string): Promise<events> => {
    try {
        const post = await firestoreRepository.getEventDocumentById<events>(COLLECTION, id);
        if (!post) {
            throw new Error("Post not found");
        }
        return post;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to get post by ID: ${errorMessage}`
        );
    }
};

export const updatePostEvent = async (postData:
    {
        id: string,
        name: string,
        capacity: number,
        registrationCount: number,
        date: Date,
        status: EventStatus,
        category: EventCategory
    }): Promise<events> => {
    try {
        const updatedEventPost: Partial<events> = {};
        if (postData.id !== undefined) {
            updatedEventPost.id = postData.id;
        }
        if (postData.name !== undefined) {
            updatedEventPost.name = postData.name;
        }
        if (postData.capacity !== undefined) {
            updatedEventPost.capacity = postData.capacity;
        }
        if (postData.registrationCount !== undefined) {
            updatedEventPost.registrationCount = postData.registrationCount;
        }
        if (postData.date !== undefined) {
            updatedEventPost.date = new Date(postData.date);
        }
        if (postData.status !== undefined) {
            updatedEventPost.status = postData.status;
        }
        if (postData.category !== undefined) {
            updatedEventPost.category = postData.category;
        }

        if (Object.keys(updatedEventPost).length === 0) {
            throw new Error("No valid fields provided for update");
        }

        updatedEventPost.updatedAt = new Date();

        await firestoreRepository.updatePostEventDoc<events>(
            COLLECTION,
            postData.id,
            updatedEventPost);


        const updatedPost = await firestoreRepository.getEventDocumentById<events>(COLLECTION, postData.id);
        if (!updatedPost) {
            throw new Error("Post not found after update");
        }
        return updatedPost;

    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to update post: ${errorMessage}`
        );
    }
};

export const deletePostEvent = async (id: string): Promise<void> => {
    try {
        await firestoreRepository.deletePostEventDoc(COLLECTION, id);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to delete post: ${errorMessage}`
        );
    }
};
