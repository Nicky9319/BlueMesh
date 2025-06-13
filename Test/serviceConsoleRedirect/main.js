const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');


const currentPath = __dirname;
const pyFile = path.join(currentPath, 'ws.py');

const py = spawn('python', ['-u', pyFile]);

const writeStream = fs.createWriteStream('js', { flags: 'a' });

py.stdout.on('data', (data) => {
    process.stdout.write(data);
    writeStream.write(data);
});

py.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

py.on('close', (code) => {
    writeStream.end();
    console.log(`main.py exited with code ${code}`);
});