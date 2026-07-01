---
title: "Typescript"
slug: "typescript"
description: "Building safer, scalable JavaScript applications with static typing and modern language features."
featured: false
---


# Why Typescript over Javascript ?

- Javascript is a loosely typed language.
- These are the benefits —
    - Catches bugs during development
    - Better autocomplete and IntelliSense
    - AI coding agents perform significantly better with typescript as it reduce hallucinations and logic bugs.
    - AI coding agents can run typescript compiler, read explicit error messages, and automatically fix its own mistakes.
    - Easy to catch error at compile time.
    - Easier Refactoring. Suppose you rename:

        ```typescript
        interface User {
            fullName: string;
        }
        
        // to
        
        interface User {
            name: string;
        }
        
        // TypeScript immediately tells you every place that still uses fullName.
        ```

    - Prevents incorrect function calls

        ```typescript
        function add(a: number, b: number) {
            return a + b;
        }
        
        add(5, 10);      // ✅
        add("5", 10);    // ❌ Error
        
        // Without typescript
        
        add("5", 10); // "510"
        ```

    - Makes code easier to maintain.

# What is Typescript ?

- Typescript is a programming language developed and maintained by Microsoft.
- It is strongly typed superset of JavaScript. This means that any valid JavaScript code is also valid TypeScript code, but TypeScript adds an extra layer of syntax to support **static typing.**

# How does typescript code run?

- Typescript never runs on browser. Your browser can only understand javascript.
- Typescript is transpiled down to javascript.
- When typescript is transpiled to javascript, it perform `type checking.`  If there is an error, the conversion to javascript fails.

    ![image.png](/content-images/notes/typescript-1.png)


# The tsc compiler

- `tsc`  is the official typescript compiler that you can use to convert `typescript` to `javascript`
- Install typescript globally using `npm install -g typescript`
- Use `tsc -b` to compile the typescript file, it will create a corresponding javascript file.

# The `tsconfig` file

- It is a configuration file, which has a bunch of options that you can change to change the compilation process.
- Some of the options are:

## Target

- The `target` option in a `tsconfig.json` file specifies the ECMAScript target version to which the TypeScript compiler will compile the TypeScript code.
- To try it out, try compiling the following code for target being `ES5` and `es2020`

    ```javascript
    const greet = (name: string) => `Hello, ${name}!`;
    
    //Output ES5
    
    "use strict";
    var greet = function (name) { return "Hello, ".concat(name, "!"); };
    
    //Because at that time, arrow functions was not defined. It would be really helpful if someone want to run the application in older browser.
    
    //Output ES2020
    
    "use strict";
    const greet = (name) => `Hello, ${name}!`;
    ```


## **rootDir**

- It defines, where should the compiler look for `.ts` files. Good practise is for this to be the `src` folder

## **outDir**

- It defined, where should the compiler look for spit out the `.js` files.

## **noImplicitAny**

- If it’s true, the compiler won’t throw error if someone didn’t explicitly mentioned `:type`

```javascript
const greet = (name) => `Hello, ${name}!`;
```


## **removeComments**

- Whether or not to include comments in the final `js` file.

# Interfaces

- Interfaces is used to assign types to the objects.

    ```typescript
    interface User {
    	firstName: string;
    	lastName: string;
    	email?: string; // ? defines optional.
    	age: number;
    }
    
    function isLegal(user: User) {
        if (user.age > 18) {
            return true
        } else {
            return false;
        }
    }
    
    console.log(
    	isLegal({
    		firstName: "Prem",
    		lastName: "Deep",
    		age: 24
    	})
    );
    ```


## Implementing interfaces

- Interfaces have an special property, You can implement interfaces as a class.

    ```typescript
    interface Person {
        name: string;
        age: number;
        greet(phrase: string): void;
    }
    
    
    class Employee implements Person {
        name: string;
        age: number;
    
        constructor(n: string, a: number) {
            this.name = n;
            this.age = a;
        }
    
        greet(phrase: string) {
            console.log(`${phrase} ${this.name}`);
        }
    }
    
    // Create an object (instance) of Employee
    const employee1 = new Employee("Prem", 24);
    
    // Access properties
    console.log(employee1.name); // Prem
    console.log(employee1.age);  // 24
    
    // Call the method
    employee1.greet("Hello, I'm"); // Hello, I'm Prem
    ```

