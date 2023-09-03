#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { downloadMod } from "./src/download.js";
import { log } from "./src/logger.js";
import chalk from "chalk";
import { program } from "commander";

async function handleAction(url) {
	const options = program.opts();

	const [buffer, ext] = await downloadMod(url);
	const archivePath = path.join(
		process.cwd(),
		(options.output ? options.output : "msw-download") + ext
	);
	log("Writing archive..");
	fs.writeFileSync(archivePath, buffer);

	log(`Downloaded to "${chalk.green(archivePath)}"`);
}

program
	.name("msw")
	.arguments("<url>", "msw share link to the mod")
	.option("-o, --output <name>", "the name of the output archive")
	.action(handleAction)
	.parse(process.argv);
