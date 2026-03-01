# memstashjs

Performance-first in-memory cache with TTL (time-to-live) support. Works in Node.js and all modern browsers. Zero dependencies, blazing fast O(1) lookups using native Map.

[![npm version](https://img.shields.io/npm/v/memstashjs.svg)](https://www.npmjs.com/package/memstashjs)
[![license](https://img.shields.io/npm/l/memstashjs.svg)](https://github.com/mohan-kumar-0/mem-stash/blob/main/LICENSE)

---

## Features

- **O(1) Lookups** -- Built on native JavaScript `Map` for constant-time reads and writes.
- **TTL Support** -- Set expiration time per key in milliseconds. Expired entries are lazily cleaned on access.
- **Singleton + Instance** -- Use the pre-created default instance or create multiple isolated caches.
- **Isomorphic** -- Works in Node.js, Deno, Bun, and all modern browsers.
- **Zero Dependencies** -- Nothing to install besides this package.
- **Tiny Footprint** -- Under 2KB unminified.

---

## Installation

```bash
npm install memstashjs
```

---

## Usage

### Basic Caching

```javascript
const cache = require('memstashjs');

// Store a value (no expiry)
cache.set('config', { theme: 'dark', lang: 'en' });

// Retrieve it
const config = cache.get('config');
console.log(config);
// { theme: 'dark', lang: 'en' }
```

### Caching with TTL (Time To Live)

```javascript
const cache = require('memstashjs');

// Cache a user session for 30 minutes (1800000ms)
cache.set('session:abc123', {
  userId: 42,
  role: 'admin',
  loginTime: Date.now()
}, 1800000);

// Immediately available
console.log(cache.get('session:abc123'));
// { userId: 42, role: 'admin', loginTime: ... }

// After 30 minutes, automatically returns null
// console.log(cache.get('session:abc123'));
// null
```

### Checking Key Existence

```javascript
const cache = require('memstashjs');

cache.set('token', 'xyz', 5000);

console.log(cache.has('token'));  // true
console.log(cache.has('other'));  // false

// After 5 seconds:
// console.log(cache.has('token'));  // false
```

### Deleting a Key

```javascript
const cache = require('memstashjs');

cache.set('temp', 'data');
cache.delete('temp');

console.log(cache.get('temp'));
// null
```

### Clearing All Entries

```javascript
const cache = require('memstashjs');

cache.set('a', 1);
cache.set('b', 2);
cache.set('c', 3);

cache.clear();

console.log(cache.get('a'));  // null
console.log(cache.get('b'));  // null
console.log(cache.get('c'));  // null
```

### Multiple Isolated Cache Instances

```javascript
const { MemStash } = require('memstashjs');

const userCache = new MemStash();
const productCache = new MemStash();

userCache.set('u1', { name: 'Alice' });
productCache.set('p1', { name: 'Widget', price: 9.99 });

// These are completely separate stores
console.log(userCache.get('p1'));     // null
console.log(productCache.get('u1')); // null
```

### Caching API Responses

```javascript
const cache = require('memstashjs');

async function getUser(id) {
  const cacheKey = `user:${id}`;

  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  // Fetch from API
  const response = await fetch(`https://api.example.com/users/${id}`);
  const user = await response.json();

  // Cache for 5 minutes
  cache.set(cacheKey, user, 300000);

  return user;
}
```

---

## API Reference

| Method | Parameters | Returns | Description |
| --- | --- | --- | --- |
| `set(key, value, ttl)` | `key: string`, `value: any`, `ttl: number` (optional, ms) | `void` | Stores a value with optional expiration |
| `get(key)` | `key: string` | `any or null` | Retrieves a value, returns null if expired or missing |
| `has(key)` | `key: string` | `boolean` | Checks if a non-expired key exists |
| `delete(key)` | `key: string` | `void` | Removes a specific key |
| `clear()` | -- | `void` | Removes all entries |

---

## License

MIT -- see [LICENSE](https://github.com/mohan-kumar-0/mem-stash/blob/main/LICENSE) for details.
