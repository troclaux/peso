# Peso

![CI Status Badge](https://github.com/troclaux/peso/actions/workflows/ci.yml/badge.svg)
![CD Status Badge](https://github.com/troclaux/peso/actions/workflows/cd.yml/badge.svg)

> Full-stack web app that stores workout routines for users, applying DevOps tools for deployment and infrastructure management

- front end
  - react.js
    - next.js
  - tailwind css
  - shadcn
  - lucide
- back end
  - node.js
  - postgresql
- ci/cd
  - github actions
  - docker
  - terraform
- aws
  - ec2
  - rds
  - vpc
  - ecr
  - cloudwatch

## kanban

### to do

- [ ] add exercises by users

- [ ] add tests
- [ ] workflow to run tests
- [ ] add layout buttons for mobile screens

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
      - [x] install docker and docker-compose
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
- [x] pass env vars to aws parameter store or secrets manager in terraform file (without hardcoding them)
- [x] implement Dockerfile to run the application and nginx
- [x] add iam policy to give ec2 intance access to aws secrets manager variables
  - [x] create policy
  - [x] attach policy to iam role (if one already exists, if not make a new one)
  - [x] add role to ec2
  - [x] verify if ec2 has access to parameter store
- [x] make nginx + next.js deployment work locally
- [x] get domain (pesodevops.com)
- [x] script to deploy on ec2
- [x] workflow pushes container images to ecr repo
- [x] fix google authentication bug
- [x] deploy app in ec2 instance without tls certificates
- [x] deploy app in ec2 instance with tls certificates
- [x] docker pull from ecr
  - `aws ecr get-login-password --region sa-east-1 | docker login --username AWS --password-stdin 072216710152.dkr.ecr.sa-east-1.amazonaws.com`
- [x] make registered domain point to your ec2 instance's public ip
  - [x] add records to the hosted zone
  - records contain information about how to route traffic for your domain and any subdomains
- [x] docker-compose for local development environment
  - [x] setup ec2 t2.small
  - [x] register domain
  - [x] make domain point to ec2
  - [x] configure google oauth
- [x] set up cert-manager in nginx container
- [x] fix google authorized redirect uris
- [x] deploy on ec2 with ssh
- [x] deploy with docker-compose
  - [x] sets up next.js app using ecr image
  - [x] sets up nginx as reverse proxy the next.js servers
- [x] make nginx + next.js deployment work in the cloud
- [x] make nginx/docker-compose setup tls certificates automatically
- [x] deploy app with github actions only
- [x] add ci/cd badge
- [x] style profile page

## questions

### unresolved

- check if aws internet gateway is necessary for architecture

### solved

- how do i block a page from unauthorized users in next.js?
  - if you're using auth.js for authentication:
    - front-end: `useSession()`, `if (!session) { redirect("/api/auth/signin?callbackUrl=/exercises"); }`
    - back-end: wrap api function for a specific http verb (e.g. `PUT`, `GET`, etc) with `auth()`
      - e.g. `export const POST = auth(async function POST(req: Request)`
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
- how do i start nginx inside ec2's docker container? docker compose
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
  - install aws cli, docker, docker compose
- how do i get ssl certificate? use certbot
- should i scp to copy my .env vars to ec2 instance or use aws secrets manager?
  - aws secrets manager is safer
- should i use nginx or other aws service to serve as reverse-proxy with my deployment? nginx container
- what is the purpuse of `certbot/www` and `certbot/conf` directory?
  - `certbot/www`: temporary challenge files for domain verification
    - what are challenge files?
      - temporary verification files that certbot creates to prove that you own a domain before issuing an SSL certificate
    - when certbot needs to prove domain ownership, it places challenge files inside this directory
  - `certbot/conf`: stores certbot’s configuration
    - stores SSL certificates and renewal settings
    - after a certificate is issued, the private key, full chain and other related files are stored here
    - when the certificate needs renewal, certbot updates this directory
- how frequently should i renew certificate?
  - Let's Encrypt certificates are valid for 90 days
  - it's recommended to renew them each 60 days
- which ec2 base image should i use? (maybe create container image for it and store in IAM)
  - OS: Ubuntu
- how do i obtain ssl certificate for nginx? `certbot`
- how do i register a domain (pesodevops.com)?
  - route 53
  - register domain
  - set hosted zones to point to registered domain
  - can i do it with only terraform?
    - it's better to register the domain with aws console
    - define records within terraform
- after pushing docker image to ecr, how does ec2 pull it?
  - `aws ecr get-login-password --region sa-east-1 | docker login --username AWS --password-stdin [AWS_ACCOUNT_ID].dkr.ecr.sa-east-1.amazonaws.com`
    - how long does this authentication last? 12 hours
    - does it work inside ec2 instance? how?
      - yes
- how should i add my .env to aws secrets manager? terraform variables in `terraform.tfvars` that are initialized in `main.tf`
- how do i create a domain for my website? register desired domain with aws route 53

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
  - delete `docker-compose.yml` in ec2 instance
  - copy `docker-compose.yml` to ec2 instance
  - get credentials
  - run `docker-compose down`
  - run `docker-compose up -d`
