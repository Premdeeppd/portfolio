---
title: "SQL"
slug: "sql"
description: "Mastering relational databases through efficient queries, schema design, joins, indexing, and optimization."
featured: false
---


# Basics:

- SQL stands for standard query language.
- SQL lets you access and manipulate database.
- SQL is query programming language used for managing RDMS(Relational database management system)

```sql
CREATE DATABASE college;
/* the above code is used to create a database, named college. SQL is not case sensitive, ie -create database is also a valid query. It will give same result as above. */

CREATE DATABASE IF NOT EXISTS college;
/* after adding if not exists, if college database is already exist then it will not throw error, instead it will give warning that the given database is already there so not creating the database */

DROP DATABASE college;
/* the above code is used to delete the college database. */

DROP DATABASE IF EXISTS school;
/* if exists command is used to prevent error */

USE college;
/* after executing the above code, what ever the query we will write, it will access and manipulate the college database. */

CREATE TABLE table_name( 
column_name1 datatype constraint, 
column_name2 datatype constraint,
column_name2 datatype constraint
);

// Example of above template to create a table in college database.

CREATE TABLE student( 
id INT PRIMARY KEY, 
name VARCHAR (50),
age INT NOT NULL
);

/* This code will create a table named student. In which there are three columns of different datatype and having some constraint, that will be discussed later */

INSERT INTO student VALUES(1, "Prem" , 22);
INSERT INTO student VALUES(2, "Deep" , 21);

/* The above code is used to add data to a given table (here student) */

SELECT * FROM student;

/* The above code is used to print all the rows and column of student table. */

SHOW DATABASE;
/* it is used to show all the database exists */

SHOW TABLES;
/* it is used to show all the tables in the database using */
```


# Types of SQL Command:

1. DDL (Data Definition Language): create, alter, rename, truncate and drop
2. DQL (Data query language): select
3. DML (Data manipulation language): insert, update, delete
4. DCL (Data control language): grant and revoke permission to users
5. TCL (Transaction control language): start transaction, commit, rollback, savepoint

# Database related queries:


```sql
CREATE DATABASE college;
/* the above code is used to create a database, named college. SQL is not case sensitive, ie -create database is also a valid query. It will give same result as above. */

CREATE DATABASE IF NOT EXISTS college;
/* after adding if not exists, if college database is already exist then it will not throw error, instead it will give warning that the given database is already there so not creating the database */

DROP DATABASE college;
/* the above code is used to delete the college database. */

DROP DATABASE IF EXISTS school;
/* if exists command is used to prevent error */

SHOW DATABASE;
/* it is used to show all the database exists */
```


# Table related queries:


```sql
CREATE DATABASE college;
USE college;

CREATE TABLE student(
rollno INT PRIMARY KEY,
name VARCHAR(50)
);

SELECT * FROM student;
/* the above code will return all the columns of student table */

INSERT INTO student;
(rollno, name)
VALUES
(101, "Prem"),
(102, "Deep"),
(103, "Akash");

/* the above code will insert three rows in student table with respective data. */
```


# Primary key and Foreign key:

1. Primary Key:
    - It is a column (or set of columns) in a table that uniquely identifies each row. (a unique id)
    - There is only 1 primary key & it should be NOT null.
2. Foreign Key:
    - A foreign key is a column (or set of columns) in a table that refers to the primary key in other table
    - There can be multiple foreign keys.
    - Foreign key can have duplicate as well as null values.

# Data Constraints:


