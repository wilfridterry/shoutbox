const bcrypt = require('bcrypt');
const client = require('../db/redis-client');


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
            db.incr('user:ids', (err, id) => {
                if (err) return cb(err);
                this.id = id;
                this.hashPassword((err) => {
                    if (err) return cb(err);
                    this.update(cb);
                })
            });
        }
    }

    async update(cb) {
        const id = this.id
        (await client()).set(`user:id:${this.name}`, id, err => {
            if (err) return cb(err);

            db.hmset(`user:${id}`, this, err => {
                cb(err);
            });
        });
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
}

module.exports = User;