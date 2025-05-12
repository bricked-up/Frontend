// __tests__/api.simple.test.ts
import { createNewIssue, Result } from "../utils/post.utils";
import {
  createOrganization,
  CreateOrganizationResult,
} from "../utils/post.utils";
import { createProject, CreateProjectResult,removeProjectMember, removeOrgMember } from "../utils/post.utils";

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
        name: "Test Issue",
        description: null,
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
describe("removeProjectMember", () => {
  it("returns status 200 on successful removal", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => "", // Simulates empty body
    });

    const res = await removeProjectMember(1, 5); // sessionId, memberId
    console.log("removeProjectMember success result:", res);

    expect(res.status).toBe(200);
    expect(res.error).toBeUndefined();
  });

  it("returns status 404 with error message on failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => "Member not found",
      statusText: "Not Found",
    });

    const res = await removeProjectMember(1, 9999);
    console.log("removeProjectMember 404 result:", res);

    expect(res.status).toBe(404);
    expect(res.error).toMatch(/Member not found|Not Found/);
  });

  it("returns status 0 on network error", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network down"));

    const res = await removeProjectMember(1, 5);
    console.log("removeProjectMember network error:", res);

    expect(res.status).toBe(0);
    expect(res.error).toMatch(/Network down/);
  });
});

describe("removeOrgMember", () => {
  it("returns status 200 on successful removal", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => "",
    });
    const res = await removeOrgMember(1, 42); // sessionId, orgMemberId
    console.log("removeOrgMember success result:", res);
    expect(res.status).toBe(200);
    expect(res.error).toBeUndefined();
  });

  it("returns status 404 with error message on failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => "Org member not found",
      statusText: "Not Found",
    });
    const res = await removeOrgMember(1, 9999);
    console.log("removeOrgMember 404 result:", res);
    expect(res.status).toBe(404);
    expect(res.error).toMatch(/Org member not found|Not Found/);
  });

  it("returns status 0 on network error", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network down"));
    const res = await removeOrgMember(1, 42);
    console.log("removeOrgMember network error:", res);
    expect(res.status).toBe(0);
    expect(res.error).toMatch(/Network down/);
  });
});

