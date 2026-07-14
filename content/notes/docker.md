---
title: "Docker"
slug: "docker"
description: "Everything a developer needs to understand Docker—from local development environments to production deployments."
featured: false
---

> 
> - Don't only ship your code. Ship the entire environment needed to run it.
> - Docker solves the classic problem: "It works on my machine.”
>
> 
> - Git packages your source code.
> - Docker packages your runtime environment.
>

# The use cases


## 1. Consistent Development Environment

- Every developer runs the application in the exact same environment.
- Eliminates dependency and version mismatch issues.
- New developers can get started quickly.

## 2. Easy Deployment

- Deploy the same Docker image that was tested locally.
- No need to manually install runtime dependencies on the server.
- Reduces deployment errors.

    ```markdown
    # Without Docker
    
    Install Node
    
    Install npm
    
    Install Redis
    
    Install nginx
    
    Install OpenSSL
    
    Install Prisma
    
    Generate Prisma client
    
    Set PATH
    
    Hope everything works...
    
    # With Docker
    
    docker run backend-image
    ```


## 3. Microservices

- Each service runs in its own isolated environment.
- Example:
    - Node.js Backend
    - Python AI Service
    - PostgreSQL
    - Redis
    - Nginx
- Different services can use different languages and runtime versions without conflicts.

## 4. Multiple Project Support

- Different projects can use different runtime versions.
- Example:
    - Project A → Node 18
    - Project B → Node 24
- No need to constantly switch versions on your machine.

## 5. CI/CD Pipelines

- CI servers run the same environment as local development.
- Ensures builds and tests are consistent across all stages.

## 6. Scalability

- Multiple identical containers can be started easily.
- Load balancers can distribute traffic among containers.
- Makes horizontal scaling simple.

    ```markdown
    # Instead of running
    
    1 backend
    
    # Run
    
    Backend Container 1
    
    Backend Container 2
    
    Backend Container 3
    
    Backend Container 4
    
    * A load balancer distributes requests among them.
    * Containers are lightweight, so creating more instances is fast.
    ```


# Docker Container

- Instead of installing everything directly on your machine, Docker creates isolated environments. Each isolated environment is called a Container.
- It is a lightweight, isolated environment that runs an application along with everything it needs.
- A **Container** is a running instance of docker image.

    ```markdown
    Your Computer
    
    ├── Container 1
    │   ├── Node 24
    │   ├── Backend Code
    │   └── Dependencies
    │
    ├── Container 2
    │   ├── Python 3.12
    │   ├── AI Model
    │   └── Python Packages
    │
    ├── Container 3
    │   └── PostgreSQL
    │
    └── Container 4
        └── Redis
    ```


## Are containers virtual machines?

- No, A **Virtual Machine (VM)** virtualizes an entire operating system.
- A **Container** shares the host operating system's kernel but keeps the application isolated.
- This is why containers:
    - Start in seconds (or less).
    - Use much less memory.
    - Are lightweight compared to VMs.

# Docker Image

- A read-only blueprint (snapshot) containing everything required to run an application.
- A **Container** is a running instance of that blueprint.

    ```bash
    # If you create one image:
    
    Backend Image
    
    # You can start multiple containers from it:
    
    Backend Image
           │
           ├── Container 1
           ├── Container 2
           └── Container 3
           
     # This is exactly how applications are scaled in production
     # Suppose one backend instance can handle 100 req/second.
     # Traffic suddenly increased to 300 req/second
     # Instead of making three copied of your code, you simply run:
     
     Backend Image
          │
          ├── Backend Container 1
          ├── Backend Container 2
          └── Backend Container 3
     
     # A load balancer distributes incoming requests among the three containers.
    ```

- When you update your code, Your existing image doesn't magically change because Docker images are immutable (read-only).
- The flow is:

    ```markdown
    Update Code
          │
          ▼
    Build a New Image (v2)
          │
          ▼
    Start New Containers from Image v2
          │
          ▼
    Stop & Remove Old Containers (v1)
    ```


> 💡 - Containers are disposable. Images are versioned.  
>   
> - An image is a **snapshot** of your application and its environment at a particular point in time. Once it's built, it never changes. If the application changes, you build a **new image**, leaving the old one untouched.