```sql
// SQL constraints is used to specify specific rules for data in a table.

rollno INT NOT NULL; // means the rollno column can't have null values.

rollno INT UNIQUE; // means the rollno column must have unique values.

id INT PRIMARY KEY; // means must be unique and not null and also it should be used only for one.

// A combination of two column can also be made primary key. the syntex for the same is below.

CREATE TABLE xyz(
rollno INT,
name VARCHAR(50),
marks INT,
PRIMARY KEY (rollno, name)
);
// which means the combination of rollno and name will be always unique

CREATE TABLE abc(
cust_id INT,
FOREIGN KEY (cust_id) REFERENCES xyz (rollno)
);
// above is the syntex to implement foreign key

salary INT DEFAULT 25000; // used to set a default value.

// CHECK constraint is used to limit value in column

CREATE TABLE city(
id INT PRIMARY KEY,
name VARCHAR(50),
age INT,
CONSTRAINT age_check CHECK (age>=18 AND name = "Delhi")
);

age INT CHECK(age>=18);
/* the above code will only allow the value that satisfy the given constraint*/
```


# SQL Operators

- **SQL Arithmetic Operators**

    | Operator | Description |
    | -------- | ----------- |
    | +        | Add         |
    | -        | Subtract    |
    | *        | Multiply    |
    | /        | Divide      |
    | %        | Modulo      |

- **SQL Bitwise Operators**

    | Operator | Description          |
    | -------- | -------------------- |
    | &        | Bitwise AND          |
    | |        | Bitwise OR           |
    | ^        | Bitwise exclusive OR |

- **SQL Compound Operators**

    | Operator | Description              |
    | -------- | ------------------------ |
    | +=       | Add equals               |
    | -=       | Subtract equals          |
    | *=       | Multiply equals          |
    | /=       | Divide equals            |
    | %=       | Modulo equals            |
    | &=       | Bitwise AND equals       |
    | ^-=      | Bitwise exclusive equals |
    | |*=      | Bitwise OR equals        |

- **SQL Comparison Operators**

    | Operator | Description            |
    | -------- | ---------------------- |
    | =        | Equal to               |
    | >        | Greater than           |
    | <        | Less than              |
    | > =      | Greater than equal to  |
    | < =      | Less than equal to     |
    | <>       | Not equal to           |


# SELECT Command (DQL)


```sql
SELECT rollno, marks FROM student;
/* the above code will select rollno and marks column of student table */

SELECT * FROM student;
/* the above code will select all the column of student table */

SELECT DISTINCT city FROM student;
/* the above code will return city column with only distinct city */

SELECT * FROM student WHERE marks>=80;
// the above code will return table with student having marks>=80 

SELECT * 
FROM student 
WHERE marks BETWEEN 80 AND 90;
// the above code will only return the rows having marks between 80 & 90

WHERE city IN ("Delhi", "Mumbai");
// search for Delhi and Mumbai city only 

WHERE city NOT IN ("Delhi", "Mumbai");
// return rows with city other than Delhi and Mumbai 


//Where clause can contain one or many 
AND Operator.

SELECT * FROM Customers
WHERE Country = 'Spain' AND CustomerName LIKE 'G%';

SELECT * 
FROM student
LIMIT 3;
// Will return only 3 rows

SELECT * 
FROM student
ORDER BY city ASC/DECS;
// will return the rows in ascendig or descending order


// Aggregate function: 
Aggregate functions perform a calculation on a set of values, and return a single value


SELECT SUM(marks)
FROM student;

//The SUM() function returns the sum of the arguments given to the function.

SELECT MAX(marks)
FROM student;

SELECT MIN(marks)
FROM student;

SELECT AVG(marks)
FROM student;

SELECT COUNT(rollno)
FROM student;
```

- We can SELECT two column from two different table in the database.

```sql
SELECT t1.col1, t2.col2
FROM Table1 t1, Table2 t2;
```


# GROUP BY Clause

- It groups rows that have the same values into summary rows. It collects data from multiple records and groups the result by one or more column.
- Generally we use group by with some aggregation function.
- We can also use the GROUP BY without applying the Aggregate function. In this case GROUP BY works like a DISTINCT clause which never shows any duplicate value in the result set.

```sql
SELECT city, count(rollno)
FROM student
GROUP BY city;
// the above code will group all the rows with city and return total number of student in respective city

// Having Clause: Similar to where clause that is used to apply condition on rows, having clause is used to apply conditions after grouping

SELECT city, count(rollno)
FROM student
GROUP BY city
HAVING MAX (marks) > 90;

//The above code will return group having maximum marks greater than 90 only
```

