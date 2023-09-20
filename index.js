#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { downloadMod } from "./src/download.js";
import { log } from "./src/logger.js";
import chalk from "chalk";
import { program } from "commander";

async function handleAction(downloadUrl) {
	const options = program.opts();

	const ret = await downloadMod(downloadUrl);
	if (!ret) {
		return log(
			chalk.red(
				"Something went wrong while attempting to download mod. (is the url correct?)"
			)
		);
	}

	const { buffer, ext } = ret;
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
	.arguments("<url>", "msw share link or id of the mod")
	.option("-o, --output <name>", "the name of the output archive")
	.action(handleAction)
	.parse(process.argv);
