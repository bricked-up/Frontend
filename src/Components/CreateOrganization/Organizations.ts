import { Organization } from './Organization';
import { addOrganizationToStore, getOrganizationsFromStore, updateStore } from './OrganizationStore';
import { ulid } from 'ulid'; // Make sure you install ulid: npm install ulid

export const createOrganization = (name: string, description: string): Organization => {
  const newOrganization: Organization = {
    name,
    description,
  };

  addOrganizationToStore(newOrganization);
  return newOrganization;
};

export const getAllOrganizations = (): Organization[] => {
  return getOrganizationsFromStore();
};

