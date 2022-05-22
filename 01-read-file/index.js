//скрипт выводящий в консоль содержимое файла text.txt
const fs = require('fs');
const path = require('path');

const readableStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
let data = '';

const { stdout } = process;


readableStream.on('data', chunk => data += chunk);
readableStream.on('end', () => stdout.write(data));
readableStream.on('error', error => console.log('Error', error.message));