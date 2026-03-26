import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

import { MiddlewareFunction } from "../types/expressTypes";
import { HTTP_STATUS } from "../../../constants/httpConstants";

interface RequestSchemas {
    body?: ObjectSchema;
    params?: ObjectSchema;
    query?: ObjectSchema;
}

interface ValidationOptions {
    stripBody?: boolean;
    stripQuery?: boolean;
    stripParams?: boolean;
}
// Middleware to validate request body, params, and query using Joi schemas
export const validateRequest = (
    schemas: RequestSchemas,
    options: ValidationOptions = {}
): MiddlewareFunction => {
    // stripParams - Usually don't strip params as they're route-defined
    const defaultOptions = {
        stripBody: true,
        stripQuery: true,
        stripParams: true,
        ...options,
    };

    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors: string[] = [];

            // Helper function to validate a specific part of the request
            const validatePart = (
                schema: ObjectSchema,
                data: any,
                shouldStrip: boolean
            ) => {
                const { error, value } = schema.validate(data, {
                    abortEarly: false,
                    stripUnknown: shouldStrip,
                });
                if (error) {
                    errors.push(...error.details.map((d) => d.message));
                }

                return shouldStrip ? value : data;
            };

            // Validate each request part if schema is provided
            if (schemas.body) {
                const value = validatePart(schemas.body, req.body ?? {}, defaultOptions.stripBody);
                req.body = value;
            }

            if (schemas.params) {
                const value = validatePart(schemas.params, req.params ?? {}, defaultOptions.stripParams);
                req.params = value;
            }

            if (schemas.query) {
                const value = validatePart(schemas.query, req.query ?? {}, defaultOptions.stripQuery);
                req.query = value;
            }

            if (errors.length > 0) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    error: `Validation error: ${errors.join(", ")}`,
                });
            }

            next();
        } catch (error: unknown) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: (error as Error).message,
            });
        }
    };
};