## Can we revert back to an old image like we do in Git?

- **Yes!** In fact, this is one of Docker's biggest advantages.
- Suppose you’ve built three versions of your backend, each image is stored separately.

    ```markdown
    Images
    
    ├── backend:v1
    ├── backend:v2
    └── backend:v3
    ```

- Suppose you deploy **v3**, but users discover a critical bug. Instead of fixing it immediately, you can simply stop the v3 containers and start new containers from **v2**.

> 💡 - Everything starts with the **`Dockerfile`**, which is simply a set of instructions to build an image.


## Images are made of Layers

- Suppose your Dockerfile looks like this:

    ```docker
    FROM node:24 # Layer 1
    
    WORKDIR /app # Layer 2
    
    COPY package*.json # Layer 3
    
    RUN npm install # Layer 4
    
    COPY . . # Layer 5
    
    CMD ["npm", "start"] # Layer 6
    ```

- Docker doesn’t create one giant file. Instead, it creates layers. Each instruction creates a new layer.
- Suppose you change only one file, `app.ts.`  Because docker `caches` the layers, if only source code changed, only the affected layer is rebuilt. This makes builds much faster.

> 💡 If a layer changes, Docker rebuilds that layer and every layer after it. It **cannot** reuse later layers because they depend on the output of the changed layer.


# Why do we need backward-compatible changes?


Database schema is **persistent**, while application containers are **replaceable**.


During deployments or rollbacks:

- Different application versions may temporarily interact with the same database.
- If the schema is incompatible with an older version, rolling back the application can cause runtime failures.
- Backward-compatible changes ensure both the old and new application versions can safely use the database during deployment.

## Backward-Compatible Changes (Safe)


These changes generally do not break older application versions:

- Add a new nullable column.
- Add a new table.
- Add an index.
- Add a new optional relationship.

Example:


```sql
ALTER TABLE users ADD COLUMN phone TEXT;
```


The old application continues to work because it simply ignores the new column.


## Breaking Changes (Unsafe)


These can break older application versions:

- Remove a column.
- Rename a column.
- Drop a table.
- Change a column's data type incompatibly.

## Best Practices


Instead of making destructive changes immediately:

1. Add the new schema while keeping the old one.
2. Deploy the new application that supports both schemas.
3. Migrate existing data if needed.
4. Switch the application to use the new schema.
5. Remove the old schema in a later release.
> **Rule of Thumb:** Never make a database change that prevents the previous stable application version from running.

# Docker Hub

- **Docker Hub** is a **cloud-based registry for Docker images**.

> 💡 **GitHub is to source code.**  
> **Docker Hub is to Docker images.**

- You build an image for your backend, push it to docker hub.

    ```markdown
    Your Laptop
          │
          ▼
    Docker Hub
          │
          ▼
    Developer Laptop
    EC2 Server
    CI/CD Pipeline
    ```

- It contains a lot of public image, like node, python, Postgres, Redis, Nginx, etc.

# Port Mapping

- Port mapping in docker help to map the docker container port with your local system port.

    ```bash
    docker run -p 27018:27017 mongo
    
    # Mapping you system port 27018 to the container port 27017.
    # It will allow you to access the mongo instance with localhost:27018.
    ```


# Common Docker Command

1. `docker run`
    - The `docker run` command creates and starts a brand new container from a specified Docker Image
2. `docker start`
    - The `docker start` command restarts an existing, stopped container while keeping its past filesystem changes intact.
3. `docker images`
    - The `docker images` command **lists all top-level Docker images currently stored on your local host system**.
    - It helps you view what software blueprints are downloaded and ready to be turned into running containers.
4. `docker ps`
    - The `docker ps` command lists the running Docker containers on your system.
5. `docker build`
    - The `docker build` command creates a reusable Docker image from a text file called a `Dockerfile`
    - It automates the packaging of your application code, dependencies, and environment configuration into a single, deployable blueprint.
6. `docker kill`
    - The `docker kill` command abruptly terminates one or more running containers.
    - It acts like a "force quit" or pulling the power plug, instantly stopping the application container when it refuses to shut down normally.