- This is useful since now you can create multiple `variants` of a person (Manager, CEO …)

# Types

- Very similar to `interfaces`, types let you aggregate data together.

    ```typescript
    type User = {
    	firstName: string;
    	lastName: string;
    	age: number
    }
    ```

- It provides two extra features, that is not possible with `interfaces`

## 1. Union

- Let’s say you want define a variable which could be a number or a string. `type` let you do this.

    ```typescript
    type StringOrNumber = string | number;
    
    function printId(id: StringOrNumber) {
      console.log(`ID: ${id}`);
    }
    
    printId(101); // ID: 101
    printId("202"); // ID: 202
    ```


## 2. Intersection

- You can create a `type`  which could be the intersection of multiple `type`

    ```typescript
    type Employee = {
      name: string;
      startDate: Date;
    };
    
    type Manager = {
      name: string;
      department: string;
    };
    
    type TeamLead = Employee & Manager;
    
    const teamLead: TeamLead = {
      name: "prem",
      startDate: new Date(),
      department: "Software developer"
    };
    
    
    // It would be really helpful in a different role based application, where you are provind diffent access based on role they have.
    ```


# Arrays in TS

- If you want to define arrays in typescript, it’s as simple as adding a `[]` annotation next to the type.

    ```typescript
    function maxValue(arr: number[]) {
        let max = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i]
            }
        }
        return max;
    }
    
    console.log(maxValue([1, 2, 3]));
    
    //Given a list of users, filter out the users that are legal (greater than 18 years of age)
    
    interface User {
    	firstName: string;
    	lastName: string;
    	age: number;
    }
    
    function filteredUsers(users: User[]) {
        return users.filter(x => x.age >= 18);
    }
    
    console.log(filteredUsers([{
        firstName: "harkirat",
        lastName: "Singh",
        age: 21
    }, {
        firstName: "Raman",
        lastName: "Singh",
        age: 16
    }, ]));
    ```


# enum

- `enum` in typescript are a feature that allow you to define a set of named constants like — Direction (Up, Down, Left, Right). It provides a human readable way to represent a set of constant values. Also, it fastilate better suggestions for developers.

    ```typescript
    enum Direction {
        Up,
        Down,
        Left,
        Right
    }
    
    function doSomething(keyPressed: Direction) {
    	// do something.
    }
    
    doSomething(Direction.Up);
    
    // You can still define type variable with union
    
    type keyInput = "up" | "down" | "left" | "right"
    
    // But it doesn't provided the access like Direction.Up
    ```

- `enum` is just defined in typescript, there is no such things in javascript. So, when typescript codes are compiled, it underhood use some variable like, 0, 1, 2, 3.
- What do you think, `console.log(Direction.Up)` will return?
    - It returns `0`
- But, you can definitely choose what value the javascript should use under the hood.

    ```typescript
    enum Direction {
        Up = "UP",
        Down = "Down",
        Left = "Left",
        Right = 'Right'
    }
    
    function doSomething(keyPressed: Direction) {
    	// do something.
    }
    
    doSomething(Direction.Down)
    
    console.log(Direction.Up); // Return: "UP"
    ```

- There is a very common use case of `enum` in express.

    ```typescript
    enum ResponseStatus {
        Success = 200,
        NotFound = 404,
        Error = 500
    }
    
    app.get("/', (req, res) => {
        if (!req.query.userId) {
    			res.status(ResponseStatus.Error).json({})
        }
        // and so on...
    		res.status(ResponseStatus.Success).json({});
    })
    ```


# Generics

- Let’s say you need to define a `function`, which could take an `string` as an argument or a `number` as an argument. What `type` of argument will you mention during defining function?
- Generics help you to define a generic data type , `<T>`. And you can assign the data type at the time of use.

    ```typescript
    function identity<T>(arg: T){
    	return arg;
    }
    
    let output1 = identity<string>("myString");
    let output2 = identity<number>(100);
    ```

- Think of generic as it give a multiple variation of the function (variation in argument data type).
