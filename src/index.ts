#! /usr/bin/env node

const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const figlet = require("figlet");
const { printTable } = require('console-table-printer');
const { Table } = require('console-table-printer');

const program = new Command();

console.log(figlet.textSync("Dir Manager"));

program
  .version("1.3.0")
  .description("An example CLI for managing a directory")
  .option("-l, --ls  [value]", "List directory contents")
  .option("-m, --mkdir <value>", "Create a directory")
  .option("-t, --touch <value>", "Create a file")
  .parse(process.argv);

const options = program.opts();

async function listDirContents(filepath: string) {
  try {
    const files = await fs.promises.readdir(filepath);
    const detailedFilesPromises = files.map(async (file: string) => {
      let fileDetails = await fs.promises.lstat(path.resolve(filepath, file));
      const { size, birthtime } = fileDetails;
      return { 
        filename: file, 
        "type": fileDetails.isDirectory() ? "directory" : "file",
        "size(KB)" : size / 1000, 
        created_at: birthtime.toLocaleString()
       };
    });
    const detailedFiles = await Promise.all(detailedFilesPromises);
    showTable(detailedFiles);
  } catch (error) {
    console.error("Error occurred while reading the directory!", error);
  }
}
function createDir(filepath: string) {
  const absolutePath = path.resolve(filepath);
  fs.mkdir(absolutePath, { recursive: true }, (err: any) => {
    if (err) throw err;
    console.log(`Directory created successfully at ${absolutePath}`);
  });
}

function showTable(data: any) {
 const table = new Table({
    columns: [
      { name: 'filename', alignment: 'left', color: 'red' },
      { name: 'type', alignment: 'left', color: 'blue' },
      { name: 'size(KB)', alignment: 'left', color: 'green' },
      { name: 'created_at', alignment: 'left', color: 'yellow' },
    ],
  });
  table.addRows(data);
  table.printTable();
  
}

function createFile(filepath: string) {
  const absolutePath = path.resolve(filepath);
  fs.writeFile(absolutePath, "", (err: any) => {
    if (err) throw err;
    console.log(`File created successfully at ${absolutePath}`);
  });
}

if (options.ls) {
  const filepath = options.ls === true ? "." : options.ls;
  listDirContents(filepath);
}
if (options.mkdir) {
  createDir(options.mkdir);
}
if (options.touch) {
  createFile(options.touch);
}

if (!process.argv.slice(2).length) {
    program.outputHelp();
  }