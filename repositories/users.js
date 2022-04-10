const { accessSync, constants, writeFileSync } = require('fs');
const { readFile, writeFile } = require('fs/promises');
const { randomBytes } = require('crypto');

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
        const records = await this.getAll();
        records.push(attrs);
        await this.writeAll(records);
        
    }
    async writeAll(records) {
        await writeFile(this.filename, JSON.stringify(records, null, 2)); // write file, all on new lines
    }

    randomId() {
        return randomBytes(4).toString('hex'); //get random bytes and convert to hex string
    }
} // end of class

const test = async () => {
    const repo = new UsersRepository('users.json');
    await repo.create({email: 'test@test.com', password: 'sadfasdf'});
    console.log(await repo.getAll());

}
test();

