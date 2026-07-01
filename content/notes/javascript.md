---
title: "Javascript"
slug: "javascript"
description: "Deep dives into core concepts, asynchronous programming, and how JavaScript works under the hood."
featured: false
---


### Table of Contents


### General Javascript

- To find whether, an element is present in the array or not, `arr.includes(x)`can be used. It return boolean value.

### String related properties 

- **`string.replace(/\s+/g, ' ')`**
    - It is used to replace more than one space with a single space.
    - Here, g flag is used to replace all such occuring spaces rather than just first.
- **length**
    - Returns the number of characters in a string.
    - Example: `let str = "Hello"; console.log(str.length); // Output: 5`
- **indexOf()**
    - Returns the index of the first occurrence of a specified substring.
    - Example: `let str = "Hello World"; console.log(str.indexOf("World")); // Output: 6`
- **lastIndexOf()**
    - Returns the index of the last occurrence of a specified substring.
    - Example: `let str = "Hello World"; console.log(str.lastIndexOf("o")); // Output: 7`
- **slice()**
    - Extracts a section of a string and returns a new string.
    - Example: `let str = "Hello World"; console.log(str.slice(0, 5)); // Output: Hello`
- **substring()**
    - Similar to `slice()`, but does not allow negative indices.
    - Example: `let str = "Hello World"; console.log(str.substring(6, 11)); // Output: World`
- **replace()**
    - Replaces a specified substring with another substring.
    - Example: `let str = "Hello World"; console.log(str.replace("World", "Universe")); // Output: Hello Universe`
- **split()**
    - Splits a string into an array of substrings based on a specified delimiter.
    - Example: `let str = "apple,orange,banana"; console.log(str.split(",")); // Output: ["apple", "orange", "banana"]`
- **trim()**
    - Removes whitespace (spaces, tabs, and newlines) from both ends of a string.
    - Example: `let str = " Hello "; console.log(str.trim()); // Output: Hello`
- **toUpperCase()**
    - Converts all characters in a string to uppercase.
    - Example: `let str = "hello"; console.log(str.toUpperCase()); // Output: HELLO`
- **toLowerCase()**
    - Converts all characters in a string to lowercase.
    - Example: `let str = "HELLO"; console.log(str.toLowerCase()); // Output: hello`
- **join()**
    - The `join(separator)` method returns an array as a string. It doesn’t change the original array.
    - The default seperator is comma.
- **parseInt()**
    - Converts a string to an integer (whole number).
    - Takes two parameters: the string to be converted and an optional radix (base for the numeral system, default is 10).
    - Leading whitespaces are ignored.
    - Stops parsing when a non-digit character is encountered.
    - Example:

        ```javascript
        javascriptCopy code
        let str = "123px34";
        let num = parseInt(str);
        console.log(num); // Output: 123
        ```

- **parseFloat()**
    - Converts a string to a floating-point number (decimal number).
    - Similar to **`parseInt()`**, but includes support for decimal points.
    - Leading whitespaces are ignored.
    - Stops parsing when a non-digit character (except for the decimal point) is encountered.
    - Example:

        ```javascript
        javascriptCopy code
        let str = "123.45";
        let num = parseFloat(str);
        console.log(num); // Output: 123.45
        ```


### Array related properties

- In JavaScript, arrays are objects and are stored by reference. When you use `a = b`, you're simply copying the reference (memory address) and not the actual array data. Any modification to the elements of `a` will also change the elements of `b`, and vice versa, since they both reference the same data.
- **push()**
    - Adds one or more elements to the end of an array.
    - Modifies the original array.
    - Example:

        ```javascript
        let arr = [1, 2, 3];
        arr.push(4);
        console.log(arr); // Output: [1, 2, 3, 4]
        ```

- **pop()**
    - Removes the last element from an array.
    - Modifies the original array.
    - Example:

        ```javascript
        let arr = [1, 2, 3];
        arr.pop();
        console.log(arr); // Output: [1, 2]
        ```

