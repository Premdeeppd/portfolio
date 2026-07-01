---
title: "Express.js"
slug: "express-js"
description: "Building secure, scalable REST APIs with middleware, routing, and backend best practices."
featured: false
---


## General info

- Express.js is a Node.js framework which benefits features like less bulky code, more user readable, etc.
- Using _npm install express_ command express package can be installed in the project.
- We can use Express.js to make our personal computer server.
- There are 6 steps to create Express server.
    1. Create directory
    2. Create index.js file
    3. Initialising npm using npm init
    4. Install the express package
    5. Write server application in index.js file
    6. run the server using _node index.js_
- Code to create server

    ```javascript
    const express = require('express');
    const app = express();
    const port = 3000;
    
    app.listen(port, ()=>{
    	console.log('server is running on port ${port}.');
    });
    
    // the above code will result running server at port 3000. but since the application doesn't have request method, it will show 
    can not GET/
     which means no resources is being fetched to show.
    ```


## HTTP Request

- An HTTP request is made by a client, to a named host, which is located on a server. The aim of the request is to access a resource on the server.
    - There are several type of request methods like get, post, put, patch, delete etc.
        1. Get - Fetch resources
        2. Post - Sending resources
        3. Put - Updating resources
        4. Patch - Updating resources
        5. Delete - Delete resources

        **Go through the below code to understand http request:**


        ```javascript
        const express = require('express');
        const app = express();
        app.use(express.json());
        const port = 3000;
        
        //Lets make a mini-database/in memory storage
        let users = [{
            name : 'John',
            kidneys:[{
                healthy: true,
            },{
                healthy: false,
            }]
        }];
        
        app.get('/', (req, res) => {
            const johnKidneys = users[0].kidneys;
            const numberOfKidneys = johnKidneys.length;
            let healthyKidneys = 0;
            johnKidneys.forEach((kidney) => {
                if(kidney.healthy){
                    healthyKidneys++;
                }
            });
            const unhealthyKidneys = numberOfKidneys - healthyKidneys;
            res.json({
                numberOfKidneys,
                healthyKidneys,
                unhealthyKidneys,
            });
            }
        );
        app.post('/', (req, res) => {
            const isHealthy = req.body.isHealthy;
            users[0].kidneys.push({
                healthy: isHealthy
            });
            res.json({
                message: 'Kidney added'
            });
        });
        
        app.put('/',(req,res)=>{
            for(let i=0;i<users[0].kidneys.length;i++){
                users[0].kidneys[i].healthy = true;
            }
            res.json({
                message: 'All kidneys are changed to healthy'
            });
        })
        
        app.delete('/',(req,res)=>{
            users[0].kidneys.pop();
            res.json({
                message: 'Kidney deleted'
            });
        })
        
        
        app.listen(port, () => {
            console.log(`App listening at http://localhost:${port}`);
            }
        );
        ```

- Other than browser, app like postman can also be used to hit the backend.
- Write code to create a server that should be able to handle “/” endpoint?
    - Firstly perform step 1-5 to create the express server.
    - Now write the below code in index js file.

    ```javascript
    import express from "express";
    const app = express();
    const port = 3000;
    
    app.get("/",(req,res)=>{
        console.log(req);
    })
    app.listen(port,()=>{
        console.log("server is running at port "+ port);
    });
    
    // When we run the above code in application (index.js) and run the server and refresh the webpage (port:3000). then, all the request that browser make will be console logged.
    ```


    ```javascript
    import express from "express";
    const app = express();
    const port = 3000;
    
    app.get("/",(req,res)=>{
        res.send("<h1>Hello World!</h1>");
    })
    app.listen(port,()=>{
        console.log("server is running at port "+ port);
    });
    
    // When we run the above code in application (index.js) and run the server and refresh the webpage (port:3000). then, server send the response to the browser a string "Hello World!"
    ```

- HTTP return codes cheat sheet
    - 1** - Hold on
    - 2** - Here you go
    - 3** - Go away
    - 4** - You fucked up
    - 5** - I fucked up
- It the responsibility of programer to handle bad input and sent proper status code to client.

## Express request (req) object

- In Express, the request object (’req’) contains information about the HTTP request made by the client. It provide various properties and methods to access different aspects of the request.
- Some of the properties and methods of the `‘req’` object are below:

    **req.query:**

    - An object containing the parsed query parameters.
    - For example, if a request is made to `/search?term=express`, then `req.query` will be `{term: 'express'}`
    - Syntax:

        ```javascript
        app.get('/search', function(req, res) {
          const searchTerm = req.query.term;
          // Rest of the route handling logic
        });
        ```


    **req.body:**

    - An object containing the parsed request body.
    - You need to use middleware like `express.json()` or `express.urlencoded()` to parse the body.
    - `app.use(middleware)` is used to keep the middleware in every route request handler. It basically reduce the repetition.
    - Syntax:

        ```javascript
        app.post('/submit', express.json(), function(req, res) {
          const formData = req.body;
          // Rest of the route handling logic
        });
        
        // or
        
        app.use(express.json());
        app.post('/submit',function(req,res){
        	const formData = req.body;
        	// Rest of route handling logic
        })
        ```


    **req.params:**

    - An object containing properties mapped to the named route parameters.
    - For example, if your route is defined as `/users/:id`, and a request is made to `/users/123`, then `req.params` will have a property `id` with the value `123`.
    - Syntax:

        ```javascript
        app.get('/users/:id', function(req, res) {
          const userId = req.params.id;
          // Rest of the route handling logic
        });
        ```


    **req.cookies:**

    - An object containing the parsed cookies sent by the client.
    - You need to use the `cookie-parser` middleware to parse cookies.
    - Syntax:

        ```javascript
        const cookieParser = require('cookie-parser');
        app.use(cookieParser());
        
        app.get('/read-cookie', function(req, res) {
          const userCookie = req.cookies.user;
          // Rest of the route handling logic
        });
        ```


    **req.headers:**

    - Provides access to the HTTP headers sent by the client.
    - HTTP headers contain metadata about the request, and they are used to convey various information between the client and the server.
    - The `req.headers` object is an object where each key represents a header name, and the corresponding value is the value of that header.
    - Syntax:

        ```javascript
        app.get('/read-headers', function(req, res) {
          const userAgent = req.headers['user-agent'];
          const contentType = req.headers['content-type'];
          // Access other headers as needed
          // Rest of the route handling logic
        });
        ```


        **Here are some common HTTP headers and their purposes:**

        - **User-Agent**: Describes the user agent (e.g., browser) making the request.
        - **Content-Type**: Specifies the media type of the request body for POST and PUT requests.
        - **Accept**: Informs the server about the types of media that the client can process.
        - **Authorization**: Contains credentials for authentication.
        - **Cookie**: Contains any cookies associated with the request.
    - It's important to note that the `req.headers` object is read-only. If you need to modify or add headers to the response, you should use the `res.set()` method.
    - Syntax:

        ```javascript
        res.set('Content-Type', 'text/html');
        ```


## Express response (res) object

- In Express.js, the **response** object (**’res’**) represents the HTTP response that an Express app sends when it receives an HTTP request.
- The **`res`** object provides various methods and properties to customize and send the response back to the client.
- Some key aspects of the **`res`** object are below:

    **res.send([body]):**

    - Sends the HTTP response.
    - The **body** parameter can be a string, Buffer, JSON object, HTML, or other types, and it sets the response body.
    - Syntax:

        ```javascript
        app.get('/hello', function(req, res) {
          res.send('Hello, World!');
        });
        ```


    **res.json([body]):**

    - Sends a JSON response.
    - The **body** parameter can be any JSON-serializable data.
    - Syntax:

        ```javascript
        app.get('/json-example', function(req, res) {
          res.json({ message: 'Express is awesome!' });
        });
        ```


    **res.status(statusCode):**

    - Sets the HTTP status code for the response.
    - Syntax:

        ```javascript
        app.get('/not-found', function(req, res) {
          res.status(404).send('Not Found');
        });
        ```


## Middlewares

- Middleware is used to make pre-checks like authentication and input validation in more cleaner way.
- When we write route handler in express server, then there could be more than one callback. But we need next parameter to navigate throughout the callback. see the code below to understand:

```javascript
app.get("/", userMiddleware, kidenyMiddleware, function(req,res){
	//do something
})

