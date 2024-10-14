/* eslint-disable @typescript-eslint/no-explicit-any */
// import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
// import { join } from 'path';

export {
  savePrivateFile,
  readPrivateFile,
  setPrivateFolder
};

// const homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
// if (!homeDir) {
//   throw new Error('Cannot determine home directory.');
// }

let privateDir = '.private';

function setPrivateFolder(path: string) {
  privateDir = path;
}

function savePrivateFile(name: string, data: any): void {
  try {
    console.log('File has been saved to', name);
  } catch (err) {
    console.error('Error writing file:', err);
  }
}

function readPrivateFile(name: string): any | null {
  try {
    return {};
  } catch (err) {
    console.error('Error reading file:', err);
    return null;
  }
}