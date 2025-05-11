// __tests__/api.simple.test.ts
import { createNewIssue, Result } from "../utils/post.utils";
import {
  createOrganization,
  CreateOrganizationResult,
} from "../utils/post.utils";
import { createProject, CreateProjectResult } from "../utils/post.utils";

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
        priority: 1,
        cost: 0,
        created: "2025-04-26T00:00:00Z",
        completed: "2025-04-27T00:00:00Z",
      }),
    });

    const res: Result = await createNewIssue(
      { title: "x", priority: 1, projectid: 2, tagid: 2 },
      "issues"
    );
    expect(res.status).toBe(201);
  });

  it("returns error on non-2xx", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => "Bad payload",
      statusText: "Bad Request",
    });

    const res = await createNewIssue(
      { title: "x", priority: 1, projectid: 2, tagid: 2 },
      "issues"
    );
    expect(res.status).toBe(400);
    expect(res.error).toMatch(/Bad payload|Bad Request/);
  });
});

describe("createOrganization", () => {
  it("parses org on success", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ id: 10, name: "Org", projects: ["p1"] }),
    });

    const res: CreateOrganizationResult = await createOrganization(
      { name: "Org", projects: ["p1"] },
      "orgs"
    );
    expect(res.status).toBe(201);
    expect(res.organization?.id).toBe(10);
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
        tag: "v1",
        budget: 100,
        charter: "ch",
        archived: false,
        members: ["a"],
        issues: [],
      }),
    });

    const res: CreateProjectResult = await createProject(
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
    expect(res.status).toBe(201);
    expect(res.project?.name).toBe("Proj");
  });
});
