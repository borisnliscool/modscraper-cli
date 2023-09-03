import chalk from "chalk";

export function log(data) {
	const time = chalk.gray(new Date().toTimeString().split(" ")[0]);
	console.log(`[${time}] ${data}`);
}
