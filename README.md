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

- [x] implement Dockerfile to run the application and nginx
- [ ] push ci/cd workflow
  - [x] ssh into ec2
  - [x] pull docker image from ecr
  - [x] setup kubernetes to run nginx and next app
    - sets up next.js app using ecr image
    - sets up nginx as reverse proxy the next.js servers
- [ ] install k3s and kubectl on ec2
- [ ] add tests
- [ ] workflow to run tests
- [ ] add ci/cd badge

- how do i configure nginx?
  - use docker container for it
  - do i change my current image (node.js official)?
- how do i setup dns?
- how do i setup dns in docker container?
  - do i need to expose a port besides 3000 (next.js)?
- do i setup kubernetes with nginx as reverse proxy or do i just push to something simpler

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
- [x] define env vars to create infrastructure
- [x] setup terraform file for aws IaC
  - [x] create
    - [x] ec2 instance (don't forget to create it with a key-pair)
      - [x] install docker and kubernetes
    - [x] vpc
    - [x] security groups
    - [x] rds database
    - [x] ecr
    - [x] policies
  - [x] terraform plan and apply
- [x] implement dockerfile to build and run application
- [x] implement github actions workflow to build and push docker image to ecr
  - [x] workflow to build and push docker image to aws ecr
  - [x] workflow to deploy server in ec2
- [x] implement database schema on rds
  - [x] get access ec2
  - [x] configure ec2
    - [x] install postgres client on ec2: `sudo yum install postgresql -y`
    - [x] install docker on ec2: `sudo yum update -y && sudo yum -y install docker`
    - [x] start docker service on ec2: `sudo service docker start`
    - [x] access rds database: `psql -h host_url.region.rds.amazonaws.com -U myuser -d db_name -p db_port` (creates database if it doesn't exist)
  - [x] apply schema in rds with goose using .env vars
  - [x] run database migrations
- [x] implement `nginx.conf` with the following requirements:
  - reverse proxy for next.js full-stack dynamic web app that connects to an rds postgresql database
  - update domain's DNS record to point to ip address where app is hosted (ec2's docker container)

