export type TagColor = "blue" | "green" | "amber" | "purple" | "red";

export interface Tag {
    id: string;
    name: string;
    color: TagColor;
}
