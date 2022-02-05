const bcrypt = require('bcrypt');
const redis = require('../db/redis-client');


class User {
    constructor(obj) {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }

    async save(cb) {
        
        if (this.id) {
            await this.update();
        } else {
            const client = await redis();
            this.id = await client.incr('user:ids');

            this.hashPassword((err) => {
                if (err) return cb(err);
                this.update(cb);
            })
        }
    }

    async update(cb) {
        const client = await redis();
        
        await client.set(`user:id:${this.name}`, this.id);

        await client.hSet(`user:${this.id}`, this);

        cb();
    }

    async hashPassword(cb) {
        await bcrypt.genSalt(12, (err, salt) => {
            if (err) return cb(err);

            this.salt = salt;

            bcrypt.hash(this.pass, salt, (err, hash) => {
                if (err) return cb(err);

                this.pass = hash;
                cb();
            });
        });
    }

    static async authenticate(name, pass, cb) {
        User.getByName(name, (err, user) => {
            if (err) return cb(err);

            if (!user.id) return cb();

            bcrypt.hash(pass, user.salt, (err, hash) => {
                if (err) return cb(err);

                if (hash == user.pass) return cb(null, user);

                cb();
            });
        });
    }

    static async getByName(name, cb) {
        try {
            const id = await User.getId(name);
            
            const user = await User.get(id);
            
            cb(null, new User(user));
        } catch(err) {
            cb(err);
        }
    }

    static async getId(name) {
        return await (await redis()).get(`user:id:${name}`);
    }

    static async get(id) {
        return await (await redis()).hGetAll(`user:${id}`);
    }
}

module.exports = User;

User.getByName('Title', (err, user) => {
    if (err) console.log(err);
    console.log(user);
});