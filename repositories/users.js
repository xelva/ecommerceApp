const { accessSync, constants, writeFileSync } = require('fs');
const { readFile, writeFile } = require('fs/promises');
const { randomBytes, scrypt } = require('crypto');
const util = require('util');

const scryptPromise = util.promisify(scrypt);


class UsersRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error('Creating a repo must have a filename');
        }
        this.filename = filename;

        try {
            accessSync(this.filename);
        } catch {
            writeFileSync(this.filename, '[]');
        }

    }
    async getAll() {
        //open the file called this.filename
        return JSON.parse(await readFile(this.filename, { encoding: 'utf8'}));
    }
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
    async writeAll(records) {
        await writeFile(this.filename, JSON.stringify(records, null, 2)); // write file, all on new lines
    }

    randomId() {
        return randomBytes(4).toString('hex'); //get random bytes and convert to hex string
    }

    async getOne(id) {
        
        const records = await this.getAll();
        return records.find(record => record.id = id); 
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);
        if (!record) {
            throw new Error(`record with id ${id} not found`);
        }

        Object.assign(record, attrs) //takes all properties of attrs and assigns/copies them to record
        await this.writeAll(records);
    }

    async getOneBy(filters) {
        const records = await this.getAll();
        for (let record of records) {
            let found = true; 
            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }
            if (found) {
                return record;
            }

        }
    }
} // end of class

//export class


module.exports = new UsersRepository('users.json');

