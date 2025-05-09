/**
 * Represents an organization entity with identifying information,
 * a descriptive field, and associated members and projects.
 *
 * @interface Organization
 */
export interface Organization {
  /**
   * Unique identifier for the organization.
   *
   * @type {string}
   */
  id: string;

  /**
   * Human-readable name of the organization.
   *
   * @type {string}
   */
  name: string;

  /**
   * Detailed description or overview of the organization's purpose or scope.
   *
   * @type {string}
   */
  description: string;

  /**
   * List of member IDs associated with the organization.
   *
   * @type {string[]}
   */
  members: string[];

  /**
   * List of project IDs owned or managed by the organization.
   *
   * @type {string[]}
   */
  projects: string[];
}
