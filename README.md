# **Idealy: Startup Community Platform**

A comprehensive web application that allows users to create accounts, follow other users, upload and manage images via Cloudinary, 
and build and interact with startups. Users can like, dislike, comment, and manage startups while leveraging various features 
like search, filter, and categorization.

## **Features**

### User Management
* User registration and login with secure JWT authentication.
* Update and delete user accounts.
* Follow/unfollow other users.

### Startup Management
* Create, update, and delete startups.
* Add and manage startup images via Cloudinary.
* Add, delete, and view comments for startups.
* Like and dislike startups.

### Category Management
* Create and manage categories.
* Search startups by name or category.
* Filter startups based on criteria.


## Technology Stack
### Backend
* **Golang:** Server-side logic.
* **Gorilla Mux:** Router for handling API endpoints.
* **GORM:** ORM for PostgreSQL.
* **bcrypt:** Secure password hashing.
* **JWT:** Authentication mechanism.


### Frontend
* **Next.js:** React framework for the user interface.
* **Tailwind CSS:** For responsive and modern UI design.
* **ShadCN:** Component library for consistent UI elements.
* **Tiptap Editor:** Rich-text editor for pitch creation.
* **React Hook Form + Zod:** Form handling with validation.
* **React Icons:** Icon library for enhancing UI/UX.
* **Axios:** HTTP client for API interactions.


### Cloud Storage
**Cloudinary:** For image uploads and storage.
### Database
**PostgreSQL:** Relational database for storing data.

### Prerequisites
Before running this project, ensure you have the following installed:
* Node.js (v16 or later)
* Go (v1.19 or later)
* PostgreSQL

### Getting Started
#### Backend Setup
1). Clone the repository:
```
git clone <repository-url>  
cd Idealy-main
cd server
```
2). Install Go dependencies:
```
go mod tidy  
```

3). In DBInitializer File I Have DB_URI Where you can Change your database uri Postgres
```
go run main.go
```

#### Frontend Setup

1). Navigate to the frontend directory:
```
cd client
```

2). Install dependencies:
```
npm i
```

3). Run the development server:
```
npm run dev
```

4). Access the application at `http://localhost:3000.`


### API Endpoints
#### User Routes
* POST /api/register – Register a new user.
* POST /api/login – Authenticate user and generate JWT.
* GET /api/users/:id – Get user details.
* GET /api/users/ – Get users.
* PUT /api/auth/update/:id – Update user details.
* DELETE /api/auth/delete/:id – Delete user details.
* PUT /api/auth/follow/:targetId – Follow User.
* PUT /api/auth/unfollow/:targetId – UnFollow User.

#### Startup Routes
* POST /api/auth/startup – Create a new startup.
* GET /api/startup/GetAllStartup – Get Startups.
* GET /api/startup/:startupId – Get Startup.
* GET /api/startup/GetStartupUser/:startupUserId – Get StartupBasedByUser.
* PUT /api/startup/auth/updateStartup/:startupId – Update Startup.
* DELETE /api/startup/auth/deleteStartup/:startupId – Delete Startup.
* PUT /api/startup/auth/likeStartup/:startupId – Like Startup.
* PUT /api/startup/auth/dislikeStartup/:startupId – DisLike Startup.
* GET /api/startup/auth/viewStartup/:startupId – View Startup.


#### Category Routes
* POST /api/category/createCategory – Create a category.
* GET /api/category/GetAllCategory – Get all categories.

#### Comment Routes
* GET /api/comment/GetAllComent/:startupId – Get All Comments
* POST /api/comment/auth/createComment/:startupId – Create Comments
* DELETE /api/comment/auth/deleteComment/:startupId – Delete Comments


### Project Structure
```
Client Folder
PS C:\Users\SHADO\OneDrive\Desktop\Idealy\client> ls
    Directory: C:\Users\SHADO\OneDrive\Desktop\Idealy\client
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        20-11-2024     15:29                .next
d-----        20-11-2024     12:54                actions
d-----        20-11-2024     12:54                app
d-----        20-11-2024     12:54                components
d-----        20-11-2024     12:54                lib
d-----        20-11-2024     12:59                node_modules
d-----        20-11-2024     12:54                public
-a----        20-11-2024     12:54            379 .eslintrc.json
-a----        20-11-2024     12:54            467 .gitignore
-a----        20-11-2024     12:54            442 components.json
-a----        20-11-2024     13:00            233 next-env.d.ts
-a----        20-11-2024     12:54            330 next.config.ts
-a----        20-11-2024     12:59         275924 package-lock.json
-a----        20-11-2024     12:54           1390 package.json
-a----        20-11-2024     12:54            135 postcss.config.mjs
-a----        20-11-2024     12:54           1450 README.md
-a----        20-11-2024     12:54           1642 tailwind.config.ts
-a----        20-11-2024     12:54            598 tsconfig.json
```
```
Backend Folder
PS C:\Users\SHADO\OneDrive\Desktop\Idealy> cd .\server\
PS C:\Users\SHADO\OneDrive\Desktop\Idealy\server> ls
    Directory: C:\Users\SHADO\OneDrive\Desktop\Idealy\server
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        20-11-2024     12:54                api
d-----        20-11-2024     12:54                controllers
d-----        20-11-2024     12:54                handlers
d-----        20-11-2024     12:54                Initializers
d-----        20-11-2024     12:54                middlewares
d-----        20-11-2024     12:54                models
d-----        20-11-2024     12:54                routes
-a----        20-11-2024     12:54              4 .gitignore
-a----        20-11-2024     12:54            717 go.mod
-a----        20-11-2024     12:54           3975 go.sum
-a----        20-11-2024     12:54            438 main.go
-a----        20-11-2024     12:54            356 vercel.json
```

### License
This project is licensed under the MIT License.


### Some Demo Videos and Images
![Home Image](https://raw.githubusercontent.com/ShadowAdi/Idealy/refs/heads/master/Home.png)
![Profile Image](https://raw.githubusercontent.com/ShadowAdi/Idealy/refs/heads/master/Profile.png)
![Login Image](https://raw.githubusercontent.com/ShadowAdi/Idealy/refs/heads/master/Login.png)
![ProfileStartups Image](https://raw.githubusercontent.com/ShadowAdi/Idealy/refs/heads/master/ProfileStartups.png)
![StartupAll Image](https://raw.githubusercontent.com/ShadowAdi/Idealy/refs/heads/master/StartupAll.png)
![SingleStartup Image](https://raw.githubusercontent.com/ShadowAdi/Idealy/refs/heads/master/SingleStartup.png)
![CommentSection Image](https://raw.githubusercontent.com/ShadowAdi/Idealy/refs/heads/master/CommentSection.png)


[Video Idealy](https://res.cloudinary.com/shadowaditya/video/upload/v1732100203/bjftp16dgd4vasmapbsh.mp4)
