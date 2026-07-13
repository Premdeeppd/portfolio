---
title: "AWS"
slug: "aws"
description: "Learning the core AWS services used to deploy, scale, secure, and operate modern cloud applications."
featured: false
---


# What is EC2?

- **EC2 (Elastic Compute Cloud)** is a service that lets you rent a virtual computer in AWS's data centers.

    ```markdown
    Your Laptop
        │
        │ SSH
        ▼
    +-------------------------+
    | AWS EC2 Instance        |
    |-------------------------|
    | Ubuntu Linux            |
    | Node.js                 |
    | Express                 |
    | PostgreSQL              |
    | Redis                   |
    | Docker                  |
    +-------------------------+
    ```

- Why is it called _Elastic_ Compute Cloud?
    - **Elastic** means you can change its resources whenever you need. Today if you have 2 GB RAM, 1 CPU, you can easily change to 8 GB RAM, 4 CPU.
- What does and EC2 instance contain?
    - It is just an computer, it can have —
        - Operating system
        - CPU
        - RAM
        - Storage
        - Network connection
        - Public IP address

# What is SSH?

- **SSH (Secure Shell)** is a secure protocol that lets you remotely control another computer over the internet.
- Think of it as, a secure remote terminal for another computer.

    ```markdown
    Your Laptop
          │
          │ Secure Encrypted Connection (SSH)
          ▼
    +----------------------+
    | Ubuntu EC2 Instance  |
    |                      |
    | $ ls                 |
    | $ cd app             |
    | $ npm install        |
    | $ node index.js      |
    +----------------------+
    ```

- Command to SSH to the server

    ```bash
    ssh username@ip-address
    ```


# Why doesn't everyone connect to your EC2?

- SSH require authentication, and there are two common methods
    - Username + password
    - SSH key pair (the method AWS typically uses)
- When you create EC2 instance, AWS generate SSH key pairs
    - Public Key: Stored on the EC2 instance.
    - Private Key: Downloaded to your laptop as a `.pem` file.
- `ssh -i cert.pem ubuntu@ip-address` , this is the command to connect your EC2 with authentication.

# Reverse-proxy (Nginx)

- **Nginx** is a high-performance web server that can also work as a **reverse proxy**, **load balancer**, and **API gateway**. It sits between users and your application to improve security, performance, and scalability.
- As a reverse proxy, it sits in front of your servers and receive request from users before passing it to the appropriate backend service.

    ```markdown
    User
                      │
            http://mywebsite.com
                      │
                      ▼
                 Port 80
                      │
                      ▼
            +----------------+
            |     Nginx      |
            +----------------+
                      │
          proxy_pass to :8080
                      │
                      ▼
            +----------------+
            |  Express App   |
            |  Port 8080     |
            +----------------+
    ```

- How does this remove `:8080` from `http://mywebsite.com:8080` ?
    - The browser sends request to port 80 where nginx receives it and Nginx is configured to say, “Whenever someone visits `/`, send that request to `localhost:8080`”

## What are the other benefits of using Nginx?


Nginx provides many benefits like —

- Serves websites over HTTP/HTTPS
- Works as a Reverse Proxy
- Load balances traffic between multiple servers
- Handles SSL/TLS certificates
- Serves static files efficiently
- Adds a security layer before your application
- Improves application performance

# TLS (Transport Layer Security)

- **TLS (Transport Layer Security)** is a security protocol that encrypts communication between a client (browser/app) and a server.
- It is the technology behind **HTTPS**, ensuring data is transmitted securely over the internet.
- Prevents attackers from reading or modifying data while it is in transit.
- Protects sensitive information such as:
    - Passwords
    - Credit card details
    - Personal information
    - API requests and responses
- Creates a **secure, encrypted tunnel** between the client and the server.
- Uses **public-key cryptography** to establish a secure connection, then switches to **symmetric encryption** for fast data transfer.
- Verifies the identity of the server using a **TLS certificate**, helping prevent impersonation attacks.
- Ensures three key security properties:
    - **Confidentiality** – Data is encrypted so only the intended recipient can read it.
    - **Integrity** – Data cannot be altered during transmission without detection.
    - **Authentication** – Confirms that the client is communicating with the legitimate server.
- Browsers display a **🔒 padlock icon** when a website has a valid TLS certificate and uses HTTPS.
- In a typical web application deployment:
    - The browser communicates with **Nginx** over **HTTPS (TLS)**.
    - Nginx decrypts the request and forwards it to the backend application (e.g., Express.js) over the local network.
- How TLS works?

    ```markdown
    Browser
        │
        │ ① Request HTTPS connection
        ▼
    Server
        │
        │ ② Sends TLS Certificate
        ▼
    Browser
        │
        │ ③ Verifies Certificate
        │
        │ ④ Creates an Encrypted Connection
        ▼
    Secure Communication Begins 🔒
    ```


# CDN (Content Delivery Network)

- CloudFront is the CDN service provided by AWS
- CDN takes the `source url` (S3) and provide a `distribution url`, which is used to access the content.
- A CDN  is a globally distributed group of servers that temporarily stores (or caches) website content near end users.
- When a user requests the content, the CDN intercepts the request and routes it to the nearest PoP(Points of Presence), serving the cached content locally. If the content isn't cached, the PoP retrieves it from the origin server, caches a copy for the next user, and passes it on.

## What are the benefits of using CDN?

- Accelerated Performance
- High Availability & Load Balancing
- Enhanced Security

# Steps to deploy react frontend on AWS

1. Build the react project. It will create a dist folder where HTML, CSS and Javascript of the project will be there along with assets.

    ```bash
    npm run build
    ```

2. If you want to run the project using this dist folder, you will need to globally install serve package.

    ```bash
    npm install -g serve
    
    # Now, when you cd to dist foler and run 'serve' command, it will run the project on localhost.
    ```

3. Create a new bucket on S3.
4. Upload the dist files in that bucket of S3.
5. Connect the S3 bucket to the CloudFront distribution.
6. Connect your own domain if you have. Also remember to connect the CloudFront url with DNS.
7. Add a default error page in CloudFront and redirect it to `index.html`.
8. Add CI/CD.

## Why are we not using EC2 to deploy frontend?

- Because EC2 doesn’t provide the CDN features, and every user will hit the single server where it is deployed.
