# Individual Project E_Learning_Platform

## Project Details

#### Name

- collegeX

#### structure

- Frontend

  - next.js

- Gateway

  - Spring Cloud

- Backend

  - Auth Server: Django
    - Authentication Method: jwt
  - Content Server: Express.js
  - Analysis Server: Django
  - Bank Server: Express.js

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
- run into connection error in prisma studio, can't figure out the reason, but the database works fine with the backend api in the container, perhaps it's just the prisma client settings to connect to database in docker is not correct so it can't connect to the right database
  - figure out that the database_url in .env is for prisma studio connecting to localhost, and the database_url in docker compose.yaml is for prisma in the docker; when docker is running, it blocks the localhost connection other than docker itself. But it should work if I run database in docker first and then connect the prisma studio with the database server in docker, will further test this when I have time.
- When set up base url for axios to connect with content server which is running in localhost:4000, find out "NEXT_PUBLIC" leading environment variable is accessable globally, tried to name it "CONTENT_PUBLIC_HOST" and failed
- CORS issue when send request from frontend to node.js(express) backend, try using cors package, solved
  `npm install cors`
- Find out I have two RootLayout when debug multi body tags rendered, modify the one inside auth
- Modify authentication api to return userId for verification
- Save userId in localStorage until logout
- Retrieve and Pass userId in request body to create course, in order to check if the user is authorized or not
  - decided not to distinguish the user a teacher or not at this point, every user can create course because everyone is an expert on something, but this will be more like a YouTube
- Successfully build an simple create course API with Express and handle the create course request from frontend
- Build fetch course data api and page, stuck for 2h because of a small mistake in the endpoint
- useRouter will direct user to a page but doesn't stop the rest of codes running, need to add a `return;` maybe related to the double verify issue
- get hands on uploadthing for course videos storage

### 28/03/2024

- route.refresh() not working
  - fixed by using location.reload(), but the refresh is not very smooth
- implement course image uploading and updating
- create a node script for creating categories
  `node scripts/createCategories.ts`
  - had to provide the absolute api endpoint in the script, be sure to change it if server host changes
- got a type error when render categories out for choosing, fix tomorrow

### 29/03/2024

- stuck by the type error for 5 hours, after trying many methods, found out it's the bug of latest version of shadcn-ui combobox component, downgrade cmdk version solves the issue, the developer has noticed this and should fix it in next release

```npm uninstall cmdk
   npm install cmdk@0.2.0
```

- got a warning that Popover component from @radix-ui/react-popover doesn't accept a ref prop, it doesn't cause a crash, but I want to resolve it

  - since I am using react-hook-form library in the category-form, it provieds a ref in the field and when I spread the field onto the combobox component, the ref is passed to it, which caused that warning, resolve it by destructuring the field object and excluding ref, haven't seem any side effects for now

- the local storage wasn't cleaned up after logout because I implemented the operation in verify which only called when refresh, fix it

- optimize the toast reminder's postion and message
- created course price update endpoint and frontend
- created attachments update/delete endpoint and frontend
- start creating charpters with hello-pangea/dnd
  - Instead of reloading the entire page, I try to fetch the updated data again, which involves creating another api to return the charpters of the course. This will give a better user experience and I will do this to other forms as well.
- modify JWT token lifetime to 24 hours to avoid frequent login, but it seems not working
  - the setting actually works, it's the verify function causing this
  - I was wrong, because I see the accessid and refreshid expire time and mistaken them as the token lifetime, but they are just cookies. So finally, I need to set JWT token lifetime in the form of datetime object as the official doc indicated

### 30/03/2024

- resolve newly created chapter can only be edited after reload the page
- refresh on chapter page will be redirect to home page
  - fix by redefine page component function
- implement chapter title, description, access setting
- implement chapter video manage with MUX

  - get mux api token id and key
  - install dependencies

    ```npm i @mux/mux-node
       npm i @mux/mux-player-react
    ```

  - first implement mux operation at client side, encounter CORS error, move it to content server
  - set muxplayer rerender after 3 seconds to prevent media download failer

- implement delete chapter endpoint and frontend component
- implement chapter publish/unpublish

### 31/03/2024

- modify course and chapter page components to count completed fields actively after every update
  - modify api endpoints to response with full information of courses and chapters
- optimize error handler to give more specific error message
- main endpoints file grows too big, split into separated files, more organized
- implement course publish/unpublish
- add a confetti effect when publish course
- implement course list table inside teacher dashboard with sort and filter and also direct access to edit s specif course
- build explore page for published courses
  ```npm i quert-string
     npm i react-icons
  ```
  - implement filter by search title (contain) only or together with category, category choice will reserve after refresh, but search title will be reset
  - create course card to display course details
    - if purchased, show progress, otherwise, show price
- build course inside components
  - something wrong with fetch course based on id, fix tomorrows

### 01/04/2024

- fix fetch course in course detail page

- encounter internal error when delete a course, figure out the reason is I accidently delete it's video in my mux account manually, so when the content server handle the delete request, it can't find the asset and throw an error, optimize the error handling so that if no asset found, throw an error reminder and continue excuting

  - find out maybe it's not me deleting the asset because I encounter the same thing after some time while I was try for updating chapter progress, perhaps it's the mux has some problem or there is some bug inside my codes, I don't know

