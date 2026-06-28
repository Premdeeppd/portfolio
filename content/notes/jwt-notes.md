---
title: "Json Web Token (JWT) "
slug: "jwt-notes"
description: "Personal knowledge reference note on Json Web Token (JWT) ."
featured: false
---

- A JWT is a standardized, compact way to securely transmit information between different systems.
- JWTs are commonly used for authentication and authorization in web applications.
- **Structure:** It consists of three parts separated by dots:
    - **Header:** Contains metadata about the token (e.g., algorithm used for signing).
    - **Payload:** The actual data/claims you want to transmit (e.g., user ID, roles, expiration time).
    - **Signature:** A cryptographic hash used to verify the integrity and authenticity of the token.
- **Code for generating jwt**

    ```javascript
    const jwt = require('jsonwebtoken');
    
    const payload = {
      user_id: 123,
      username: 'example_user',
      role: 'admin'
    };
    
    const secretKey = 'your_secret_key'; // Should be securely stored
    
    const token = jwt.sign(payload, secretKey);
    
    console.log(token);
    ```

- **Code for verifying the jwt**

    ```javascript
    const jwt = require('jsonwebtoken');
    
    const token = 'your_jwt_token'; // Token received from the client
    
    const secretKey = 'your_secret_key'; // Should match the one used for signing
    
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.error('JWT verification failed:', err);
      } else {
        console.log('Decoded token:', decoded);
      }
    });
    ```


### Security Considerations for authentication

1. Signature Stripping
    - A common method for attacking a signed JWT is to simply remove the signature.
    - it is possible to remove the signature and then change the header to claim the JWT is unsigned.
    - This can be easily solved by making sure that the application that performs the validation does not consider unsigned JWTs valid.
2. Cross-Site Request Forgery (CSRF)
3. XSS (Cross site scripting )
