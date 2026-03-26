export interface Apiresponse<T> {
    message?: string;
    data?: T;
    error?: string;
    code?: number;
  } 

  export const successResponse = <T>(
    data: T, message?: string
  ): Apiresponse<T> => ({
    message,
    data,
   
  });