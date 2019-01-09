const fs = require('fs');
const chalk = require('chalk');
const path = require('path');

//TODO: Use async await
//Create restore option from file log

const removeDots = () => {

    //Read files in input folder
    fs.readdir('./input', (err, files) => {
        if(err) {
            console.log(chalk.red('Make sure ./input exists'));
            throw err;
        }
        if (!files.length) {
            console.log(chalk.red('No files in ./input'))
            return;
        }
        console.log(chalk.green('Succesfully read files:'));
        console.log(chalk.bgBlue(files));
        
        //Create file log for restoration
        let fileLog = {
            date: Date.now(),
            files
        }

        //Write files to file log
        fs.readFile('./fileLog.json', (err, data) => {
            if (err) {
                console.log(chalk.red('Make sure ./fileLog.json exists'));
                throw err;
            }
            const currLog = data.toString() && Array.isArray(JSON.parse(data)) ? JSON.parse(data) : [];
            currLog.push(fileLog)

            fs.writeFile('./fileLog.json', JSON.stringify(currLog, null, 4), (err) => {
                if(err) {
                    console.log(chalk.red('Make sure ./fileLog.json exists'));
                    throw err;
                }
                console.log(chalk.green('Logged files in ./fileLog.json'))
            })
        })

        //Rename each file
        files.forEach(file => {
            fs.lstat(`./input/${file}`, (err, stats) => {
                if (err) {
                    console.log(chalk.red('Cannot check path'));
                    throw err;
                }
                let cleanedFileName;

                if (stats.isDirectory()) {
                    if (!file.includes('.')) return;
                    cleanedFileName = file.split('.').join(' ').replace(/ +(?= )/g,'');
                } else {
                    let fileExt = path.extname(file);
                    let fileBase = path.basename(file, fileExt);
                    if (!fileBase.includes('.')) return;
                    let cleanedBase = fileBase.split('.').join(' ').replace(/ +(?= )/g,'');
                    cleanedFileName = cleanedBase + fileExt;
                }
                let oldPath = `./input/${file}`;
                let newPath = `./input/${cleanedFileName}`;
    
                fs.rename(oldPath, newPath, (err) => {
                    if (err) {
                        console.log(chalk.red('Rename failed'))
                        throw err;
                    }
                    console.log(chalk.green(`Renamed ${chalk.magenta(file)} to ${chalk.magenta(cleanedFileName)}`));
                })
            });

        })

    })
}

//Run remove dots
removeDots();