// project.utils.test.ts
import { archiveProject } from './project.utils';
import fetchMock from 'jest-fetch-mock';
import { API_BASE } from '../config'; 


beforeEach(() => {
  fetchMock.resetMocks(); // Reset fetch mock before each test
});

describe('archiveProject', () => {
  it('should send a POST request to the correct endpoint with the projectId', async () => {
    // Mock the backend response
    fetchMock.mockResponseOnce('', { status: 200 });

    const projectId = 'proj-123';
    
    // Act: Call the function
    const status = await archiveProject(projectId);

    // Assert: Check if the correct endpoint was hit
    expect(fetchMock).toHaveBeenCalledTimes(1); // Check that fetch was called
    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE}/archive-proj`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: expect.any(URLSearchParams),
    });

    // Assert: Check that the returned status is correct
    expect(status).toBe(200);
  });

  it('should return 500 if fetch fails', async () => {
    // Mock fetch to simulate a failure
    fetchMock.mockRejectOnce(new Error('Network error'));

    const status = await archiveProject('proj-123');

    // Assert: Check that the function returns a 500 status on failure
    expect(status).toBe(500);
  });
});
