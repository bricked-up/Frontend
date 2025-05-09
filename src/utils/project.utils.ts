/**
 * Archives a project by sending a POST request to the backend.
 *
 * The backend route is `/archive-proj` as defined in endpoints.go.
 * Requires projectId in the request body (x-www-form-urlencoded).
 *
 * Response codes:
 * - 200: Success
 * - 400/401/500: Failure
 *
 * @param {string} projectId - The ID of the project to archive.
 * @returns {Promise<number>} - The HTTP response status code.
 */

export const archiveProject = async (projectId: string): Promise<number> => {
    try {
      const params = new URLSearchParams({ projectId });
  
      const response = await fetch("/archive-proj", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      });
  
      return response.status;
    } catch (error: any) {
      console.error("Error archiving project:", error);
      return 500;
    }
  };
  