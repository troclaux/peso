# Peso

full-stack web project that stores workout routines for users

- stack
  - front-end
    - next.js (react.js)
  - back-end
    - node.js
    - express.js
    - postgresql
  - ci/cd
    - github actions
  - terraform?
  - aws
    - ec2
    - rds

- in this project, I'm learning:
  - react.js
  - next.js
  - node.js
  - express.js
  - postgresql
  - goose
  - github actions
  - docker
  - aws
    - ec2
    - rds

## backlog

- refresh api
  - input: http-only cookie with refresh token
  - output: new access token

- [ ] `/app/api/auth/[...all]/route.ts` what does the `...all` mean?

<!-- - [ ] how do i get the refresh token from the http-only cookie? -->
<!-- - [ ] add middleware to make a request to renew refresh token if 401 status code -->
<!-- - [ ] how do i always check if the access token isn't expired? -->
<!--   - add middleware to check if the access token is expired -->
<!--   - [ ] if access token isnt expired, how do i make the application automatically renew the access token? -->
<!--     - i know that i can use the refresh token to get a new access token, but how will the application automatically do this? -->


- [x] create basic ci
- [x] define database schema
- [x] setup postgresql database with goose
- [x] implement endpoint to create a user
- [x] back-end route to login
- [x] login page
  - [x] implement interface
  - [x] integrate login page with back-end
    - [x] check if client makes the correct request
    - [x] client must store access token
    - [x] login must always create new refresh token
    - [x] delete old refresh tokens from the database
    - [x] if refresh token is present and valid, front end must use it to get a new access token
    - [x] after successful login, redirect to workouts page
- [x] route to refresh access token
- [x] endpoint delete user
- [x] endpoint refresh an access token
- [x] bash script testing delete user => create user => login

- [ ] how do i create a login form?
- [ ] how do i add social providers? google and microsoft specifically
- [ ] how do i store credentials?
- [ ] how do i define which pages require credentials?
- [ ] what is ...
- [ ] 
- [ ] 
- [ ] 



back-end:

- [x] refresh route
- [ ] delete user
- [ ] login route
- [ ] create workout
- [ ] update workout
- [ ] delete workout
- [ ] get all workouts for a specific user
- [ ] add exercise to list of saved exercises
- [ ] admin tasks
  - [ ] delete exercise
  - [ ] delete user
- [ ] update user
  - [ ] update user's password
  - [ ] update user's login

front-end:

- [ ] login page
- [ ] sign up page
- [ ] update user page
- [ ] create workout page
  - [ ] add exercises to workout
- [ ] update workout

ci:

- [ ] dockerfile to build project
- [ ] workflow to run tests
- [ ] workflow to push docker image
- [ ] workflow to push to ec2

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