- We can also group by more than one property. example: `group by city, state` here it will group the rows having same city and state simultaneously.

# CONCAT Function in SQL

- The CONCAT() function adds two or more expressions together.
- It is useful when you want to make a single column of some data from different columns separated by comma or something else.
- It is used with SELECT statement.

    ```sql
    SELECT CONCAT(Address, " ", PostalCode, " ", City) AS Address
    FROM Customers;
    ```

- The CONCAT_WS() function adds two or more expressions together with a separator.

    ```sql
    //CONCAT_WS(separator, expression1, expression2, expression3,...)
    SELECT CONCAT_WS(" ", Address, PostalCode, City) AS Address
    FROM Customers;
    ```

- Both the two codes above work same.

# General Order of writing clause

1. SELECT columns
2. FROM table name
3. WHERE conditions
4. GROUP BY columns
5. HAVING condition
6. ORDER BY columns ASC;

# UPDATE Commands (DML)


```sql
//Update command is used to update the existing rows with some new value

UPDATE student
SET grade = "O"
WHERE grade = "A";

//The above code will update all the grade columns where the value of grade was "A"

SET SQL_SAFE_UPDATES = 0;
// to turn off the safe mode in sql

DELETE FROM student
WHERE marks < 33 ;

//The above code will delete all the student data whose marks is less than 33
```

- If UPDATE/DELETE CASCADE is on. Then, updating parent table id will result into updating the children foreign key also.

# ALTER TABLE Commands

- ALTER TABLE command is used to change the schema of table. That is - add, delete, modify columns of existing table.
- Also used to add and drop various constraints on an existing table.

```sql
//The below code will add a column "age" to an existing table "student".
ALTER TABLE student
ADD COLUMN age INT NOT NULL DEFAULT 19;

//The below code will modify the "age" column data type from int to varchar(2).
ALTER TABLE student
MODIFY age VARCHAR(2);

//The below code will rename the "age" column to "stu_age"
ALTER TABLE student
CHANGE age stu_age INT;

//The below code will delete the column named "stu_age"
ALTER TABLE student
DROP COLUMN stu_age;

//The below code will change the name of table itself from student to stu
ALTER TABLE student
CHANGE TO stu;
```


# TRUNCATE TABLE Command

- TRUNCATE TABLE Command is used to clear all the data of the table

# JOINS in SQL

- The ability to combine results from related rows from multiple tables is an important part of relational database system design.
- Joins is used to combine rows from two or more tables, based on a related column between them.
- Types of Joins are:
    - **Inner Join:** The `INNER JOIN` keyword selects records that have matching values in both tables.

        ```sql
        SELECT ProductID, ProductName, CategoryName
        FROM Products
        INNER JOIN Categories ON Products.CategoryID = Categories.CategoryID;
        
        //The above code will join the Products table with Categories table and the only rows will present which satisfy the ON property.
        ```

    - The `INNER JOIN` keyword returns only rows with a match in both tables. Which means that if you have a product with no CategoryID, or with a CategoryID that is not present in the Categories table, that record would not be returned in the result.
    - `INNER` is the default join type for `JOIN`, so when you write `JOIN` the parser actually writes `INNER JOIN`.
    - Inner join can also be used join a table which we get by running a nested-query select command.

        ```sql
        select sum(ins.TIV_2016) as TIV_2016
        from insurance as ins
        join(
            select TIV_2015
            from insurance
            group by TIV_2015
            having count(*) > 1
        ) as TIV_2015_dupl on ins.TIV_2015 = TIV_2015_dupl.TIV_2015
        
        //It will return a table whose column name is TIV_2016 and it will have only row contain the sum of TIV_2016 values of the rows in which TIV_2015 value repeat.
        //Ref. "Investment in 2016" sql question of coding ninja
        ```

    - **Outer Join**
        - Left Join: The `LEFT JOIN` keyword returns all records from the left table (table1), and the matching records from the right table (table2). The result is 0 records from the right side, if there is no match.

            ```sql
            SELECT column_name(s)
            FROM table1
            LEFT JOIN table2
            ON table1.column_name = table2.column_name;
            ```

        - Right Join
        - Full Join
