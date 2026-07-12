---
title: "Next.js"
slug: "nextjs"
description: "Personal knowledge reference note on Next.js."
featured: false
---


# Why NextJS over ReactJS ?

1. In react project, you have to maintain a separate backend project for your API routes.
2. React doesn’t provide out of the box routing (you have to use react-router-dom)
3. React is not SEO Optimized — Due to client side rendering.
4. Water falling problem — The "Water falling problem" in React, and more broadly in web development, refers to a scenario where data fetching operations are chained or dependent on each other in a way that leads to inefficient loading behavior.

# How to create a NextJS project?

- The command is:

    ```bash
    npm create-next-app@latest
    
    # Follow the instruction and configuration
    ```


# Routing in NextJS

- Unlike React Router, **Next.js uses File-Based Routing**.
- Instead of manually defining routes, you create folders and files inside the `app` directory, and Next.js automatically generates the routes.

    ```plain text
    app/
    ├── page.tsx
    ├── about/
    │   └── page.tsx
    ```

- Automatically creates:

    ```plain text
    /
    /about
    ```

> 💡 **Key Idea:** The folder structure **is** the routing configuration.

## Dynamic Routes

- Dynamic routes allow a single page to handle multiple URLs.

    ```plain text
    app/
    └── users/
        └── [id]/
            └── page.tsx
    ```

- Matches:

    ```plain text
    /users/1
    /users/42
    /users/prem
    ```

- Equivalent React Router route:

    ```typescript
    <Route path="/users/:id" element={<User />} />
    ```

> 💡 Anything inside square brackets (`[]`) becomes a dynamic URL parameter.

##  Route Groups

- Route Groups help organize folders **without affecting the URL**.

    ```plain text
    app/
    └── (marketing)/
        └── about/
            └── page.tsx
    ```

- URL:

    ```plain text
    /about
    ```

- The `(marketing)` folder is ignored when generating routes.

### Why use Route Groups?

- Organize large applications.
- Separate Marketing, Dashboard, Admin, etc.
- Keep URLs clean while keeping folders organized.

## Layouts

- A `layout.tsx` wraps every page inside its folder.

    ```plain text
    app/
    └── dashboard/
        ├── layout.tsx
        ├── page.tsx
        └── analytics/
            └── page.tsx
    ```

- Both routes share the same layout.

    ```plain text
    /dashboard
    /dashboard/analytics
    ```


### Benefits of Layout

- Shared Navbar, Sidebar, Footer.
- No duplicate UI code.
- Layout stays mounted during navigation.
- Component state is preserved.
- Faster client-side navigation.

# Backend API Routes

- Next.js can expose backend API endpoints.

    ```plain text
    app/
    └── api/
        └── users/
            └── route.ts
    ```

- Creates:

    ```plain text
    /api/users
    ```

- Supported HTTP methods:
    - GET
    - POST
    - PUT
    - PATCH
    - DELETE
- Example:

    ```typescript
    export async function GET() {
      return Response.json({ users: [] });
    }
    ```


# Server Components vs Client Components


Every component in the `app` directory is a **Server Component** by default.

- Runs on the server.
- Can fetch data directly.
- Reduces JavaScript sent to the browser.
- Cannot use React hooks like `useState` or `useEffect`.
- Cannot access browser APIs (`window`, `localStorage`, etc.).

## Client Component

- To make a component run in the browser, add:

    ```plain text
    "use client";
    ```

- Example:

    ```plain text
    "use client";
    
    import { useState } from "react";
    
    export default function Counter() {
      const [count, setCount] = useState(0);
    
      return (
        <button onClick={() => setCount(count + 1)}>
          {count}
        </button>
      );
    }
    ```

- Use Client Components when you need:
    - `useState`
    - `useEffect`
    - Event handlers (`onClick`, `onChange`, etc.)
    - Browser APIs
    - Interactive UI

# Fetching Data in Next.js


In Next.js, **where you fetch data depends on the type of component**.

- **Server Components** → Fetch data directly using `fetch()` (Recommended)
- **Client Components** → Fetch data using `useEffect`, React Query, SWR, etc.
> **Rule of Thumb:** Fetch data on the **server whenever possible**.

## Fetching Data in a Server Component

- Since Server Components run on the server, they can fetch data directly.

    ```typescript
    export default async function UsersPage() {
      const res = await fetch("https://api.example.com/users");
      const users = await res.json();
    
      return (
        <ul>
          {users.map((user: any) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      );
    }
    ```

- Benefits
    - Faster initial page load.
    - Better SEO.
    - No loading spinner required for the initial render.
    - Less JavaScript sent to the browser.

## Fetching Data in a Client Component

