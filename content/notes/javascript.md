---
title: "JavaScript Reference"
slug: "javascript"
description: "Essential JavaScript tips and quick reference notes for modern developers."
readingTime: "2 min read"
date: "2026-06-25"
lastUpdated: "2026-06-27"
featured: true
---

# JavaScript Reference

This is a collection of essential JavaScript snippets and concepts for everyday development.

## Array Methods

Here are some commonly used array operations:

```javascript
const items = [1, 2, 3, 4, 5];

// Double all items
const doubled = items.map(x => x * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Filter odd numbers
const odds = items.filter(x => x % 2 !== 0);
console.log(odds); // [1, 3, 5]
```

## Destructuring

Destructuring makes extracting values simple:

```javascript
const user = {
  name: 'Prem Deep',
  role: 'Developer',
  skills: ['React', 'Node']
};

const { name, role } = user;
console.log(`${name} is a ${role}`);
```