- **Inner Join**
    - Syntax

    ```sql
    SELECT *
    FROM student
    INNER JOIN course
    ON student.student_id = course.student_id;
    
    //Instead of INNER JOIN, simply JOIN can also be used;
    ```


    _student table_


    | student_id | name  |
    | ---------- | ----- |
    | 101        | Adam  |
    | 102        | Bob   |
    | 103        | Casey |


    _course table_


    | course_id | course           |
    | --------- | ---------------- |
    | 102       | english          |
    | 105       | math             |
    | 103       | science          |
    | 107       | computer science |


    _result table_


    | student_id | name  | course  |
    | ---------- | ----- | ------- |
    | 102        | Bob   | english |
    | 103        | Casey | science |

- **Left Join**
    - Return all record from the left table, and the matched records from left table
    - Syntax

    ```sql
    SELECT *
    FROM student as s
    LEFT JOIN course as c
    ON s.student_id = c.student_id;
    ```


    _student table_


    | student_id | name  |
    | ---------- | ----- |
    | 101        | Adam  |
    | 102        | Bob   |
    | 103        | Casey |


    _course table_


    | student_id | course           |
    | ---------- | ---------------- |
    | 102        | english          |
    | 105        | math             |
    | 103        | science          |
    | 107        | computer science |


    _result table_


    | student_id | name  | course  |
    | ---------- | ----- | ------- |
    | 101        | Adam  | null    |
    | 102        | Bob   | english |
    | 103        | Casey | science |

- **Full Join**
    - In mySQL, there is no such typical syntax for Full Join. Instead we perform Left Join and Right Join and take union of the two to get Full Join.
    - Syntax

    ```sql
    SELECT *
    FROM student
    INNER JOIN course
    ON student.student_id = course.student_id;
    
    UNION
    
    SELECT *
    FROM student as s
    LEFT JOIN course as c
    ON s.student_id = c.student_id;
    ```

- **Self Join**
    - When we need to get the data of a table in different schema.
    - Syntax

    ```sql
    SELECT a.name as manager_name, b.name
    FROM employee as a
    JOIN employee as b
    ON a.id = b.manager_id;
    ```


    _employee table_


    | id  | name   | manager_id |
    | --- | ------ | ---------- |
    | 101 | Adam   | 103        |
    | 102 | Bob    | 104        |
    | 103 | Casey  | null       |
    | 104 | Donald | 103        |


    _result table_


    | manager_name | name   |
    | ------------ | ------ |
    | Casey        | Adam   |
    | Donald       | Bob    |
    | Casey        | Donald |


# UNION in SQL

- It is used to combine the result - set of two or more SELECT statements.
- To use it:
    - Every SELECT should have same number of columns
    - Columns must have similar data type
    - Columns in every SELECT should be in same order
- Syntax

    ```sql
    SELECT columns(s) FROM tableA
    UNION
    SELECT columns(s) FROM tableB
    ```


# Nested Query

- A query is placed within another query
- Used for more complex and specific data retrieval
- Basic Syntax

```sql
SELECT column1, column2, ....
FROM table1
WHERE column1 IN (
	SELECT column1
	FROM table2
	WHERE condition
);
```