- If the page needs interactivity, fetch data after the component mounts.

    ```typescript
    "use client";
    
    import { useEffect, useState } from "react";
    
    export default function Users() {
      const [users, setUsers] = useState([]);
    
      useEffect(() => {
        fetch("http://localhost:5000/api/users")
          .then(res => res.json())
          .then(setUsers);
      }, []);
    
      return <div>{users.length} users</div>;
    }
    ```

- Use Client Components when:
    - User interaction is required.
    - Data changes frequently.
    - Real-time updates are needed.
    - Browser APIs are used.

# Step by Step Next.js Signup Flow 

> **Goal:** Understand the complete lifecycle of user signup in a Next.js (App Router) application.

---


## Project Structure


```plain text
app/
│
├── signup/
│   └── page.tsx          // Signup Page (Frontend)
│
├── api/
│   └── signup/
│       └── route.ts      // Backend API
│
lib/
└── mongodb.ts            // Database Connection
│
models/
└── User.ts               // User Model
```


## Step 1. Creating the Signup Page

- **File:**

    ```plain text
    app/signup/page.tsx
    
    // This file automatically creates the route:
    
    /signup
    ```

- Responsibilities
    - Display the signup form.
    - Store user input.
    - Handle button click.
    - Send data to the backend.

    ```typescript
    // File: app/signup/page.tsx
    
    "use client";
    
    import { useState } from "react";
    
    export default function SignupPage() {
      const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
      });
    
      function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({
          ...form,
          [e.target.name]: e.target.value,
        });
      }
    
      async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
    
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
    
        const data = await response.json();
    
        console.log(data);
      }
    
      return (
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
          />
    
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
    
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />
    
          <button>Signup</button>
        </form>
      );
    }
    ```


## Step 2. Sending Data to the Backend

- The browser sends an HTTP POST request to

    ```plain text
    POST /api/signup
    ```

- Request Body

    ```json
    {
      "name": "Prem",
      "email": "prem@gmail.com",
      "password": "123456"
    }
    ```


## Step 3. Creating the Backend API

- **File**

    ```plain text
    app/api/signup/route.ts
    
    // This file automatically creates the endpoint
    
    POST /api/signup
    
    // Equivalent Express Route
    
    app.post("/signup", ...)
    ```


    ```typescript
    // File: app/api/signup/route.ts
    
    import { NextResponse } from "next/server";
    
    export async function POST(request: Request) {
      const body = await request.json();
    
      console.log(body);
    
      return NextResponse.json({
        message: "Received",
      });
    }
    ```

- Parsing Request Body

    ```typescript
    // Express
    const body = req.body;
    
    // Next.js
    
    const body = await request.json();
    
    // Result
    
    {
      name: "Prem",
      email: "prem@gmail.com",
      password: "123456"
    }
    ```


## Step 4. Connecting to MongoDB

- **File**

    ```plain text
    lib/mongodb.ts
    ```

- Responsibilities
    - Connect to MongoDB.
    - Reuse the existing connection.
    - Prevent multiple database connections.
- Code:

    ```typescript
    // File: lib/mongodb.ts
    
    import mongoose from "mongoose";
    
    export async function connectDB() {
      if (mongoose.connection.readyState >= 1) {
        return;
      }
    
      await mongoose.connect(process.env.MONGODB_URI!);
    }
    ```


## Step 5. Creating the User Model

- **File**

    ```plain text
    models/User.ts
    ```

- Defines the structure of the user document.

    ```typescript
    // File: models/User.ts
    
    import mongoose from "mongoose";
    
    const UserSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
    });
    
    export default mongoose.models.User ||
      mongoose.model("User", UserSchema);
    ```


## Step 6. Saving the User

- Code:

    ```typescript
    // File: app/api/signup/route.ts
    
    import { NextResponse } from "next/server";
    import { connectDB } from "@/lib/mongodb";
    import User from "@/models/User";
    
    export async function POST(request: Request) {
      const body = await request.json();
    
      const { name, email, password } = body;
      
     // Validating the data
      
      if (!name || !email || !password) {
    	  return NextResponse.json(
    	    {
    	      message: "Missing Fields",
    	    },
    	    {
    	      status: 400,
    	    }
    	  );
    	}
    
      await connectDB();
    
      const user = await User.create({
        name,
        email,
        password,
      });
    
      return NextResponse.json({
        message: "User Created",
        user,
      });
    }
    ```


## Step 7. Database

- MongoDB stores the following document inside the **users** collection.

    ```json
    {
      "_id": "...",
      "name": "Prem",
      "email": "prem@gmail.com",
      "password": "123456"
    }
    ```

