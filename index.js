/**
 * mem-cache-lite
 * Simple in-memory cache with TTL support.
 */

class MemStash {
    constructor() {
        this.cache = new Map();
    }

    /**
     * Set a value in the cache.
     * @param {string} key
     * @param {any} value
     * @param {number} ttl - Time to live in milliseconds.
     */
    set(key, value, ttl = 0) {
        const expiry = ttl > 0 ? Date.now() + ttl : null;
        this.cache.set(key, { value, expiry });
    }

    /**
     * Get a value from the cache.
     * @param {string} key
     * @returns {any}
     */
    get(key) {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (entry.expiry && Date.now() > entry.expiry) {
            this.cache.delete(key);
            return null;
        }

        return entry.value;
    }

    /**
     * Delete a key from the cache.
     * @param {string} key
     */
    delete(key) {
        this.cache.delete(key);
    }

    /**
     * Clear all entries.
     */
    clear() {
        this.cache.clear();
    }

    /**
     * Check if a key exists and is not expired.
     * @param {string} key
     * @returns {boolean}
     */
    has(key) {
        const entry = this.cache.get(key);
        if (!entry) return false;
        if (entry.expiry && Date.now() > entry.expiry) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }
}

module.exports = new MemStash();
module.exports.MemStash = MemStash;
