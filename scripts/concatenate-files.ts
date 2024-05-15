import * as fs from 'fs';
import * as path from 'path';
import ignore from 'ignore';

// Read and parse the .gitignore file
const gitignorePath = path.join(__dirname, '../.gitignore');
const ig = ignore();
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
  ig.add(gitignoreContent);
}

function concatenateFiles(directory: string, outputFile: string) {
  const outputStream = fs.createWriteStream(outputFile, { flags: 'w' });

  function processDirectory(dir: string) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const relativePath = path.relative(path.join(__dirname, '..'), filePath);

      // Ignore files and directories based on .gitignore
      if (ig.ignores(relativePath)) {
        return;
      }

      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        processDirectory(filePath);
      } else if (stat.isFile()) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        outputStream.write(`File: ${filePath}\n`);
        outputStream.write(fileContent);
        outputStream.write('\n\n');
      }
    });
  }

  processDirectory(directory);
  outputStream.end();
}

const projectRoot = path.join(__dirname, '..');
const appsDirectory = path.join(projectRoot, 'apps');
const sharedDirectory = path.join(projectRoot, 'shared');
const outputFilePath = path.join(projectRoot, 'workspace_concatenated.txt');

// Process the apps and shared directories
concatenateFiles(appsDirectory, outputFilePath);
concatenateFiles(sharedDirectory, outputFilePath);

console.log(
  `All files from 'apps' and 'shared' have been concatenated into ${outputFilePath}`
);