- build chapter details page (course review/preview)
  - create sidebar for course page to display the chapters
  - implement chapter details retrieve and render, including userProgress, title, description, attachment(if any), video
  - implement continuous play and progress updating
  - implement mark complete/uncomplete button
  - when chapter complete, it will move to next chapter and update in the backend, but the frentend doesn't update until manual reload the page (need fix, the easiest way is to add a reload between chapter switch, but I want it to be smooth)... three hours later... using redux to fetch chapterId and triger get new courses data which include the progress, but it will stuck in the last chapter because chapter id doesn't change anymore, got find another way
    - dispatch chapterId from videoplayer component which contain current chapterId, solve the last chapter issue, but manually mark complete/uncomplete doesn't work now, should also dispatch chapterId from course-progress-button also
    - since course-progress-button won't change the chapterId, so I use createAt as the trigger, so that everytime I click, I got a different key
    - also need to add this to chapterIdPage, otherwise, the button won't update
    - satisfy about the effect now, but I believe there must be better way to achieve this
- gonna implement a fake bank system to handle purchase courses

### 02/04/2024

- implement payment system with stripe api
  - get api key from stripe and add to .env.local
  - install stripe
    `npm i stripe`
- changed idea, I want to implement my own bank system instead
- update initialize scripts to create both categories and a bank account for test
  `node ./scripts/initialize.ts`

- forgot "//" after "http:" will cause axios reconstructure the url by adding base url to it
- since my content server and bank server both connect to the same database using prisma client, both of them should have the same schema.prisma file but only one should migrate, otherwise, the database will be reset
- findUnique method of prisma client require at least one unique field parameter, findFirst doesn't
- encounter payment modal doesn't render on page, went back to normal after refresh serveral times, no idea
- finally payment successful, but the page doesn't refresh imediately
- payment doesn't render again, got find out why
  - it's weird, when I open the dev tool and click the page, it will show
  - it works perfect when I open the dev tool, but sometimes doesn't work when dev tool was closed
    - it has something to do with the screen size, probably the modal size, fix later
- update triger for retrieve purchase after successful payment
- build student dashboard

  - implement get purchased courses endpoint and component
  - create inprogress courses and completed course display
  - create info-card for each course, similar to the search page
    - click the info-card will direct to the course content page

- gonna build analysis server tomorrow

### 03/04/2024

- implement analysis server with Django, but since it will need to interact with the same database content server is using, it could be easier to implement this also using Express.js, but challenge accepted
  - in order to make Django interact with the same database, I have to define necessary models in Django exactly the same structure and properties like in Express schema
    - after connect to the database, I can generate models from database of content server
      `python manage.py inspectdb > models.py`
      - but this generation is only for refrence because the relationships and properties details might not be correct
      - especially mind that the column name must be exactly the same
    - then makemigrations for Django
      `python manage.py makemigrations`
    - final step, fake migrate, it's important because real migrate will reset the database or change the existing database which will cause conflict and data loss
      `python manage.py migrate --fake`
  - create a test API to retrieve the all the purchases, the above exprerience actually comes from this
    - finally success, challenge overcome
- customize port of analysis server to be 1234, temperately
  `python manage.py runserver 1234`
- create api to return purchase and related course by userId
- create get-analytics function to get the purchase and course data and then return
- create data card for total sales
- create chart using recharts
  `npm i recharts`
  - just a bar chart to show the sale of each course for now
- complete the first analysis chart, gonna implement more in the future
- research on how to add a gateway server between frontend and backend

### 04/04/2024

- try implementing gateway server with Spring Cloud on Java21

  - install openJDK
  - install Maven
  - configure routes for auth system
  - run application
  - test request, failed, 404, not found, perhaps the auth server is blocking it
  - tried many ways, can't solve it
  - went back to official doc, successfully route one endpoint
    - find a way to configure the base url of a server, seems work well
  - configure all servers inside the gateway server
    - auth server port 8000
    - content server port 4000
    - bank server port 8888
    - analysis server port 1234
  - frontend now make all the requests to gateway server now which is running at port 8080

- test the whole system

  - find out that the previous video not found error is because I am using a free account of mux which will delete all assets after 24 hours

  - need to handle cors settings also

    - auth_server works, but content_server still have the cors problem

      - get request doesn't have the problem
      - post/put request to all servers have cors problem, the reason should lie in the gateway server
      - cors problem is really annoying, sometimes the same setting will cause different error, and I don't know what is going on
      - finally set up for auth systems and find that some opearations still has cors error
        - it's the method that I forgot to add to allowed list
      - after hours of research, find out the reason is that spring cloud gateway(or client?) will add an conditional header for a duplicate request and if nothing changes, the server will response 304 and causing the multiple headers error also, solve this now by adding an filter to remove conditional header, but I am thinking why there are always two requests which is identical sent the same time, is it necessary or redundant?

      - I have also removed cors handling from backend servers, all cors will be handled by gateway server, at least I think so.

- next step: can I dockerize all of these servers?

### 18/05/2024

Done!