7. `docker stop`
    - The `docker stop` command gracefully shuts down one or more running containers.
    - Unlike a forced shutdown, it politely asks the application inside the container to save its work and finish active tasks before stopping.

# Dockerfile

- If you want to create an image from your code, that you can push to `dockerhub` , you need to create a `Dockerfile` for you application.
- A Dockerfile is a text document that contains all the commands a user could run on the command line to create an image.
- Every time Docker builds an image, it simply follows the instructions written in the Dockerfile **from top to bottom**.
- The docker file has two parts
    - Base Image
    - Bunch of commands that you run on the base image
- Example of a node project dockerfile:

    ```docker
    FROM node:22-alpine
    
    WORKDIR /app
    
    COPY package*.json ./
    
    RUN npm install
    
    COPY . .
    
    EXPOSE 3000
    
    CMD ["npm", "start"]
    ```

- `FROM` command
    - Specifies the base image from which your image starts.
    - Without `FROM`, Docker doesn't know which operating system or runtime to use.
    - Every Docker image starts from another image. Saves time because common environments are already prepared.
- `WORKDIR`  command
    - Sets the current working directory for all following commands.
    - Think of it as the directory where you run all the command and copy the files.
- `COPY`  command
    - Copies files from your computer into the Docker image.
    - Syntax:

        ```docker
        COPY source destination
        
        # Example
        
        COPY package.json .
        
        # Copies host machine 'package.json' to container '/app/package.json'
        
        COPY . .
        
        # Copy everything except files ignored by .dockerignore
        ```

- `RUN` command
    - Executes a command while building the image.
    - `RUN` executes only once during image creation.
    - It is not executed when the container starts.
- `CMD`  command
    - Specifies the **default command** that runs when the container starts.
- `EXPOSE` command
    - Documents which port the application listens on.
    - It **does not** publish the port to your host machine.
    - You still need, `docker run -p 3000:3000 image-name`
    - Think of it as documentation for anyone using the image.
- `ENV`  command
    - Defines environment variables inside the container.
    - Use `ENV` for **non-sensitive default configuration**.

        ```docker
        ENV NODE_ENV=production
        ENV PORT=3000
        ENV TZ=UTC
        ENV LANG=en_US.UTF-8
        
        # Access in Node.js
        
        process.env.PORT
        
        # Suppose the developer want to run the container on port 5000
        
        docker run -e PORT=5000 my-app
        ```

- `ARG` **command**
    - Defines variables available **only during image build**.

        ```docker
        ARG NODE_VERSION=22
        FROM node:${NODE_VERSION}
        
        # Build
        
        docker build --build-arg NODE_VERSION=20 .
        
        # It facilitate the user to choose the version at build time.
        ```

- `LABEL`  command
    - Adds metadata to the image.
    - Useful for documentation and tooling.

        ```docker
        LABEL maintainer="Prem Deep"
        LABEL version="1.0"
        LABEL app="ROXC Backend"
        ```


# Building images from dockerfile and spinning a container.

- You have a `dockerfile` in your project, to build a `docker image` from it, run the below command in terminal:

    ```bash
    docker build -t image_name .
    
    # Now, if you run 'docker images', you will notice a new image is created.
    ```

- Now, you have the `docker image` of your project, you can start the project by running below command:

    ```bash
    docker run -p 3000:3000 image_name
    
    # Now, visit localhost:3000, you will see the app running.
    ```

- If you need to pass an environment variable, the `-e` argument let’s you send in environment variables to your node.js app

    ```bash
    docker run -p 3000:3000 -e DATABASE_URL="postgres://avnadmin:AVNS_EeDiMIdW" image_name
    ```


# The significance of `ENV` over `.env` file

- **`.env`** **and** **`ENV`** **solve different problems**, even though they both deal with environment variables.
- Imagine you're shipping this application to another developer or to production. Should they be required to create a `.env` file just to tell your app that it runs on port `3000`?
- Probably not—that's a sensible default. That's where `ENV` comes in.
- `.env`  should contain mainly deployment-specific values
- At a high level:
    - **Dockerfile (****`ENV`****)**: stable, non-sensitive defaults such as `NODE_ENV=production` or a default `PORT`.
    - **Development (****`.env`****)**: local secrets and machine-specific configuration.
    - **Production**: secrets injected by your deployment platform (Docker Compose, Kubernetes, GitHub Actions, AWS, etc.), usually without a `.env` file on the server.
