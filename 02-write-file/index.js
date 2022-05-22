//скрипт выводящий в консоль приветствие, ожидающий ввод текста, и записывающий введённый текст в файл.
const fs = require('fs');
const path = require('path');

fs.writeFile(path.join(__dirname, 'text.txt'), '',
    (err) => {
        if (err) throw err;
    }
);

const { stdin, stdout } = process;

stdout.write('Write text that you want to add\n');
stdin.on('data', data => {
    const textToAdd = data.toString().trim();
    if (textToAdd === 'exit') { process.exit(); }
    fs.appendFile(
        path.join(__dirname, 'text.txt'),
        textToAdd,
        err => {
            if (err) throw err;
        }
    );
});
process.on('SIGINT', () => {
    process.exit();
});
process.on('exit', () => {
    stdout.write('Goodbye, Node.js!');
});