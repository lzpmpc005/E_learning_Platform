# Individual Project E_Learning_Platform

## Project Details

#### Name

- collegeX

#### structure

- Frontend
  - next.js
- Backend
  - User Manage Server: Django
    - Authentication Method: jwt
  - Content Manage Server: undecided
  - Analysis Server: undecided
- Database
  - Postgresql

## Development Log

### 21/03/2024

- start next.js frontend project
  - can't run initial server with  
    `npx create-next-app@13.4.12`
  - fix the problem with  
    `npx create-next-app@latest`
  - also install  
    `npx shadcn-ui@latest init`

### 22/03/2024

- start backend authentication project with Django and Postgresql
  - Set up Djoser for basic authentication features
  - Custom User Model in Django
  - Set up Postgresql database and connect with Django project
  - Set up CORS Headers and middleware in Django settings.py for cross origen requests
  - Test Djoser Endpoint

### 23/03/2024

- Continue Authentication Server
  - Customize Authentication and Authorization behaviors of Djoser, including email template
  - Test customized endpoints
  - Set up Social Authentication
    - Set up and customize Google OAuth2
    - Test Google OAuth2
    - Set up Github OAuth2
    - Test Github OAuth2
      - encounter verify error : failed to retrieve user after login
      - find out the reaseon is the user is_active wasn't set to true because of some conflict
      - initialize the database and login with Github, problem solved
    - Run project in Docker
      - Failed to build because psycopg2 can't be installed
        - Two ways to fix this:  
          (1) install gcc and other dependcies that psycopg2 rely on to install
          (2) install psycopg2-binary instead
        - Installed both psycopg2 and psycopg2-binary for testing, but when tried to uninstall psycopg2 or psycopg2-binary, connection error occured. The reason turned out to be uninstall either package will actually uninstall the core package and leave the remaining one incomplete
        - Fix this by uninstall both packages, then install psycopg2-binary
      - Success build image but fail to connect database because in Django settings.py database host was set to "localhost" which can't be recognized by Docker, fix by set host to "db"
      - Excute  
        `docker-compose run web python manage.py makemigrations`  
        `docker-compose run web python manage.py migrate`  
        `docker-compose up`

### 24/03/2024

- Set up Redux Toolkit for sending requests and fetching data from server and also install other packages for styles and components

  ```npm install --save @reduxjs/toolkit react-redux
  npm install --save async-mutex
  npm install --save @tailwindcss/forms
  npm install --save react-toastify
  npm install --save react-icons
  npm install --save classnames
  npm install @headlessui/react --save
  npm install --save @heroicons/react
  ```

- Build Account Registraion and Activation forms
- Adjust authentication server settings to match activation url inside activation email
- Build Login Form
- Still have cross origen block issue because I set samesite=none in server, and Chrome/Edge will require the cookie to have secure property of true and have a SSL connection, so it has to go throught https, even on localhost.
  - Solve this problem by using FireFox browser (Safari also works)
- Change project name from X-Learn to collegeX

### 25/03/2024

- after restarting the computer and docker container for authentication server, I got two errors
  - database connection error, that's because I didn't start the local postgresql server, the problem was solved by starting the local database server, but I think docker may have it's own server in the container, need to do more research
  - FireFox has block cross origen request issue too and register function which also works in Edge doesn't work now. I stopped the container and run the django server in terminal and solved the problem temprarily, but I still don't understand what's really going on.
- Modified Navbar and Footer
- Implement Password Reset Logic and Components
- Implement Authentication with Google and Github
  - customize google/github login buttons
  - add google/github buttons in register page
    - if already registered with an email and the google or github account is the same email, will cause error
    - while click login, first pop out the error message than successfully login, fix this by manage useRaf.current status
- Tried to run in production mode, got an interesting error that the server can't maintain login status properly like in development mode, fix by modify sotre function

### 26/03/2024

- continue with frontend
- work on sidebar and navbar, modify to adapt different devices
  - ⨯ Error: The default export is not a React Component in page: "/"
    - Reason: forgot to export default component when create a new Layout
  - tried to create a login button and will turn into a drop down menu after login. After two hours, Failed to change the login button to username because my previous authentication settings, will try again in the future
  - created sidebar for teacher mode(Courses and Analytics) and explore mode(Dashboard and Explore)
  - created Courses create form
  - research on backend server for content management, decide to use express.js framework and prisma package to interact with database which will run in docker, for analytics server, it will be C++ or Django also

### 27/03/2024

- can only use postgre default database and credentials in docker, don't know how to customize it yet
