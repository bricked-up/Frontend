# Getting Started

This is the repo for the frontent. We are using `React` and `Typescript`. The main entry point is found
int the index.tsx file but the actual code begins in the App.tsx. Please note that the App.tsx should
only be used for routing and global context wrappers. 

to get started run the following commands if you are on Linux/MacOs.

```
1.⁠ ⁠npm install --force
2. rm -rf node_modules package-lock.json
3.⁠ ⁠npm install
```

# Running and all of that

to run the code please use `npm start` or `npm run start` and it should open a localhost on port
`3000`. The website will automatically update upon saving your files so you do not need to re type ever time.

to test run, `npm test` and it will test any files that have the .test in their file name. 

## Coding style and commenting

please refere to the [requirements](https://github.com/bricked-up/requirements). This also goes for commenting and
PR naming as anything that does not match the expected format will not be accepted. 

# NPM

If you are including a custom third party library, it first must be approved by the other teams members and must
be added **manually** to the package.json. Any changes to the package-lock.json file will be rejected.

# documentation of our interal APIs

TODO:()
