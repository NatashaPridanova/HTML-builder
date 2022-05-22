//реализуйте функцию copyDir которая копирует содержимое папки files в папку files-copy
const fs = require('fs');
const path = require('path');

function copyDir() {
    initCopying();

    fs.readdir(path.join(__dirname, 'files'), (err, files) => {
        if (err) throw err;
        const filesToExist = [];
        for (const file of files) {
            filesToExist.push(file);
            fs.writeFile(
                path.join(__dirname, 'files-copy', file),
                '',
                (err) => {
                    if (err) throw err;
                }
            );
            fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
                if (err) throw err;
                for (const file of files) {
                    if (filesToExist.indexOf(file) < 0) {
                        fs.unlink(path.join(__dirname, 'files-copy', file), err => {});
                    }
                }
            });
            fs.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file), (err) => {
                if (err) throw err;
            })
        }
    });
}
copyDir();

function initCopying() {
    fs.access(path.join(__dirname, 'files-copy'), fs.F_OK, (err) => {
        if (err) {
            fs.mkdir(path.join(__dirname, 'files-copy'), err => {
                if (err) throw err;
            });
        }
    })
}