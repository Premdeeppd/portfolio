---
title: "MongoDB"
slug: "mongodb"
description: "Schema design, indexing, queries, aggregation, and performance optimization in MongoDB."
featured: false
---


# General

- The database is not exposed to users. The user hits the backend to fetch only the required data from database. The backend hits the database to extract the required data.
- MongoDB is NoSQL database.
- It is schemaless database.
- mongoose library lets you connect the mongoDB database to backend.

# Connect MongoDB database using mongoose

- Install mongoose using `npm install mongoose`
- Below is the required syntax to connect the mongodb database

    ```javascript
    //File: src/config/db.js
    
    import mongoose from "mongoose";
    import env from "./env.js";
    
    export async function connectDB() {
      try {
        await mongoose.connect(env.MONGO_URI);
        console.log("MongoDB connected successfully");
      } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure code 1 if the database connection fails.
      }
    }
    
    //File: src/server.js
    ```

- In Mongoose schemas, you must use capitalized data types. because Mongoose schema data types are based on native JavaScript constructors.  These constructors are always capitalized

# MongoDB Indexes


## What is an Index?

- An index is a **separate data structure** that MongoDB creates to make queries faster.
- It stores **indexed field values** in sorted order along with **pointers to the actual documents**.
- The original documents are **not reordered**.

---


## Why are Indexes Needed?

- Without an index, MongoDB performs a **Collection Scan (COLLSCAN)**.
- It checks every document until it finds the matching one.
- Time increases as the collection grows.

Example:


```javascript
User.findOne({ email: "prem@example.com" });
```


Without an index:

- Checks every document one by one.

With an index:

- Directly navigates to the matching document.

---


## How MongoDB Stores Indexes

- MongoDB uses a **B-tree (specifically a B+ Tree)** data structure for indexes.
- The B-tree stores:
    - Indexed field value
    - Pointer (reference) to the actual document
- Documents remain stored separately.

Visualization:


```plain text
Index

prem@example.com  ---> Document Pointer
rahul@gmail.com   ---> Document Pointer
```


---


## Why B-tree?

- Fast search, fast insertion, fast deletion, automatically remains balanced

---


## Creating an Index


### Using Schema


```javascript
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        index: true
    }
});
```


### Using `schema.index()`


```javascript
userSchema.index({ email: 1 });
```


---


## Compound Index


Example:


```javascript
orderSchema.index({
    userId: 1,
    status: 1
});
```


Useful when queries frequently use multiple fields.


Example query:


```javascript
Order.find({
    userId: userId,
    status: "Delivered"
});
```

- MongoDB can directly locate matching entries instead of filtering after finding `userId`.
- Order matters in compound index.

---


## Advantages

- Faster `find()`
- Faster `findOne()`
- Faster filtering
- Faster sorting
- Improves performance for many aggregation pipelines
- Reduces collection scans

---


## Disadvantages

- Uses extra disk space.
- Slightly slower inserts.
- Slightly slower updates.
- Slightly slower deletes.
- Every write operation must also update the index.

---


## Best Practices

- Index fields that are queried frequently.
- Index fields used for filtering.
- Index fields used in sorting.
- Index foreign/reference fields (e.g., `userId`).
- Avoid indexing every field.
- Remove unused indexes to reduce storage and write overhead.

---


## Interview Takeaways

- MongoDB indexes are implemented using **B+ trees**.
- Indexes store **field values + document pointers**, not entire documents.
- Indexes speed up reads but add overhead to writes.
- Compound indexes follow the **leftmost prefix rule**.
- Create indexes based on **query patterns**, not on every field.
- Use `explain()` to verify that MongoDB is using the expected index rather than performing a collection scan.
