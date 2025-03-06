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

- [ ] add environment variables to aws secrets manager
- [ ] allow ec2 to access aws secrets manager
- [ ] use secret to define endpoint for rds
- [ ] make nginx + next.js deployment work locally
- [ ] make nginx + next.js deployment work in the cloud
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

## questions

### unresolved

- after pushing docker image to ecr, how does ec2 pull it?
- how should i add my .env to aws secrets manager?
- how do i setup dns?
- how do i create a domain for my website?

### solved

- how do i block a page from unauthorized users in next.js?
  - if you're using auth.js for authentication:
    - front-end: `useSession()`, `if (!session) { redirect("/api/auth/signin?callbackUrl=/exercises"); }`
    - back-end: wrap api function for a specific http verb (e.g. `PUT`, `GET`, etc) with `auth()`
      - e.g. `export const POST = auth(async function POST(req: Request)`
- should i use k3s on ec2 or eks?
  - eks is simpler, but i will do it in ec2 to learn how to setup kubernetes in a fresh linux machine
- what is the directory structure for components?
  - everything is explained in [next.js docs](https://nextjs.org/docs)
- how do i setup terraform for aws?
  - how do i add my credentials?
    - generate aws access keys, source them in `.env` or store them in aws secrets manager
  - run `terraform init` in project's root directory
- how do i give access between rds and ec2?
  - security groups define which traffic is allowed between aws resources
  - ec2 will also need credentials (connection string) to make requests to rds
- how much should i know about policies?
  - basic structure of the configuration file
  - ID
  - statements
  - effect
  - actions
  - conditions
- how do i configure nginx?
  - implement basic nginx.conf and a Dockerfile that will run nginx
  - do i change my current image (node.js official)?
    - yes, use one image to run next.js and another to run nginx
- how do i start nginx inside ec2's docker container? kubernetes deployment
- how do i run migrations in rds?
  - add your computer to the ingress rules
  - connect to postgresql database using `psql` with credentials
  - migrate with goose
- where do i store each credential? (e.g. aws secrets manager, github secrets, my own computer)
  - aws credentials
  - database credentials
  - google auth credentials
- ec2 setup
  - don't forget to configure security groups in terraform file
  - install aws cli, docker, kubernetes and kubectl (maybe use ansible to setup everything)
- how do i get ssl certificate? use certbot
- should i scp to copy my .env vars to ec2 instance or use aws secrets manager?
  - aws secrets manager is safer

## pseudocode for CI/CD pipelines

- workflow to build and push docker image
  - checkout code
  - configure aws credentials
  - login into aws ecr
  - build and push docker image to ecr
- workflow to pull from github origin and ecr to deploy application
  - ssh into ec2
    - how do i use .pem to ssh into ec2? copy file's content and paste into github's repo secrets
    - how do i pass .env vars to dockerfile securely? aws secrets manager
  - pull container images from ecr
  - run kubernetes with kubernetes files
