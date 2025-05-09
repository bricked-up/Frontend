# Getting Started

This is the repo for the frontend. We are using `React` and `Typescript`. The main entry point is found
This is the repo for the frontend. We are using `React` and `Typescript`. The main entry point is found
int the index.tsx file but the actual code begins in the App.tsx. Please note that the App.tsx should
only be used for routing and global context wrappers. 

to get started run the following commands if you are on Linux/MacOs.

```
1.⁠ ⁠npm install --force
1.⁠ ⁠npm install --force
2. rm -rf node_modules package-lock.json
3.⁠ ⁠npm install
```

# Running and all of thats

to run the code please use `npm start` or `npm run start` and it should open a localhost on port
`3000`. The website will automatically update upon saving your files so you do not need to re type ever time.

to test run, `npm test` and it will test any files that have the .test in their file name. 

## Coding style and commenting

please refer to the [requirements](https://github.com/bricked-up/requirements). This also goes for commenting and
PR naming as anything that does not match the expected format will not be accepted. 

# NPM

If you are including a custom third party library, it first must be approved by the other teams members and must
be added **manually** to the package.json. Any changes to the package-lock.json file will be rejected.

# Routing

### All user related
/user/:usrId
    /about         - about the user
    /projects      - list of the projects they are in
    /organizations - list of all the organizations they are in
    /issues        - all the issues the user has assigned to them

### All project related
/project/:projectId
    /users   - all the users in the project
    /issues  - all issues for the given project

### All org related
/organization/:orgId
    /users     - all of the users in the org
    /projects - all of the project in the org
    /issues   - all issues of the organization 

if for example you are in /organization/:orgId/users and click on a user
change the URL to /user/:usrId/about and so on


# documentation of our internal APIs

### All user related
/user/:usrId
    /about         - about the user
    /projects      - list of the projects they are in
    /organizations - list of all the organizations they are in
    /issues        - all the issues the user has assigned to them

### All project related
/project/:projectId
    /users   - all the users in the project
    /issues  - all issues for the given project

### All org related
/organization/:orgId
    /users     - all of the users in the org
    /projects - all of the project in the org
    /issues   - all issues of the organization 

if for example you are in /organization/:orgId/users and click on a user
change the URL to /user/:usrId/about and so on

# documentation of our internal APIs

### All user related
/user/:usrId
    /aboutUser         - about the user
    /projects      - list of the projects they are in
    /organizations - list of all the organizations they are in
    /issues        - all the issues the user has assigned to them

### All project related
/project/:projectId
    /users   - all the users in the project
    /issues  - all issues for the given project

### All org related
/organization/:orgId
    /users     - all of the users in the org
    /projects - all of the project in the org
    /issues   - all issues of the organization 

if for example you are in /organization/:orgId/users and click on a user
change the URL to /user/:usrId/about and so on


# documentation of our internal APIs

### All user related
/user/:usrId
    /aboutUser         - about the user
    /projects      - list of the projects they are in
    /organizations - list of all the organizations they are in
    /issues        - all the issues the user has assigned to them

### All project related
/project/:projectId
    /users   - all the users in the project
    /issues  - all issues for the given project

### All org related
/organization/:orgId
    /users     - all of the users in the org
    /projects - all of the project in the org
    /issues   - all issues of the organization 

if for example you are in /organization/:orgId/users and click on a user
change the URL to /user/:usrId/about and so on


# Application Routes

This section details the frontend routes defined in `App.tsx`. Routes are grouped by their purpose or associated resource.

### Public & Authentication Routes

* `/`:
    * Renders the `LandingPage` component if the user is not logged in.
    * Renders the `Dashboard` component (within the main `Layout`) if the user *is* logged in.
* `/login`: Renders the `Login` component for user sign-in and sign-up.
* `/forgotPwd`: Renders the `ForgotPwd` component for password recovery.
* `/testt`: Renders the `LandingPage` (Likely a temporary route for testing).

### User-Specific Routes (Protected)

These routes are nested under `/user/:userId/`. The `:userId` parameter represents the ID of the user whose information is being accessed.

* `/user/:userId/aboutUser`: Renders the `AboutUser` component, displaying the user's profile information. Requires authentication.
* `/user/:userId/organizations`: (Placeholder/Future Route) Intended to display organizations the user belongs to. Defined within the main `Layout`.
* `/user/:userId/projects`: (Placeholder/Future Route) Intended to display projects the user is involved in. Defined within the main `Layout`.
* `/user/:userId/issues`: (Placeholder/Future Route) Intended to display issues assigned to the user. Defined within the main `Layout`.

### Project-Specific Routes

These routes are nested under `/project/:projectId/`. The `:projectId` parameter represents the ID of the project.

* `/project/:projectId/users`: (Placeholder/Future Route) Intended to display users associated with the project.
* `/project/:projectId/issues`: (Placeholder/Future Route) Intended to display issues within the project.

### Organization-Specific Routes

These routes are nested under `/organization/:orgId/`. The `:orgId` parameter represents the ID of the organization.

* `/organization/:orgId/users`: (Placeholder/Future Route) Intended to display users within the organization.
* `/organization/:orgId/projects`: (Placeholder/Future Route) Intended to display projects belonging to the organization.
* `/organization/:orgId/issues`: (Placeholder/Future Route) Intended to display issues associated with the organization.

### General Protected Routes

These routes require user authentication and are rendered within the main `Layout`.

* `/dashboard`: Renders the main `Dashboard` component after successful login.
* `/viewTeam`: Renders the `ViewTeam` component (Purpose might be viewing project/org teams).
* `/aboutUser`: Renders the `AboutUser` component (Note: This seems duplicative of `/user/:userId/about`; clarification might be needed on its specific use case).
* `/activity`: (Currently Commented Out) Intended to render the `Activity` page component, likely showing recent updates or a feed.
* `/calendar`: (Currently Commented Out) Intended to render the `CalendarPage` component for viewing events or deadlines.

### Error Handling Routes

* `/500`: Renders the `Error500Page` component, displayed for internal server errors.
* `*` (Catch-all): Renders the `Page404` component (within the main `Layout`) for any route not explicitly defined.
# documentation of our internal APIs

run the following command:

`npm run docs`

this will produce all of the documentation and put it in a new folder named *docs*. Then you can just
open the index.html page in your browser and you have access to all of the public functions, types
components and pages!