- **shift()**
    - Removes the first element from an array.
    - Modifies the original array.
    - Example:

        ```javascript
        let arr = [1, 2, 3];
        arr.shift();
        console.log(arr); // Output: [2, 3]
        ```

- **unshift()**
    - Adds one or more elements to the beginning of an array.
    - Modifies the original array.
    - Example:

        ```javascript
        let arr = [2, 3];
        arr.unshift(1);
        console.log(arr); // Output: [1, 2, 3]
        ```

- **splice()**
    - Changes the contents of an array by removing or replacing existing elements and/or adding new elements in place.
    - Modifies the original array.
    - Example:

        ```javascript
        let arr = [1, 2, 3, 4, 5];
        arr.splice(2, 1, 'a', 'b');
        console.log(arr); // Output: [1, 2, 'a', 'b', 4, 5]
        
        //remove 1 element at index 2 and add 'a' and 'b' at the same index 2
        ```

- **slice()**
    - Returns a shallow copy of a portion of an array into a new array.
    - Does not modify the original array.
    - Example:

        ```javascript
        let arr = [1, 2, 3, 4, 5];
        let slicedArr = arr.slice(1, 4);
        console.log(slicedArr); // Output: [2, 3, 4]
        ```

- **concat()**
    - Combines two or more arrays and returns a new array.
    - Does not modify the original arrays.
    - Example:

        ```javascript
        let arr1 = [1, 2];
        let arr2 = [3, 4];
        let newArr = arr1.concat(arr2);
        console.log(newArr); // Output: [1, 2, 3, 4]
        ```

- **forEach()**
    - Executes a provided function once for each array element.
    - Does not create a new array.
    - Example:

        ```javascript
        let arr = [1, 2, 3];
        arr.forEach(item => console.log(item)); // Output: 1, 2, 3
        ```

- **map()**
    - Creates a new array by calling a provided function on every element in the array.
    - Example:

        ```javascript
        javascriptCopy code
        let arr = [1, 2, 3];
        let mappedArr = arr.map(item => item * 2);
        console.log(mappedArr); // Output: [2, 4, 6]
        ```

- **filter()**
    - Creates a new array with all elements that pass the test implemented by the provided function.
    - Example:

        ```javascript
        let arr = [1, 2, 3, 4, 5];
        let filteredArr = arr.filter(item => item % 2 === 0);
        console.log(filteredArr); // Output: [2, 4]
        ```

- **reduce()**
    - Applies a function against an accumulator and each element in the array (from left to right) to reduce it to a single value.
    - Example:

        ```javascript
        let arr = [1, 2, 3, 4];
        let sum = arr.reduce((accumulator, current) => accumulator + current, 0);
        console.log(sum); // Output: 10
        ```

- **find()**
    - Returns the first element in the array that satisfies the provided testing function.
    - The `find()` method returns the value of the first element that passes a test.
    - The `find()` method executes a function for each array element.
    - The `find()` method returns `undefined` if no elements are found.
    - Example:

        ```javascript
        let arr = [1, 2, 3, 4, 5];
        let found = arr.find(item => item > 2);
        console.log(found); // Output: 3
        ```

- **sort()**
    - Sorts the elements of an array in place.
    - Modifies the original array.
    - Example:

        ```javascript
        let arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
        arr.sort();
        console.log(arr); // Output: [1, 1, 2, 3, 3, 4, 5, 5, 6, 9]
        ```


### Let declaration

- The **`let`** declaration declares re-assignable, block-scoped local variables, optionally initializing each to a value.

    ```javascript
    let name1;
    let name1 = value1;
    let name1 = value1, name2 = value2;
    let name1, name2 = value2;
    let name1 = value1, name2, /* …, */ nameN = valueN;
    ```

