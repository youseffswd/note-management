import { beforeEach, describe, expect, it, vi } from "vitest";

import { ResponseError } from "@/shared/lib/errors";

const server = vi.hoisted(() => ({
    addTagToNote: vi.fn(),
    removeTagFromNote: vi.fn(),
}));
vi.mock("@/features/tags/server", () => server);

import { DELETE, POST } from "./route";

const post = (body: unknown) =>
    POST(
        new Request("http://localhost/api/tags-note", {
            method: "POST",
            body: JSON.stringify(body),
        }),
    );

const del = (query: string) =>
    DELETE(
        new Request(`http://localhost/api/tags-note${query}`, {
            method: "DELETE",
        }),
    );

beforeEach(() => {
    vi.resetAllMocks();
});

describe("POST /api/tags-note", () => {
    it("adds the tag to the note and returns 201", async () => {
        const response = await post({ tagId: "t1", noteId: "n1" });

        expect(response.status).toBe(201);
        expect(server.addTagToNote).toHaveBeenCalledWith("t1", "n1");
    });

    it("rejects a body without both ids", async () => {
        const response = await post({ tagId: "t1" });

        expect(response.status).toBe(400);
        expect(server.addTagToNote).not.toHaveBeenCalled();
    });

    it("passes on the status of a ResponseError", async () => {
        server.addTagToNote.mockRejectedValue(
            new ResponseError("Unauthorized", 401),
        );

        const response = await post({ tagId: "t1", noteId: "n1" });

        expect(response.status).toBe(401);
        expect(await response.json()).toEqual({ error: "Unauthorized" });
    });

    it("answers 500 for any other error", async () => {
        server.addTagToNote.mockRejectedValue(new Error("boom"));

        const response = await post({ tagId: "t1", noteId: "n1" });

        expect(response.status).toBe(500);
    });
});

describe("DELETE /api/tags-note", () => {
    it("removes the tag from the note", async () => {
        const response = await del("?tagId=t1&noteId=n1");

        expect(response.status).toBe(200);
        expect(server.removeTagFromNote).toHaveBeenCalledWith("t1", "n1");
    });

    it("rejects a request without both ids", async () => {
        const response = await del("?noteId=n1");

        expect(response.status).toBe(400);
        expect(server.removeTagFromNote).not.toHaveBeenCalled();
    });

    it("passes on the status of a ResponseError", async () => {
        server.removeTagFromNote.mockRejectedValue(
            new ResponseError("Forbidden", 403),
        );

        const response = await del("?tagId=t1&noteId=n1");

        expect(response.status).toBe(403);
    });
});
