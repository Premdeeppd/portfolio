---
title: "The Hidden Layer of WebSockets: Understanding Frames"
slug: "the-hidden-layer-of-websockets-understanding-frames"
description: "Most developers know that WebSockets provide a persistent TCP connection where both the client and server can send messages at any time."
featured: false
---


Most developers know that WebSockets provide a persistent TCP connection where both the client and server can send messages at any time.


But there is an important question that rarely gets answered:

> **If WebSocket already runs on top of TCP—which already splits data into segments—why did the protocol introduce its own framing system?**

At first glance, WebSocket frames look redundant.


After all, TCP already handles segmentation, retransmission, ordering, and reliability.


So why add another layer?


The answer lies in something TCP intentionally does **not** provide: **message boundaries**.


Understanding WebSocket frames is understanding why WebSocket is a _messaging protocol_ rather than just a long-lived TCP connection.


# TCP Doesn't Understand Messages


TCP is a byte stream.


It promises only one thing:

> "The bytes you send will arrive in the same order."

It never promises **where one message ends and another begins**.


Imagine sending two JSON objects:


```plain text
Client
-------
send({"type":"ping"})
send({"type":"chat"})
```


The server is **not** guaranteed to receive them like this.


It may receive:


```plain text
{"type":"ping"}{"type":"chat"}

# or, 

{"type":"pi
ng"}{"type":"chat"}

# or even, 

{"type":"ping"}{"ty
pe":"chat"}
```


TCP simply delivers bytes.


It is the application's responsibility to figure out where each logical message begins and ends.


This is one of the biggest problems every protocol built on TCP must solve.


HTTP solved it using:

- `Content-Length`
- `Transfer-Encoding: chunked`
- Closing the connection

WebSocket solves it using **frames**.


# The Problem With a Continuous Stream


Imagine a chat application.


The client sends three messages quickly.


```javascript
socket.send("Hello");
socket.send("How are you?");
socket.send("Bye");
```


Without framing, the server only sees a stream like


```plain text
HelloHow are you?Bye
```


Where is the first message?


Where does the second begin?


There is no way to know.


The protocol needs explicit message boundaries.


That is exactly what frames provide.


# Every WebSocket Message Is Broken Into Frames


Instead of sending raw bytes, WebSocket wraps data inside a small structure called a frame.


Conceptually:


```plain text
+-----------+-----------+-----------+
| Frame 1   | Frame 2   | Frame 3   |
+-----------+-----------+-----------+
```


Each frame contains metadata describing the payload.


A simplified view looks like:


```plain text
+------+----------+--------------+
| FIN  | OPCODE   | PAYLOAD       |
+------+----------+--------------+
```

- FIN → Is this the last frame?
- OPCODE → What type of data is this?
- Payload → Actual bytes

Now the receiver knows exactly where one frame ends and the next begins.


# Message vs Frame


This distinction is extremely important.


A **message** is what your application sends.


```javascript
socket.send("Hello World");
```


A **frame** is how the protocol transports that message.


One message may consist of:

- one frame
- two frames
- hundreds of frames

Your application never sees the frames.


The WebSocket library reassembles them before exposing the message.


# Why Split a Message Into Multiple Frames?


Imagine uploading a 100 MB video.


Without fragmentation, the sender would need to construct the entire message before sending anything.


Likewise, the receiver might need to buffer the whole payload before processing it.


Instead, WebSocket allows this:


```plain text
Message
──────────────

Frame 1 (16 KB)
Frame 2 (16 KB)
Frame 3 (16 KB)
Frame 4 (16 KB)
...
Frame N
```


As soon as the first frame is ready, transmission begins.


No need to wait for the entire message.


This reduces:

- memory usage
- latency
- blocking

Large payloads can be streamed efficiently.


# FIN Bit


Every frame contains a single bit called **FIN**.


It answers one question:

> Is this the final frame?

Example:


```plain text
Frame 1
FIN = 0

Frame 2
FIN = 0

Frame 3
FIN = 1
```


The receiver keeps collecting frames until FIN becomes `1`.


Only then is the complete message delivered to your application.


# OPCODE


The opcode tells the receiver how to interpret the payload.


Some common values are:


| Opcode | Meaning            |
| ------ | ------------------ |
| 0x1    | Text               |
| 0x2    | Binary             |
| 0x8    | Connection Close   |
| 0x9    | Ping               |
| 0xA    | Pong               |
| 0x0    | Continuation Frame |


When you call


```javascript
socket.send("Hello");
```


the browser creates a **Text Frame** (`0x1`).


When sending binary data,


```javascript
socket.send(imageBuffer);
```


it becomes a **Binary Frame** (`0x2`).


# Control Frames


Not every frame contains application data.


Some frames manage the connection itself.


For example:


## Ping


```plain text
Client
   |
Ping
   |
Server
```


Used to check whether the connection is still alive.


## Pong


```plain text
Client
   |
Ping
   |
Server
   |
Pong
   |
Client
```


Automatically replies to a Ping.


## Close


Gracefully terminates the connection.


```plain text
Client
   |
Close Frame
   |
Server
```


Both sides then close the TCP connection cleanly.


# Why Ping Isn't Just Another Message


Imagine if Ping were ordinary application data.


A huge 500 MB upload could delay it for several minutes.


That would make heartbeat checks useless.


Instead, WebSocket allows **control frames to be inserted between fragmented data frames**.


Example:


```plain text
Frame 1
Frame 2

Ping

Frame 3
Frame 4
```


The Ping does not wait until the entire upload finishes.


The connection remains responsive.


This is one of the biggest reasons fragmentation exists.


# Client Masking


One field inside every client frame is the **Mask**.


Every browser must mask outgoing payloads.


Servers never do.


Example:


```plain text
Client
-------
Payload
↓

XOR with random 32-bit key

↓

Masked Payload

↓

Internet
```


The server applies the same XOR again.


```plain text
Masked Payload
↓

XOR same key

↓

Original Payload
```


Because


```plain text
A XOR B XOR B = A
```


the original data is restored.


# Why Does Client Mask Data?


Masking is **not encryption**.


Anyone observing the traffic can recover the payload.


Its purpose is entirely different.


Early HTTP infrastructure sometimes treated WebSocket traffic as if it were HTTP.


A malicious client could intentionally craft payload bytes that looked like valid HTTP requests, confusing proxies or caches.


By forcing browsers to apply a random masking key to every client frame, the transmitted bytes become unpredictable.


This prevents clients from generating specific byte sequences on the wire while still allowing the server to recover the original payload efficiently.


Servers do not mask responses because the security concern exists only in the client-to-server direction.


# A Frame Is Surprisingly Small


A typical text frame looks conceptually like:


```plain text
+--------+---------+---------+-----------+
| FIN    | OPCODE  | LENGTH  | PAYLOAD   |
+--------+---------+---------+-----------+
```


The header is only a few bytes.


Even for tiny messages like


```javascript
socket.send("OK");
```


the overhead is minimal.


# What Happens When You Call `socket.send()`?


```javascript
socket.send({
    event: "message",
    text: "Hello"
});
```


Internally, something similar happens:


```javascript
const payload = JSON.stringify({
    event: "message",
    text: "Hello"
});

// Browser internally

createFrame({
    opcode: TEXT,
    fin: true,
    payload
});

writeFrameToTCP();
```


Your code never deals with frames directly.


The browser or WebSocket library handles everything.


# A Simplified Example


Imagine sending:


```javascript
socket.send("Hello");
```


Conceptually, the browser produces:


```plain text
Frame

FIN = 1
Opcode = Text
Length = 5

Payload
-------
Hello
```


For a large upload:


```javascript
socket.send(hugeVideoBuffer);
```


it may become:


```plain text
Frame 1
FIN = 0

Frame 2
FIN = 0

Frame 3
FIN = 0

Frame 4
FIN = 1
```


Your application still receives **one message**, not four.


# TCP Segment vs WebSocket Frames


This is where many developers get confused.


They are completely different concepts.


| TCP Segment                    | WebSocket Frame                      |
| ------------------------------ | ------------------------------------ |
| Managed by operating system    | Managed by WebSocket protocol        |
| Exists at transport layer      | Exists at application protocol layer |
| May split or merge arbitrarily | Defines explicit message boundaries  |
| Invisible to application       | Parsed by WebSocket implementation   |


A single WebSocket frame may span multiple TCP segments.


Likewise, several small WebSocket frames may be carried inside a single TCP segment.


Neither layer depends on the other's boundaries.