//In the userMiddleware, there must me a next parameter so that excess reaches to kineyMiddleware and so on. see the code below

function userMiddleware(req,res,next){
	if(user!="prem" && password!="hello"){
		res.status(403).json({msg:"Incorrect Input"});
	}
	else{
		next();
	}
}
```

- Middleware can be used to count the number of user hit the url.

## Global catches

- This is an error-handler middleware putted in the last of all route handler. the purpose is, when something bad happens, the control reaches here and you can return some message to client that something bad happened.
- Unlike others, it take four parameters as input.
- The code for that is below:

```javascript
// All the other route handlers

app.use((err, req, res, next) => {
    // response to user with 403 error and details
});
```


## Zod (input validation library)

- Zod is basically used to do a better input validation.
- It can be used in express server for input validation and also can be used independently.

```javascript
const zod = require('zod');

//if this is an array of numbers with atleast 1 element, return true else false
const numberArraySchema = zod.array(zod.number()).nonempty();

function validateInput(arr){
    const response = numberArraySchema.safeParse(arr);
    console.log(response);
}
const temp = [1,2,3,"4"];
validateInput(temp);

//Output:
{ success: false, error: [Getter] }
```

- you can also write the zod validation in totally different file and import

```javascript
const zod = require('zod');

const createTodo = zod.object({
    title: zod.string(),
    description: zod.string(),
});

