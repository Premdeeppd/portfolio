---
title: "React State Management"
slug: "react"
description: "A quick reference guide to hooks and state propagation in React 19."
readingTime: "1 min read"
date: "2026-06-24"
lastUpdated: "2026-06-25"
featured: false
---

# React State Management

A brief reference on using modern state hooks.

## useState and useEffect

Example of basic local state and lifecycle operations:

```jsx
import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```
