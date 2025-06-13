const { spawn } = require('child_process');
const fs = require('fs');
const kill = require('tree-kill');
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





setTimeout(() => {
    console.log('Killing Python process tree after 10 seconds...');
    kill(py.pid, 'SIGTERM', (err) => {
        if (err) {
            console.error('Failed to kill process tree:', err);
        } else {
            console.log('Process tree killed successfully.');
        }
    });
}, 10000);