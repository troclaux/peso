# Peso

> full-stack web project that stores workout routines for users

- front-end
  - next.js (react.js)
  - tailwindcss
  - shadcn
  - lucide
- back-end
  - node.js
  - express.js
  - postgresql
- ci/cd
  - github actions
  - docker
  - terraform
- aws
  - ec2
  - rds
  - cloudwatch

## kanban

### to do

- [ ] implement dockerfile to build project
- [ ] workflow to build and push docker image to dockerhub
- [ ] workflow to deploy server in ec2
- [ ] setup terraform for aws
  - [ ] terraform to create ec2 instance and rds database
  - [ ] apply terraform
- [ ] add tests
- [ ] workflow to run tests
- [ ] add ci/cd badge

### done

- [x] add lint workflow
- [x] choose auth provider (auth.js)
- [x] install and setup auth.js
- [x] define and implement database schema
- [x] setup postgresql database with goose
- [x] sign up page
- [x] log in page
- [x] add log in and sign out buttons in layout
- [x] block unauthorized users from accessing pages that require authentication
- [x] api post exercise
- [x] api get exercises
- [x] api put exercise
- [x] api delete exercise
- [x] test api endpoints with curl
- [x] create exercise page
  - [x] component exercises list
  - [x] create exercise button
  - [x] delete exercise button
  - [x] edit exercise button
- [x] api post workout
  - [x] exercises search box
  - [x] add exercise to workout
  - [x] remove exercise from workout
- [x] api get workouts
- [x] api put workout
  - [x] delete exercise from current workout
  - [x] change exercise order from workout
- [x] api delete workout
- [x] test api endpoints with curl
- [x] workout components
  - [x] workout list
  - [x] form to create and edit workout
- [x] workout page