- `let` declarations are scoped to blocks as well as functions.
- Let declaration can not be redeclared by any declaration in same scope.
- you cannot use a lone `let` declaration as the body of a block (which makes sense, since there's no way to access the variable).
- It is always recommend to use `const` over `let` whenever a variable is not reassigned in its scope.

### Functions in javascript


**Callback function**

- A callback function is a function passed as an argument to another function.
- Callbacks are generally used as arguments in higher order functions, such as array method (forEach, map, filter), event handlers, and asynchronous functions.
- It can be defined inline as anonymous function. Example:

    ```javascript
    array.forEach(function(item) {
      console.log(item);
    });
    ```

- Callbacks can also be pre-defined named functions. Example:

    ```javascript
    function handleItemClick(item) {
      console.log(item);
    }
    
    array.forEach(handleItemClick);
    ```

- It is also used in asynchronous operations, like handling responses from APIs or file system operations.

    ```javascript
    fetchDataFromAPI(function(response) {
      console.log(response);
    });
    ```

- It is also used to handle events in the browser, such as button clicks or mouse events.

    ```javascript
    button.addEventListener('click', function() {
      console.log('Button clicked!');
    });
    ```

- When dealing with multiple nested callbacks, it can lead to the **callback hell** or pyramid of doom, making the code hard to read and maintain. and this can be solved using named functions, promises, or async/await syntax.
- Callbacks can handle errors by convention, typically by having an error parameter as the first argument.

    ```javascript
    function fetchDataFromAPI(callback) {
      if (error) {
        callback(error, null);
      } else {
        callback(null, data);
      }
    }
    ```

- Callbacks often involve closures, where the inner function has access to variables from the outer (enclosing) function even after the outer function has finished executing.

### Temporal Dead Zone (TDZ)

- A variable declared with `let`, `const`, or `class` is said to be in a "temporal dead zone" (TDZ) from the start of the block until code execution reaches the place where the variable is declared and initialized.
- While inside the TDZ, the variable has not been initialized with a value, and any attempt to access it will result in a `ReferenceError`. The variable is initialized with a value when execution reaches the place in the code where it was declared. If no initial value was specified with the variable declaration, it will be initialized with a value of `undefined`.
- This differs from `var` variables, which will return a value of `undefined` if they are accessed before they are declared.

    ```javascript
    {
      // TDZ starts at beginning of scope
      console.log(bar); // "undefined"
      console.log(foo); // ReferenceError: Cannot access 'foo' before initialization
      var bar = 1;
      let foo = 2; // End of TDZ (for foo)
    }
    ```

- The term "temporal" is used because the zone depends on the order of execution (time) rather than the order in which the code is written (position).

    ```javascript
    {
      // TDZ starts at beginning of scope
      const func = () => console.log(letVar); // OK
    
      // Within the TDZ letVar access throws `ReferenceError`
    
      let letVar = 3; // End of TDZ (for letVar)
      func(); // Called outside TDZ!
    }
    ```


### Client-side web APIs

- Application Programming Interfaces (APIs) are constructs made available in programming languages to allow developers to create complex functionality more easily. They abstract more complex code away from you, providing some easier syntax to use in its place.
- These are not part of the JavaScript language itself, rather they are built on top of the core JavaScript language, providing you with extra superpowers to use in your JavaScript code.
- It generally falls into two categories.
    - Browser APIs: Built into your web browser and are able to expose data from the browser and surrounding computer environment and do useful complex things with it.
        - Examples: APIs for manipulating documents, APIs that fetch data from server, APIs for drawing and manipulating graphics, etc
    - Third-party APIs: You have to retrieve their code and information from somewhere on the Web.
        - Examples: Twitter APIs, Facebook suite APIs, etc
- APIs consists of number of objects. Your code interacts with APIs using one or more Javascript Objects, which serve as containers for the data the API uses (contained in object properties), and the functionality the API makes available (contained in object methods).
- When using an API, you should make sure you know where the entry point is for the API. In The Web Audio API, this is pretty simple — it is the `AudioContext` object, which needs to be used to do any audio manipulation whatsoever.

### Javascript Classes

- Classes are template for creating objects. It encapsulate data with code to work on that code.
- Classes are special function. Just like function can be defined as function declaration and function expression. Classes can also be defined as class declaration and class expression.

    ```javascript
    // Declaration
    class Rectangle {
      constructor(height, width) {
        this.height = height;
        this.width = width;
      }
    }
    
    // Expression; the class is anonymous but assigned to a variable
    const Rectangle = class {
      constructor(height, width) {
        this.height = height;
        this.width = width;
      }
    };
    
    // Expression; the class has its own name but The expression's name is only visible to the class's body.
    
    const Rectangle = class Rectangle2 {
      constructor(height, width) {
        this.height = height;
        this.width = width;
      }
    };
    new rectangle2(); //ReferenceError: MyClassLongerName is not defined
    ```

- Classes create objects through the `new` operator.
- Each object has some properties (data or method) added by the class.
- The class stores some properties (data or method) itself, which are usually used to interact with instances.
- There are three key features of classes
    - Constructor
    - Instance method and instance field
    - Static method and static field
- Within a class, there are a range of features available.

    ```javascript
    class MyClass {
      // Constructor
      constructor() {
        // Constructor body
      }
      // Instance field
      myField = "foo";
      // Instance method
      myMethod() {
        // myMethod body
      }
      // Static field: It can be accessed without making and object. means we can access it by class only. like: MyClass.myStaticField.
    
      static myStaticField = "bar";
      // Static method
      static myStaticMethod() {
        // myStaticMethod body
      }
      // Static block
      static {
        // Static initialization code
      }
      // Fields, methods, static fields, and static methods all have
      // "private" forms
      #myPrivateField = "bar";
    }
    ```

- After a class has been declared, you can create instances of it using the `new` operator.

    ```javascript
    const myInstance = new MyClass();
    //It create a Myclass instance with all the properties of Myclass
    console.log(myInstance.myField); // 'foo'
    myInstance.myMethod();
    
    //Typical function constructors can both be constructed with new and called without new. However, attempting to "call" a class without new will result in an error. see the code below:
    
    const myInstance = MyClass(); // TypeError: Class constructor MyClass cannot be invoked without 'new'
    ```

- **Each time you call** **`new`****, a different instance is created. Within a class constructor, the value of** **`this`** **points to the newly created instance. The** **`this`** **value will be automatically returned as the result of** **`new`****.**

    ```javascript
    class Color {
      constructor(r,g,b) {
        this.values = {r,g,b};
      }
    }
    
    const red = new Color(255, 0, 0);
    // Creates an instance with the same shape as above.
    
    //The same thing can also be done through normal function
    
    function createColor(r, g, b) {
      return {
        values: [r, g, b],
      };
    }
    
    //The above code will also return the same object. The advantage of class we will see when will using instance methods
    ```

- You are advised to not return any value from the constructor — because if you return a non-primitive value, it will become the value of the `new` expression, and the value of `this` is dropped.

    ```javascript
    class MyClass {
      constructor() {
        this.myField = "foo";
        return {};
      }
    }
    
    console.log(new MyClass().myField); // undefined
    ```

- If a class only has a constructor, it is not much different from a `createX` factory function which just creates plain objects. However, the power of classes is that they can be used as "templates" which automatically assign methods to instances.
- For example, for `Date` instances, you can use a range of methods to get different information from a single date value, such as the year, month, day of the week, etc. You can also set those values through the `setX` counterparts like `setFullYear`.

    ```javascript
    class Color {
      constructor(r, g, b) {
        this.values = [r, g, b];
      }
      getRed() {
        return this.values[0]; //this keyword point to the property and method of the instance object created
      }
    }
    
    const red = new Color(255, 0, 0);
    console.log(red.getRed()); // 255
    ```

- You might be wondering: why do we want to go to the trouble of using  `getRed`  and  `setRed`  methods, when we can directly access the `values` array on the instance? There is a philosophy in object-oriented programming called "encapsulation". This means you should not access the underlying implementation of an object, but instead use well-abstracted methods to interact with it.

### Async, Await and Promises

- `setTimeout, fs.readFile, fetch` is an asynchronous function.
- when the asynchronous function is completed then firstly it go into callback queue then in call stack to execute.
- Promises is just a syntactical sugar that make the code more readable. The reason to introduce promises is to get rid of callback hell.
- It is done using two things: promise chaining and async await
- The instance of promises is returned synchronously, but the async function under promises is returned asynchronously.
- Syntax of promises:

    ```javascript
    // Ugly way to write an asychronous function
    
    const fs = require('fs');
    
    function premReadFile(func){
      fs.readFile('a.txt', 'utf-8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        func(data);
      });
    };
    function onDone(x){
      console.log(x);
    };
    premReadFile(onDone);
    
    //Prettier way to write an asychronous function with promises.
    
    const fs = require('fs');
    function premReadFile(){
      return new Promise(function(resolve){
        fs.readFile('a.txt', 'utf-8', function(err, data){
          if (err) {
            console.log(err);
            return;
          }
          resolve(data);
        })
      })
    }
    function onDone(x){
      console.log(x);
    };
    let temp = premReadFile();
    temp.then(onDone);
    
    // simple async function doesn't return anything but a promisified function return promise.
    
    // simple async function takes callback as input. but a promisified function don't take callback as input.
    
    // Here, basically the resolve function is actiong as callback. which can be accessed using .then method. means, whatever function you will pass using .then method. It will be called asynchronously as defined in promise function.
    
    // Other way to think: When the async function completed. the resolve function is called and whatever parameter you pass in resolve function. It will atomatically passed into the function you specify inside .then
    ```

- .then is called whenever the async function is resolves
- Like Date, Promise is also a pre-defined class. default constructor need at least a function.
- Promise has three states, namely - pending, resolved and rejected.
- Async await is also just a syntactic sugar.
- Syntax of async await

    ```javascript
    //Ugly code
    
    function premAsyncFunction(){
      return new Promise(function(resolve){
        //do some async stuff
        resolve("hi there")
      })
    }
    function main(){
      premAsyncFunction().then(function(result){
        console.log(result)
      })
    }
    main();
    
    //Pretty code
    
    function premAsyncFunction(){
      return new Promise(function(resolve){
        //do some async stuff
        resolve("hi there")
      })
    }
    async function main(){
      let result = await premAsyncFunction(); // this will not return promise, rather it will return the resolved function.
      console.log(result) 
    }
    main();
    ```


### Promise all() Method

- The **Promise.all() method** is actually a method of the Promise object.
- Promise is also an object under JavaScript used to handle all the asynchronous operations.
- `Promise.all` waits for **all** the promises in the provided iterable to **resolve** (successfully complete) before it resolves itself.
- If **any** of the promises in the iterable **rejects** (encounters an error),  `Promise.all`  immediately **rejects** itself, ignoring the remaining promises and adopting the **first rejection reason** encountered.
- Once all promises resolve, `Promise.all` resolves itself with an **array** containing the **resolved values** of each individual promise in the order they were provided.
- **Syntax:**
    - `Promise.all(iterable)`
    - **Parameter:**This method accepts a single parameter **iterable** which takes an array of _promises_ or a normal array that contains some objects.
    - **Return values:** It follows some rules to return a single promise:
        - If passed argument is empty, it returns a Promise that is already _resolved_.
        - If the passed iterable contains no promises, it returns a Promise that is resolved _asynchronously_.
        - For all other cases, it returns a pending Promise.

    ```javascript
    p1 = Promise.resolve(50);
    p2 = 200;
    p3 = new Promise(function (resolve, reject) {
    	setTimeout(resolve, 100, 'geek');
    });
    
    Promise.all([p1, p2, p3]).then(function (values) {
    	console.log(values);
    });
    ```


### Javascript Timing Events

- `setTimeout(`_`function, milliseconds)`_
    - Executes a function, after waiting a specified number of milliseconds.
- `setInterval(`_`function, milliseconds`_)
    - Same as setTimeout(), but repeats the execution of the function continuously.
