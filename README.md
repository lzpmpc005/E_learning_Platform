# collegeX (E-Learning Platform)

Individual Project for Programing Clinic (LZPMPC005)  
Student Name: Hongtao LI  
Student ID: 39225062

## Table of contents[![](https://raw.githubusercontent.com/aregtech/areg-sdk/master/docs/img/pin.svg)](#table-of-contents)

- [Introduction](#introduction)
- [Installation](#installation)

  - Install Docker
  - Clone the repository
  - Customize env files
  - Build Gateway Server
  - Dockerize the project
  - Run the image in Docker
  - Initialize the project

- [Features](#Features)
- [Contribution](#Contribution)

---

## Introduction[![](https://raw.githubusercontent.com/aregtech/areg-sdk/master/docs/img/pin.svg)](#introduction)

**E Learning Platform**  
This project is a distributed web application for online learning, where users can create courses as teacher or search, purchase and study courses as student. Following is the structure of this project.

- Frontend

  - Next.js

- Gateway

  - Spring Cloud

- Backend

  - Auth Server
    - Django
    - Authentication Method: jwt
  - Content Server
    - Express.js
  - Analysis Server
    - Django
  - Bank Server
    - Express.js

- Database
  - Postgresql

## Installtion[![](https://raw.githubusercontent.com/aregtech/areg-sdk/master/docs/img/pin.svg)](#installation)

### 1. Install Docker

Please refer to  
 https://www.docker.com/products/docker-desktop/

> [!NOTE]
> Remember to start the Docker desktop and keep it running.

### 2. Clone the repository

```bash
git clone https://github.com/lzpmpc005/E_learning_Platform.git
```

### 3. Customize env files

(1) go to "xlearn" directory, create a file named ".env.local" and paste the following inside and save. Remember to change the SECRET and ID to your own.

- For UPLOADTHING_SECRET and ID, just Sign up for uploadthing and create a new app, you will see https://uploadthing.com/dashboard.
- For MUX_TOKEN_ID and SECRET, go to https://www.mux.com/

```bash
NEXT_PUBLIC_HOST=http://localhost:8080
NEXT_PUBLIC_CONTENT_HOST=http://localhost:8080/api
NEXT_PUBLIC_LOGO="/logo.png"

UPLOADTHING_SECRET=Your SECRET
UPLOADTHING_APP_ID=Your ID

NEXT_PUBLIC_MUX_TOKEN_ID=Your ID
NEXT_PUBLIC_MUX_TOKEN_SECRET=Your SECRET
```

(2) go to "auth_system" directory, create a file named ".env.local" and paste the following inside and save. Remember to change the Keys and SECRETs to your own. You don't need Google and Github keys if you don't need Login with Google and Github.

```bash
DEBUG = True

DOMAIN = 'localhost:3000'

EMAIL_HOST_USER = 'change to your email account'
EMAIL_HOST_PASSWORD = 'change to your email password'

GOOGLE_OAUTH2_KEY = "Your Key"
GOOGLE_OAUTH2_SECRET = "Your Secret"

GITHUB_KEY = "Your Key"
GITHUB_SECRET = "Your Secret"
```

> [!NOTE]
> If you don't want to customize you Google and Github key and secret, the login with Google and Github won't work, but the normal login will work fine.

(3) go to "content_server" directory, create ".env" file, paste the following and save. Change Your ID and Your SECRET with your actual Mux ID and SECRET respectively.

```bash
MUX_TOKEN_ID=Your ID
MUX_TOKEN_SECRET=Your SECRET
```

### 4. Build Gateway Server

```bash
cd gateway
mvn clean install
```

### 5. Dockerize the project

```bash
cd E_learning_Platform
docker-compose build
```

> [!NOTE]
> First build could take serveral minutes.

### 6. Run the image in Docker

```bash
dokcer-compose up -d
```

> [!NOTE]
> You may need to manually go to your docker container and restart the containers if something went wrong.

### 7. Initialize the project

```bash
docker-compose exec authsystem python manage.py makemigrations
docker-compose exec authsystem python manage.py migrate
docker exec -it e_learning_platform-xlearnfrontend-1 node ./scripts/initialize.ts
```

## Features[![](https://raw.githubusercontent.com/aregtech/areg-sdk/master/docs/img/pin.svg)](#Features)

1. Auth system

   - Register
     - Activate
   - Login
     - Login with Google/Github
   - Logout
   - Reset Password

2. Course Creation (CRUD)

   - Go to teacher mode after login
   - Name you course and continue
   - Customize your course and complete required fields
   - Publish the course

3. Browser Courses

   - Go to Explore after login
   - Search courses by title in search bar
   - Filter courses by categories

4. Purchase Courses

   - Click course card
   - Check course details and chapter contents
   - Enroll course and Pay

5. Study Courses

   - Find purchased course in Dashboard or Explore page
   - Go to Course details page
   - watch courses video and attachments

6. Check Sells
   - Switch to teacher mode
   - Go to Analytics

---

## Contribution

If you want to contribute or comment on this project, email lihongtaoix7@gmail.com.
