import { Organization } from './Organization';

const organizationStoreName = 'organizations';

const getFromStore = (storeName: string) => {
  const store = localStorage.getItem(storeName);
  if (store) {
    return JSON.parse(store);
  }
  return null;
};

export const updateStore = (storeName: string, data: any) => {
  localStorage.setItem(storeName, JSON.stringify(data));
};

export const addOrganizationToStore = (organization: Organization) => {
  let organizations: Organization[] = [];

  const store = getFromStore(organizationStoreName);
  if (store) {
    organizations = store;
  }
  organizations.push(organization);
  updateStore(organizationStoreName, organizations);
  return true;
};

export const getOrganizationsFromStore = (): Organization[] => {
  let organizations: Organization[] = [];

  const store = getFromStore(organizationStoreName);
  if (store) {
    organizations = store;
  }
  return organizations;
};