- The `clearTimeout(timeoutVariable)` method stops the execution of the function specified in setTimeout().
- The `clearInterval(intervalVariable)` method stops the executions of the function specified in the setInterval() method.
- `setInterval` function is used to repeatedly execute a given function at specified intervals. The function returns a unique identifier (object), which can be used to later clearInterval to stop the repeated execution. This is the reason for storing the identifier in a variable.

### DOM API

- The DOM (Document Object Model) API is a programming interface for web documents. It represents the page so that programs can change the document structure, style, and content. The DOM represents the document as a tree of objects; each object represents a part of the page.
- If you want to show something to page. just push that element to the DOM.
- Whenever you need to make a dynamic website. DOM will come into the picture.
- **DOM API Methods**
    1. **Accessing Elements:**
        - **`document.getElementById()`**: Gets an element by its ID.
        - **`document.getElementsByClassName()`**: Gets elements by their class name.
        - **`document.getElementsByTagName()`**: Gets elements by their tag name.
        - **`document.querySelector()`**: Gets the first element that matches a CSS selector.
        - **`document.querySelectorAll()`**: Gets a list of all elements that match a CSS selector.
    2. **Manipulating Elements:**
        - **`element.innerHTML`**: Gets or sets the HTML content of an element.
        - **`element.innerText`** or **`element.textContent`**: Gets or sets the text content of an element.
        - **`element.setAttribute()`**: Sets the value of an attribute on the specified element.
        - **`element.style.property = value`**: Sets the inline CSS style of an element.
        - **`element.classList.add/remove/toggle`**: Manipulates classes of an element.
    3. **Creating and Removing Elements:**
        - **`document.createElement()`**: Creates a new element.
        - **`parentElement.appendChild()`**: Appends a node as the last child of a parent element.
        - **`parentElement.removeChild()`**: Removes a child node from a parent element.
    4. **Event Handling:**
        - **`element.addEventListener()`**: Attaches an event handler to an element.
        - **`element.removeEventListener()`**: Removes an event handler from an element.
        - Common events: click, mouseover, mouseout, keydown, submit, etc.
