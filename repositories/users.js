const { accessSync, constants, writeFileSync } = require('fs');
const { readFile, writeFile } = require('fs/promises');
const { randomBytes, scrypt } = require('crypto');
const util = require('util');
const Repository = require('./repository.js');

const scryptPromise = util.promisify(scrypt);


class UsersRepository extends Repository {
    async create(attrs) {
        attrs.id = this.randomId();

        const salt = randomBytes(8).toString('hex');
        const buff = await scryptPromise(attrs.password, salt, 64)

        const records = await this.getAll();
        
        const record = {
            ...attrs, 
            password: `${buff.toString('hex')}.${salt}`
        };

        records.push(record);

        await this.writeAll(records);

        return record;
        
    }
    async comparePassword(saved, supplied){
        //saved is pass saved in our database
        //supplied is pass entered by user
        const [hashed, salt] = saved.split('.');
        const hashedSuppliedBuff = await scryptPromise(supplied, salt, 64);
        return hashed === hashedSuppliedBuff.toString('hex');
    }
} // end of class

//export class


module.exports = new UsersRepository('users.json');

