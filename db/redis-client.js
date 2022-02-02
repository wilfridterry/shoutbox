const redis = require('redis');

async function getClient() {
    const client = redis.createClient();
    if (!client.connected) await client.connect();

    return client;
}

module.exports = getClient;