- **General Syntax**

    ```javascript
    <html>
    <body>
      <input type="text" id="first" placeholder="First Number"></input> <br></br>
      <input type="text" id="second" placeholder="Secound Number"></input><br></br>
      <button id="calculate" onClick="Calculate()">Calculate</button>
      <div id="result"></div>
      <script>
    		async function Calculate() {
    	  var first = document.getElementById("first").value;
    	  var second = document.getElementById("second").value;
    		var response = await fetch(`https://sum-server.100xdevs.com/sum?a=${parseInt(first)}&b=${parseInt(second)}`);
    	  var answer = await response.text();
    	  document.getElementById("result").innerHTML = answer;
    }
    	</script>
    </body>
    </html>
    ```


### Debouncing and Throttling


Both are techniques used to control the rate at which a function executes, improving performance and efficiency.

- Debouncing
    - Ensures a function runs **only after a specified delay** since the last time it was invoked.
    - Commonly used to handle **frequent events** like keystrokes or window resizing.
    - Prevents multiple unnecessary executions by waiting for the user to “pause” their actions.
    - Example use case: Search bar input — triggers the API call **only after the user stops typing** for a certain period.
- Throttling
    - Ensures a function runs **at regular intervals**, no matter how many times the event is triggered.
    - Limits the function execution rate to **once per specified time frame**.
    - Useful for performance-heavy operations that happen continuously.
    - Example use case: Scroll event — executes a function **once every X milliseconds** while scrolling