- Secrets should be injected when the container starts.

    ```bash
    docker run \
      -e DATABASE_URL=... \
      -e JWT_SECRET=... \
      my-app
    ```

- In production, these are managed using orchestration tools like Docker Compose, Kubernetes Secrets, or cloud secret management services.

# The `docker exec` command

- `docker exec` executes a command **inside an already running container**.
- Think of it like SSH-ing into a remote machine.
- Syntax:

    ```bash
    docker exec [OPTIONS] <container-name> <command>
    
    # Example:
    
    docker exec backend ls
    # This basically runs ls inside the backend container.
    
    docker exec -it backend sh or docker exec -it backend bash
    # Now, you are inside the container. 
    # From here you can run linux command and explore the complete container.
    ```

- Common uses:
    - To explore files of the container
    - To check whether variables like `DATABASE_URL` or `NODE_ENV` are actually present.
    - SSH-ing into the container.
    - Run a node command like, `docker exec backend node -v`
    - Connect to a database client, `docker exec -it postgres psql -U postgres`

# Volume in Docker

- If you restart a stopped `mongo` docker container, you will notice that your data goes away.
- It happens, because docker containers are `transitory` (they don’t retain data across restarts)
- To solve this, the volume in container is introduces, which store persistent data outside the container in a special location managed by Docker, so the data survives even if the container is stopped, removed, or recreated.
- The volume is then **mounted into the container** at the time of running the container.
- Suppose you removed the mongo container, but when you create a new mongo container and mount the **same volume**, the data is immediately available again.
- A **Docker Volume** is simply a directory on the **host machine** that Docker manages for you.

    ```markdown
    Host Machine
    +----------------------------+
    | Docker Volume              |
    | ├── img1.png               |
    | └── img2.png               |
    +-------------▲--------------+
                  │ Mounted
                  │
    +-------------┴--------------+
    | Container                  |
    | /uploads                   |
    +----------------------------+
    ```

- Volume can be created using the below command:

    ```bash
    docker volume create my_volume
    
    # Now, when can verify it exists using:
    
    docker volume ls
    
    # Mount the volume into a container
    # Suppose your Node application stores uploaded file in /uploads
    # Start the container with mounting:
    
    docker run -d --name my-app -v my-volume:/uploads my-image
    ```

- Let’s understand, the `-v my-volume:/uploads` part.
- This has the format: `<Volume Name>:<Path Inside Container>`
    - **`my-volume`** - The Docker-managed storage.
    - **`/uploads`** - The directory inside the container.
- Whenever your app writes to `/uploads`, the data actually ends up in `my-volume`.
- You need to mount the `specific path inside container`, where your application saves the data. Like for `mongo`, it saves to `/data/db`

# Network in Docker

- In Docker, a network is a powerful feature that allows containers to communicate with each other and with the outside world.
- Docker containers can’t talk to each other by default.
- `localhost` on a docker container means `it's own network` and not the network of the `host machine`
- Command to create a network and see how Node and mongo containers communicate:

    ```bash
    docker network create my_custom_netowrk
    
    # Start a mongo container and connect it with the my_custom_network
    
    docker run -d -v volume_database:/data/db --name mongoapp --network my_custom_network -p 27017:27017 mongo
    
    # Start the node application container and connect with the same custom network.
    
    docker run -d -p 3000:3000 --name backend --network my_custom_network image_tag
    
    # Now, when you put the database url in node application, just replace the 'localhost' from 'mongoapp'
    # mongoapp is the dns for the network of mongo container created.
    ```

- Suppose you have three computers connected to the same Wi-Fi. Since they're on the same network, they can communicate using IP addresses.

    A **Docker network is exactly the same idea**, except the "computers" are **containers**.


    ```bash
    Docker Network
              --------------------
              |                  |
              |  Node.js         |
              |     |            |
              | PostgreSQL       |
              |     |            |
              | Redis            |
              --------------------
    ```

- The Docker network acts like a **virtual switch/router**.
- Whenever a container joins the network:
    - It gets its own IP address.
    - Docker's DNS records its name.
    - Other containers can reach it by name.

