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
  it("parses a successful 2xx response", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        id: 5,
        title: "Test Issue",
        desc: null,
        tagId: null,
        priority: 1,
        cost: 0,
        created: "2025-04-26T00:00:00Z",
        completed: "2025-04-27T00:00:00Z",
        dependencies: [],
        reminders: [],
      }),
    });

    const res: Result = await createNewIssue(
      { name: "x", description: null, priority: 1, cost: 0 },
      "issues"
    );
    expect(res.status).toBe(201);
    expect(res.issue).not.toBeNull();
    expect(res.issue?.id).toBe(5);
  });

  it("returns error on non-2xx", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => "Bad payload",
      statusText: "Bad Request",
    });

    const res = await createNewIssue(
      { name: "x", description: null, priority: 1 },
      "issues"
    );
    expect(res.status).toBe(400);
    expect(res.issue).toBeNull();
    expect(res.error).toMatch(/Bad payload|Bad Request/);
  });
});

describe("createOrganization", () => {
  it("parses org on success", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        id: 10,
        name: "Org",
        projects: ["p1"],
        members: [],
        roles: [],
      }),
    });

    const res: CreateOrganizationResult = await createOrganization(
      { name: "Org", projects: ["p1"] },
      "orgs"
    );
    expect(res.status).toBe(201);
    expect(res.organization?.id).toBe(10);
  });

  it("returns error on non-2xx", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => JSON.stringify({ message: "DB error" }),
      statusText: "Internal Server Error",
    });

    const res = await createOrganization({ name: "Org" }, "orgs");
    expect(res.status).toBe(500);
    expect(res.organization).toBeNull();
    expect(res.error).toBe("DB error");
  });
});

describe("createProject", () => {
  it("parses project on success", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        id: 7,
        name: "Proj",
        orgId: 1,
        budget: 100,
        charter: "ch",
        archived: false,
        members: ["a"],
        issues: [],
        tags: [],
      }),
    });

    const res: CreateProjectResult = await createProject(
      {
        name: "Proj",
        orgId: 1,
        tag: "unused",
        budget: 100,
        charter: "ch",
        archived: false,
        members: ["a"],
        issues: [],
      },
      "projects"
    );
    expect(res.status).toBe(201);
    expect(res.project?.name).toBe("Proj");
  });

  it("returns error on non-2xx", async () => {
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
        tag: "unused",
        budget: 100,
        charter: "ch",
        archived: false,
      },
      "projects"
    );
    expect(res.status).toBe(400);
    expect(res.project).toBeNull();
    expect(res.error).toMatch(/Invalid data|Bad Request/);
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
    expect(res.error).toBeUndefined();
  });

  it("returns error on non-2xx", async () => {
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
    expect(res.error).toBe("Invalid session");
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
    expect(res.error).toBeUndefined();
  });

  it("returns error on non-2xx", async () => {
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
    expect(res.error).toBe("Forbidden");
  });
});
