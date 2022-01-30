const redis = require('redis');


async function getClient() {
    const client = redis.createClient();
    if (!client.connected) await client.connect();

    return client;
}

class Entry {
    constructor(obj) {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }

    async save (cb) {
        try {
            const client = await getClient();
            const entryJSON = JSON.stringify(this);
            await client.lPush('entries', entryJSON);

            cb();
        } catch(e) {
            cb(e);
        }
    }

     static async getRange(from, to, cb) {
        try {
            const client = await getClient();

            const items = await client.lRange('entries', from, to);
            let entries = [];
            
            items.forEach(element => {
                entries.push(JSON.parse(element));  
            });

            cb(null, entries);
        } catch (e) {
            cb(err);
        }        
    }
}

module.exports = Entry;

