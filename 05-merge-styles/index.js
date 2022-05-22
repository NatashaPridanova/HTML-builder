const fs = require('fs');
const path = require('path');

fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '', (err) => {
    if (err) throw err;
});

fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
    if (err) throw err;
    for (const file of files) {
        const pathToFile = path.join(__dirname, 'styles', file);
        fs.stat(pathToFile, (err, info) => {
            if (info.isFile(file)) {
                if (err) throw err;
                if (path.extname(file).slice(1) === 'css') {
                    const readStream = fs.createReadStream(pathToFile, 'utf-8');
                    readStream.on('readable', () => {
                        const stylesToAdd = readStream.read();
                        if (stylesToAdd !== null) {
                            fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), stylesToAdd, (err) => {
                                if (err) throw err;
                            });
                        }
                    });
                }
            }
        })
    }
})