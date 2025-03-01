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

- [x] setup terraform for aws
  - [x] create
    - [x] ec2 instance
    - [x] vpc
    - [x] security group
    - [x] rds database
    - [x] ecr
    - [x] policies
  - [x] remove hardcoded db credentials (use ssm parameter store)
    - [x] add rds credentials to .env
  - [x] terraform plan and apply
- [ ] implement database schema on rds
  - [ ] get .pem to access ec2
  - [ ] connect to rds from ec2
  - [ ] run goose migrations
- [ ] dockerfile to build and run application
- [ ] github actions workflow to build and run application
  - [ ] workflow to build and push docker image to aws ecr
  - [ ] workflow to deploy server in ec2
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
- [x] dockerfile to run application
- [x] workflow to build and push docker image to aws ecr

