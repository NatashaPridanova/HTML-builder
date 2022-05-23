const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const distPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const cssPath = path.join(__dirname, 'project-dist', 'style.css');
const htmlPath = path.join(__dirname, 'project-dist', 'index.html');

const assetsPath = path.join(__dirname, 'assets');
const distAssetsPath = path.join(__dirname, 'project-dist', 'assets');

async function copyFolder(rootDir, targetDir) {
    await fsPromises.mkdir(targetDir, { recursive: true });
    const files = await fsPromises.readdir(rootDir, { withFileTypes: true });
    for (const file of files) {
        const innerRootDir = path.join(rootDir, file.name);
        const innerTargetDir = path.join(targetDir, file.name);
        if (file.isDirectory()) {
            await copyFolder(innerRootDir, innerTargetDir);
        } else {
            await fsPromises.copyFile(innerRootDir, innerTargetDir);
        }
    }
}

async function getTemplateData() {
    const dataOfTemplate = await fsPromises.readFile(templatePath, 'utf-8');
    await writeFile(htmlPath, dataOfTemplate);
}

async function writeFile(path, content) {
    await fsPromises.writeFile(path, content);
}

async function rewriteHtml() {
    const htmlContent = await fsPromises.readFile(htmlPath, 'utf-8');
    const pattern = /{{[\w\d\s]*}}/g;
    const components = await fsPromises.readdir(componentsPath, { withFileTypes: true });
    let contents = [];
    let fileNames = [];
    for (const file of components) {
        let contentToPaste = await fsPromises.readFile(path.join(componentsPath, file.name), 'utf-8');
        contents.push(contentToPaste);
        fileNames.push(file.name.slice(0, -5));
    }
    let nameContent = {};
    fileNames.forEach((item, index) => {
        nameContent[item] = contents[index];
    });
    const changedHtmlContent = htmlContent.replace(pattern, replacer)

    function replacer(match) {
        for (compName in nameContent) {
            if (compName === match.slice(2, -2)) {
                return nameContent[compName];
            }
        }
    }
    await writeFile(htmlPath, changedHtmlContent);
}

async function copyStyles() {
    const styleFiles = await fsPromises.readdir(path.join(__dirname, 'styles'));
    for (const style of styleFiles) {
        const stylePath = path.join(__dirname, 'styles', style);
        const styleToAdd = await fsPromises.readFile(stylePath, 'utf-8');
        await fsPromises.appendFile(cssPath, styleToAdd);
    }
}

async function buildPage() {
    try {
        await fsPromises.rm(distPath, { force: true, recursive: true });
        await copyFolder(assetsPath, distAssetsPath);
        await writeFile(cssPath, '');
        await writeFile(htmlPath, '');
        await getTemplateData();
        await rewriteHtml();
        await copyStyles();
    } catch (error) { console.log(error); }
}

buildPage();