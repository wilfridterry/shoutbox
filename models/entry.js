const redis = require('redis');

const db = redis.createClient();

class Entry {
    constructor(obj) {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }

    save (cb) {
        const entryJSON = JSON.stringify(this);

        db.lPush(
            'entriens',
            entryJSON,
            err => {
                if (err) return cb(err);
                cb();
            }
        );
    }

    static getRange(from, to, cb) {
        db.lRange('entries', from, to, (err, items) => {
            if (err) cb(err);

            let entries = [];

            items.forEach(element => {
                entries.push(JSON.parse(item));  
            });

            cb(null, entries);
        });
    }
}

module.exports = Entry;