- There are two type of Nested Query
    - **Independent nested query:** Subqueries are executed independently. Result of inner query is passed to outer query.
        - **Operators used:**
            - **IN Operator -** This operator checks if a column value in the outer query's result is present in the inner query's result. The final result will have rows that satisfy the IN condition.
            - **NOT IN Operator -** This operator checks if a column value in the outer query's result is not present in the inner query's result. The final result will have rows that satisfy the NOT IN condition.
            - **ALL Operator -** This operator compares a value of the outer query's result with all the values of the inner query's result and returns the row if it matches all the values. It is used with operator.

                ```sql
                SELECT column_name(s)
                FROM table_name
                WHERE column_name operator ALL
                  (SELECT column_name
                  FROM table_name
                  WHERE condition);
                
                // Only standard comparison operator(=, <>, !=, >, >=, <, or <=) are used here.
                ```

            - **ANY Operator -** This operator compares a value of the outer query's result with all the inner query's result values and returns the row if there is a match with any value. It is also used with operator.
    - **Dependent nested query:** Correlated subqueries are executed once for each row of the outer query. They use values from the outer query to return results.
        - **Operators used:**
            - **EXISTS Operator -** This operator checks whether a subquery returns any row. If it returns at least one row. EXISTS operator returns true, and the outer query continues to execute. If the subquery returns no row, the EXISTS operator returns false, and the outer query stops execution.
            - **NOT EXIST Operator -** This operator checks whether a subquery returns no rows. If the subquery returns no row, the NOT EXISTS operator returns true, and the outer query continues to execute. If the subquery returns at least one row, the NOT EXISTS operator returns false, and the outer query stops execution.
            - **ANY Operator -** This operator compares a value of the outer query's result with one or more values returned by the inner query. If the comparison is true for any one of the values returned by the inner query, the row is included in the final result.
            - **ALL Operator -** This operator compares a value of the outer query's result with all the values returned by the inner query. Only if the comparison is true for all the values returned by the inner query, the row is included in the final result.

# MySQL Views

- In SQL, a view is a virtual table based on the result-set of an SQL statement. A view contains rows and columns, just like a real table. The fields in a view are fields from one or more real tables in the database.
- Basic Syntax

```sql
CREATE VIEW view_name AS
SELECT column1, column2, ...
FROM table_name
WHERE condition;
```

- Updating a View: A view can be updated with the `CREATE OR REPLACE VIEW` statement.
    - Syntax

    ```sql
    CREATE OR REPLACE VIEW view_name AS
    SELECT column1, column2, ...
    FROM table_name
    WHERE condition;
    
    //The above SQL code adds the "City" column to the "Brazil Customers" view:
    ```

- Dropping a view: A view is deleted with the `DROP VIEW` statement.
    - Syntax

    ```sql
    DROP VIEW view_name;
    ```


# IF Function in SQL

- IF Function is used with SELECT Command.
- The IF() function returns a value if a condition is TRUE, or another value if a condition is FALSE.

```sql
SELECT OrderID, Quantity, IF(Quantity>10, "MORE", "LESS")
FROM OrderDetails;

//The above code will return 3 Column. Which means the IF function will return all new column.
```


# CASE expression in SQL

- The `CASE` expression goes through conditions and returns a value when the first condition is met (like an if-then-else statement). So, once a condition is true, it will stop reading and return the result. If no conditions are true, it returns the value in the `ELSE` clause.
- If there is no `ELSE` part and no conditions are true, it returns NULL.

```sql
// Case expression used with select statement to return new column according to certain satisfied conditions.

SELECT OrderID, Quantity,
CASE
    WHEN Quantity > 30 THEN 'The quantity is greater than 30'
    WHEN Quantity = 30 THEN 'The quantity is 30'
    ELSE 'The quantity is under 30'
END AS QuantityText
FROM OrderDetails;

//The above code will return an additional column namely QuantityText having details accordingly.
```


```sql
SELECT CustomerName, City, Country
FROM Customers
ORDER BY
(CASE
    WHEN City IS NULL THEN Country
    ELSE City
END);

//The above SQL will order the customers by City. However, if City is NULL, then order by Country
```


# Round() Function

- The ROUND() function rounds a number to a specified number of decimal places.
- Syntax:

```sql
select Round(col,2) from table

// The above code will return the col having values upto 2 decimal place.
```