# Docker Network Types


## What is a Network Driver?

- A **network driver** defines how Docker creates and manages networking for containers. It determines how containers communicate with each other and with the host machine.
- The two most commonly used network drivers are:
    - **Bridge** (Default)
    - **Host**

## Bridge Network (Default)

- The **Bridge** network is Docker's default network driver. Every container connected to a bridge network gets its own:
    - IP address
    - Network namespace
    - `localhost`
- Containers communicate with each other through a **virtual bridge** created by Docker.
- Characteristics
    - Each container has its own network stack.
    - Supports Docker's built-in DNS (containers communicate using service/container names).
    - Containers on the same bridge network can communicate directly.
    - Host-to-container communication requires **port mapping** (`p`).

## Host Network

- The **Host** network driver removes Docker's network isolation. The container shares the **host machine's network stack**.
- Characteristics
    - No separate container IP.
    - `localhost` inside the container is the host's `localhost`.
    - No Docker bridge is created.
    - Port mapping (`p`) is **not required**.
    - Less network isolation.
- How to run a container with host network

    ```bash
    docker run --network host my-app
    
    # If the application listens on: 
    
    app.listen(3000);
    
    # It is directly accessible on:localhost:3000, without using -p 3000:3000
    ```

- When to Use
    - High-performance networking
    - Monitoring tools
    - Network utilities
    - Applications requiring direct access to the host network

# Docker Compose

- Docker Compose is a tool for **defining and managing multi-container Docker applications** using a single YAML configuration file (`compose.yml` or `docker-compose.yml`). Instead of manually creating networks, volumes, and running multiple `docker run` commands, you describe the entire application in one file and start everything with a single command.

## Why Docker Compose?

- Without Docker Compose, every container must be started manually.

    ```bash
    docker network create app-network
    
    docker run ...
    docker run ...
    docker run ...
    ```

- With Docker Compose:

    ```bash
    docker compose up
    ```

- Docker automatically:
    - Builds images (if required).
    - Creates containers.
    - Creates a dedicated bridge network.
    - Connects all services to the network.
    - Creates named volumes.
    - Injects environment variables.
    - Starts every service.
- This makes the application **reproducible**, **portable**, and easy for every developer to run.

## Basic Structure of docker-compose


```yaml
services:
  frontend:
    ...

  backend:
    ...

  postgres:
    ...
```

- `services` contains every container that makes up the application.
- Each service definition describes **how a container should be created and run**.
- Running `docker compose up` creates one container for each service.

## Common Configuration Options

- `image`

    Uses an existing image from a registry (usually Docker Hub).


    ```yaml
    services:
      postgres:
        image: postgres:17
    ```


    It is equivalent to:


    ```bash
    docker run postgres:17
    ```


    Use `image` for third-party services like PostgreSQL, Redis, Nginx, MongoDB, etc.

- `build`

    Builds an image from a Dockerfile before creating the container.


    ```yaml
    services:
      backend:
        build: .
    ```


    It is equivalent to:


    ```bash
    docker build .
    docker run <built-image>
    ```


    Use `build` for your own applications where you have the source code and Dockerfile.

    > **Remember:** Containers are always created from images. `build` first creates an image, then starts a container from it.
- `ports`

    Maps a port on the host machine to a port inside the container.


    ```yaml
    ports:
      - "5000:5000"
    ```


    **Ports are only required when something outside Docker needs to access the container.**


    Examples:

    - Browser → Frontend ✅
    - Browser → Backend ✅
    - Backend → PostgreSQL ❌ (uses Docker network)
- `environment`

    Passes environment variables into the container at runtime.


    ```yaml
    environment:
      POSTGRES_USER: prem
      POSTGRES_PASSWORD: password
    ```


    Using a `.env` file:


    ```yaml
    environment:
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
    ```

- `volumes`

    Mounts persistent storage or local directories into a container.


    ```yaml
    services:
      postgres:
        image: postgres:17
        volumes:
          - postgres-data:/var/lib/postgresql/data
    
    volumes:
      postgres-data:
    ```


    Used for databases so data survives container recreation.

