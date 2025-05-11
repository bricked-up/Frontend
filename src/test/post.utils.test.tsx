// __tests__/api.simple.test.ts
import { createNewIssue, Result } from "../utils/post.utils";
import {
  createOrganization,
  CreateOrganizationResult,
} from "../utils/post.utils";
import { createProject, CreateProjectResult } from "../utils/post.utils";
import { createTag, TagResult } from "../utils/post.utils";
import { deleteTag, DeleteTagResult } from "../utils/post.utils";

// make TS happy
declare const global: any;

beforeEach(() => {
  global.fetch = jest.fn();
});

describe("createNewIssue", () => {
  it("returns 201 on success", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 201,
    });

    const res: Result = await createNewIssue(
      { name: "x", description: null, priority: 1, cost: 0 },
      "issues"
    );
    expect(res.status).toBe(201);
  });

  it("returns 400 on failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => "Bad payload",
      statusText: "Bad Request",
    });

    const res = await createNewIssue(
      { name: "x", description: null, priority: 1, cost: undefined },
      "issues"
    );
    expect(res.status).toBe(400);
  });
});

describe("createOrganization", () => {
  it("returns 201 on success", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 201,
    });

    const res: CreateOrganizationResult = await createOrganization(
      { name: "Org", projects: ["p1"] },
      "orgs"
    );
    expect(res.status).toBe(201);
  });

  it("returns 500 on failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => JSON.stringify({ message: "DB error" }),
      statusText: "Internal Server Error",
    });

    const res = await createOrganization({ name: "Org" }, "orgs");
    expect(res.status).toBe(500);
  });
});

describe("createProject", () => {
  it("returns 201 on success", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 201,
    });

    const res: CreateProjectResult = await createProject(
      {
        name: "Proj",
        orgId: 1,
        tag: "v1",
        budget: 100,
        charter: "ch",
        archived: false,
        members: ["a"],
        issues: [],
      },
      "projects"
    );
    expect(res.status).toBe(201);
  });

  it("returns 400 on failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => "Invalid data",
      statusText: "Bad Request",
    });

    const res = await createProject(
      {
        name: "Proj",
        orgId: 1,
        tag: "v1",
        budget: 100,
        charter: "ch",
        archived: false,
      },
      "projects"
    );
    expect(res.status).toBe(400);
  });
});

describe("createTag", () => {
  it("returns 201 on success", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 201,
    });

    const res: TagResult = await createTag(
      { sessionId: 10, projectId: 2, name: "bug", color: "#f00" },
      "create-tag"
    );
    expect(res.status).toBe(201);
  });

  it("returns 400 on failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => JSON.stringify({ message: "Invalid session" }),
      statusText: "Bad Request",
    });

    const res = await createTag(
      { sessionId: 0, projectId: 2, name: "bug", color: "#f00" },
      "create-tag"
    );
    expect(res.status).toBe(400);
  });
});

describe("deleteTag", () => {
  it("returns 200 on success", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
    });

    const res: DeleteTagResult = await deleteTag(
      { sessionId: 10, tagId: 5 },
      "delete-tag"
    );
    expect(res.status).toBe(200);
  });

  it("returns 403 on failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 403,
      text: async () => "Forbidden",
      statusText: "Forbidden",
    });

    const res = await deleteTag(
      { sessionId: 10, tagId: 999 },
      "delete-tag"
    );
    expect(res.status).toBe(403);
  });
});