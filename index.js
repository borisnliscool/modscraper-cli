import fs from "fs";
import path from "path";
import { downloadMod } from "./src/download.js";
import { log } from "./src/logger.js";
import chalk from "chalk";

const url = process.argv[2];

if (!url) {
	console.error("Please provide a URL as a command-line argument.");
	process.exit(1);
}

const [buffer, ext] = await downloadMod(url);
const archivePath = path.join(process.cwd(), "archive" + ext);

log("Writing archive..");
fs.writeFileSync(archivePath, buffer);

log(`Downloaded to "${chalk.green(archivePath)}"`);
