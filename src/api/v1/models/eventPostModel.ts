export type EventStatus = "active" | "cancelled" | "completed";
export type EventCategory = "general" | "conference" | "workshop" | "meetup";

export interface events {
    id: string;
    name: string;
    date: Date;
    capacity?: number;
    registrationCount: number;
    status: EventStatus;
    category: EventCategory;
    createdAt: Date;
    updatedAt: Date;
}
