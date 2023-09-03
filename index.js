import fs from "fs";
import path from "path";
import { downloadMod } from "./src/download.js";
import { log } from "./src/logger.js";
import chalk from "chalk";

const url = process.argv[2];

if (!url) {
	log(
		chalk.red(
			"Please provide a Modscraper-web share link as a command-line argument."
		)
	);
	log(
		chalk.red(
			`You can get one by clicking 'Copy share link' on any mod on ${chalk.underline(
				"https://msw.boris.foo/search"
			)}`
		)
	);
	process.exit(1);
}

const [buffer, ext] = await downloadMod(url);
const archivePath = path.join(process.cwd(), "msw-download" + ext);

log("Writing archive..");
fs.writeFileSync(archivePath, buffer);

log(`Downloaded to "${chalk.green(archivePath)}"`);
