const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

const PORT = 12345;
app.use(bodyParser.json());

async function execute(command){
    const { stdout, stderr, error } = await exec(command, {"shell" : "powershell"});
    if (error) {
        return error;
    }
    if (stderr) {
        return stderr;
    }
    return stdout;
}

//const text = fs.readFileSync('test.txt', 'utf-8');

app.post('/code', async (req, res) => {
    let lang = req.body.language;
    let code = req.body.text;
    let output = 'ERROR'

    console.log(lang);
    console.log(code);

    switch (lang) {
        case 'cpp':
        case 'c++':
            fs.writeFileSync('main.cpp', code, (err) => {
                if (err) return console.log(`Error: ${err}`);
                console.log("File saved successfully");
            });
            output = await execute('g++ main.cpp -o output; ./output');
            console.log(output);
            break;
        default:
            break;
    }

    res.send({out: output});
});

app.listen(PORT, () => {
    console.log(`Started on port: ${PORT}`);
});