const updateTodo = zod.object({
    id: zod.string(),
});

module.exports = {
    createTodo,
    updateTodo,
};
```

- So basically, for using zod we first need to install the library using `npm install zod` and then define the required schema to validate.

## The fetch API

- Let say, we have an api url that someone else has written. and i want to hit the endpoint by clicking a button.
- The fake api is: [https://fakerapi.it/api/v1/persons](https://fakerapi.it/api/v1/persons)
- The code for the particular is below:

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Fetch API</title>
    </head>
    <body>
        <button onclick="getPersonData()"> Get Person Data</button>
        <script>
    			async function getPersonData(){
    		    const response = await fetch("https://fakerapi.it/api/v1/persons");
    		    const finalData = await response.json();
    		    console.log(finalData);
    			}
    		
    		</script>
    </body>
    </html>
    ```


## The axios API

- Axios provide a cleaner way to make HTTP request from both Node.js and the browser.

    ```javascript
    import axios from 'axios';
    
    <script>
    	async function getPersonData(){
    		 const response = await axios.get("https://fakerapi.it/api/v1/persons");
    		 //response.data
    		 console.log(response.data)	;
    </script>
    ```


## Authentication

- **Hashing:** When we put our secret password on any platform then the exact password is not stored in database. instead the corresponding hash is stored in the database to insure your security.
- Hashing makes it incredibly difficult to crack those hashes and uncover the real passwords.
- Hashing is irreversible; you can't take the hash value and figure out the original password.
- **Encryption:** Encryption takes your plain text password (e.g., "MySecret123") and uses a mathematical algorithm and a secret key to transform it into an unreadable format called ciphertext.
- Unlike hashing, encryption is reversible – if you have the right key, you can decipher the ciphertext back into the original password.
- **JWT:** It is neither of encryption or hashing. it is technically a digital signature.
- Anyone can see the original output given the signature. But signature can be verified only using the secret key.
- JWTs are a standardized (RFC 7519) way to securely represent claims (information) between two parties as a JSON object. They are small in size, making them convenient for transmission within URLs, HTTP headers, or POST parameters.
