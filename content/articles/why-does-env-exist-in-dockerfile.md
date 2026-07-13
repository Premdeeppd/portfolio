---
title: "Why Does ENV Exist in a Dockerfile If We Already Have .env?"
slug: "why-does-env-exist-in-dockerfile"
description: "Learn the difference between Docker's ENV instruction and a .env file, when to use each, and how to manage environment variables and secrets using Docker best practices."
featured: false
---


# Introduction


When I first learned Docker, one question kept bothering me:

> _If my application already uses a_ _`.env`_ _file, why does Docker even have an_ _`ENV`_ _instruction?_

At first, both seemed to solve the same problem—they both define environment variables. But after understanding how Docker images are built and deployed, I realized they serve completely different purposes.


# The Common Misconception


Many developers assume that `.env` and `ENV` are interchangeable.


They are not.


A `.env` file is **an application-level configuration file**, whereas `ENV` is **a Docker image configuration**.


Although both result in environment variables being available to your application, they are introduced at different stages and are managed by different systems.


# What is `.env`?


A `.env` file is simply a text file containing key-value pairs.


```plain text
DATABASE_URL=postgres://...
JWT_SECRET=my-secret
PORT=3000
```


Your application reads this file using a library such as `dotenv`.


For example, in a Node.js application:


```javascript
import dotenv from "dotenv";

dotenv.config();
```


Without calling `dotenv.config()`, your application will not automatically read the `.env` file.


This is because **Docker does not understand** **`.env`** **files inside your project**. The `.env` file is a convention used by application frameworks and libraries—not by Docker itself.


# What is `ENV`?


The `ENV` instruction defines environment variables **inside the Docker image**.


```docker
ENV NODE_ENV=production
ENV PORT=3000
```


Every container created from that image will automatically have these variables unless they are overridden when the container starts.


Unlike `.env`, no additional library is required for these variables to exist.


# The Fundamental Difference


Think about where each one belongs.


| `.env`                                                   | `ENV`                           |
| -------------------------------------------------------- | ------------------------------- |
| Application configuration                                | Docker image configuration      |
| Read by the application                                  | Managed by Docker               |
| Usually contains deployment-specific values              | Usually contains image defaults |
| Often different for development, staging, and production | Usually identical everywhere    |
| Commonly excluded from Git                               | Stored in the Dockerfile        |


# Why Not Put Everything in `.env`?


Imagine you build a Docker image and publish it on Docker Hub.


If your image requires users to provide every single environment variable before it can even start, then the image isn't very self-contained.


Instead, you can provide sensible defaults.


```docker
ENV NODE_ENV=production
ENV PORT=3000
```


Now anyone can simply run:


```bash
docker run my-app
```


and the application starts successfully.


If someone wants to use a different port, they can override it during startup.


```bash
docker run -e PORT=5000 my-app
```


Docker uses the runtime value instead of the default defined in the Dockerfile.


# Should Secrets Be Stored Using `ENV`?


No.


This is one of the most important Docker best practices.


Avoid storing sensitive information such as:

- Database URLs
- API Keys
- JWT Secrets
- AWS Credentials
- OAuth Secrets

For example, this is a bad practice:


```docker
ENV DATABASE_URL=postgres://...
ENV JWT_SECRET=my-secret
```


These values become part of the image and can potentially be inspected by anyone with access to it.


Instead, secrets should be injected when the container starts.


```bash
docker run \
  -e DATABASE_URL=... \
  -e JWT_SECRET=... \
  my-app
```


Or, in production, managed using orchestration tools like Docker Compose, Kubernetes Secrets, or cloud secret management services.


# So When Should You Use `ENV`?


A good rule of thumb is:


Use `ENV` for **non-sensitive defaults** that make your Docker image easier to use.


Examples include:

- `NODE_ENV=production`
- `PORT=3000`
- `TZ=UTC`
- `LANG=en_US.UTF-8`

These values are stable, predictable, and safe to commit to version control.


# My Takeaway


The confusion comes from the fact that both `.env` and `ENV` eventually populate `process.env` inside your application.


However, they solve different problems.

- `.env` helps developers configure an application.
- `ENV` helps Docker define sensible defaults for an image.

They complement each other rather than compete with each other.


For most production applications, I would use:

- `ENV` for safe default values.
- Runtime environment variables for secrets.
- `.env` primarily for local development.

Understanding this distinction made Docker feel much less confusing and helped me appreciate that a Docker image is meant to be a portable, self-contained package—not just another way to run a Node.js application.

