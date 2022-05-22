//скрипт выводящий в консоль данные о файлах содержащихся в папке secret-folder
const fs = require('fs');
const path = require('path');
const { stdout } = process;

/* Пример: example - txt - 128.369kb */
fs.readdir(path.join(__dirname, 'secret-folder'), (err, files) => {
    if (err) throw err;
    for (const file of files) {
        const pathToFile = path.join(__dirname, 'secret-folder', file);
        fs.stat(pathToFile, (err, info) => {
            if (info.isFile(file)) {
                if (err) throw err;
                stdout.write(`${path.parse(pathToFile).name} - ${path.extname(file).slice(1)} - ${info.size}bytes\n`);
            }
        })
    }
});