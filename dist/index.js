#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const figlet = require("figlet");
const { printTable } = require('console-table-printer');
const { Table } = require('console-table-printer');
const program = new Command();
console.log(figlet.textSync("Dir Manager"));
program
    .version("1.0.0")
    .description("An example CLI for managing a directory")
    .option("-l, --ls  [value]", "List directory contents")
    .option("-m, --mkdir <value>", "Create a directory")
    .option("-t, --touch <value>", "Create a file")
    .parse(process.argv);
const options = program.opts();
function listDirContents(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const files = yield fs.promises.readdir(filepath);
            const detailedFilesPromises = files.map((file) => __awaiter(this, void 0, void 0, function* () {
                let fileDetails = yield fs.promises.lstat(path.resolve(filepath, file));
                const { size, birthtime } = fileDetails;
                return {
                    filename: file,
                    "type": fileDetails.isDirectory() ? "directory" : "file",
                    "size(KB)": size / 1000,
                    created_at: birthtime.toLocaleString()
                };
            }));
            const detailedFiles = yield Promise.all(detailedFilesPromises);
            showTable(detailedFiles);
        }
        catch (error) {
            console.error("Error occurred while reading the directory!", error);
        }
    });
}
function createDir(filepath) {
    const absolutePath = path.resolve(filepath);
    fs.mkdir(absolutePath, { recursive: true }, (err) => {
        if (err)
            throw err;
        console.log(`Directory created successfully at ${absolutePath}`);
    });
}
function showTable(data) {
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
function createFile(filepath) {
    const absolutePath = path.resolve(filepath);
    fs.writeFile(absolutePath, "", (err) => {
        if (err)
            throw err;
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
//# sourceMappingURL=index.js.map