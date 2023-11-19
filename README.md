# Directory Manager - CLI tool

A CLI directory manager that can be used to create directories, list directory contents and create files.

Built following the tutorial at [https://blog.logrocket.com/building-typescript-cli-node-js-commander/](https://blog.logrocket.com/building-typescript-cli-node-js-commander/)

## Installation

```bash
npm install @omartrj/directory_manager -g
```

## Commands

- **Help:**  
```bash
dirmanager -h
dirmanager --help
```

- **List Directory Contents:**  
```bash
dirmanager -l \[value\]
dirmanager --ls \[value\]
```

- **Create Directory:**  
```bash
dirmanager -m \<value\>
dirmanager --mkdir \<value\>
```

- **Create File:**  
```bash
dirmanager -t \<value\>
dirmanager --touch \<value\>
```