- `depends_on`

    Controls container startup order.


    ```yaml
    services:
      backend:
        depends_on:
          - postgres
    ```


    This ensures Docker starts the PostgreSQL container before the backend container.

    > **Important:** `depends_on` only controls startup order. It **does not** wait until PostgreSQL is ready to accept connections. Applications should implement retry logic or use health checks for readiness.

## Docker Compose Networking

- Docker Compose automatically creates a **dedicated bridge network** for the project.

    ```plain text
    backend
       │
    postgres
       │
    redis
    ```

- Every service joins the same network automatically.
- Each service name becomes a DNS hostname.
- Example:

```plain text
DATABASE_URL=postgres://user:password@postgres:5432/db

# Instead of

DATABASE_URL=postgres://user:password@localhost:5432/db
```


## Common Docker Compose Commands


```bash
# Start all services
docker compose up

#Build images before starting
docker compose up --build

# Start in a detached mode
docker compose up -d

#Stop and remove containers and netowrks
docker compose down

# Stop and remove everything including named volumes
docker compose down -v

# View running services
docker compose ps

# View logs
docker compose logs 

# View logs of a specific service
docker compose logs backend

# Execute commands inside a running container
docker compose exec backend bash/s
```


# Docker Bind Mounts

- A **bind mount** creates a **live connection** between a directory on the **host machine** and a directory inside a **Docker container**. Instead of using the copy of the files stored inside the Docker image, the container directly accesses the files from your local machine.
- Example:

    ```yaml
    services:
      backend:
        volumes:
          - ./backend:/app
    ```


    This means everything inside `./backend` on the host is immediately available inside `/app` in the container.

- Bind Mounts enable hot load and make the development smooth.
- A common Docker Compose configuration is:

    ```yaml
    services:
      backend:
        volumes:
          - ./backend:/app
          - /app/node_modules
    ```


## Why is `/app/node_modules` added?

- When the project directory is bind mounted:

    ```yaml
    - ./backend:/app
    ```

- the host's `node_modules` directory is also mounted into the container.
- This can cause compatibility issues because:
    - The host may be running **Windows** or **macOS**.
    - The container is usually running **Linux**.
    - Some Node.js packages contain platform-specific compiled binaries.
- To avoid this, Docker creates an **anonymous volume** for `/app/node_modules`.
- Result:

    ```plain text
    Host Project
    │
    ├── src/
    ├── package.json
    └── node_modules   ❌ Not used
    
    Container
    │
    ├── src/
    ├── package.json
    └── node_modules   ✅ Linux dependencies
    ```

- Bind mounts are **not used in production, it is for development purpose.**

# A production-oriented **development** `compose.yml`  file


```yaml
# ===================================================================
# compose.yml
# Purpose:
#   Local development environment for:
#   - React (Vite)
#   - Node.js + Express
#   - PostgreSQL
# ===================================================================
# Project Structure
#
# project-root/
# │
# ├── compose.yml
# ├── .env
# ├── frontend/
# │   ├── Dockerfile
# │   ├── package.json
# │   └── ...
# ├── backend/
# │   ├── Dockerfile
# │   ├── package.json
# │   └── ...
# └── README.md
# ===================================================================

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile

    container_name: roxc-frontend

    ports:
      - "5173:5173"

    volumes:
      # Bind mount source code for hot reload
      - ./frontend:/app

      # Prevent local node_modules from overwriting container node_modules
      - /app/node_modules

    environment:
      VITE_API_URL: http://localhost:5000

    depends_on:
      - backend

    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile

    container_name: roxc-backend

    ports:
      - "5000:5000"

    volumes:
      - ./backend:/app
      - /app/node_modules

    environment:
      PORT: 5000
      DATABASE_URL: postgresql://postgres:password@postgres:5432/roxc
      JWT_SECRET: ${JWT_SECRET}

    depends_on:
      - postgres

    restart: unless-stopped

  postgres:
    image: postgres:17

    container_name: roxc-postgres

    ports:
      # Optional.
      # Needed only if you want to connect from pgAdmin,
      # TablePlus, DBeaver, etc.
      - "5432:5432"

    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: roxc

    volumes:
      - postgres-data:/var/lib/postgresql/data

    restart: unless-stopped

volumes:
  postgres-data:
```

