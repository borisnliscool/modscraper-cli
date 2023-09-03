import puppeteer from "puppeteer";
import path from "path";
import { fetchData } from "./fetch.js";
import { log } from "./logger.js";
import chalk from "chalk";

const getDownloadLink = {
	"gta5-mods.com": async (url) => {
		const browser = await puppeteer.launch({
			headless: "new",
		});
		const page = await browser.newPage();

		await page.goto(url);

		await page.evaluate(() => {
			const element = document.querySelector("[data-name=mediavine-gdpr-cmp]");
			element?.remove();
		});

		const linkElement = await page.$("a.btn-download");
		await linkElement.click();
		await page.waitForNavigation();

		const download = await page.$("a.btn-download");
		const link = await download.evaluate((el) => el.getAttribute("href"));
		await browser.close();

		return link;
	},
};

/**
 * @param {string} url
 */
export async function downloadMod(url) {
	if (!url.endsWith("/raw")) url += "/raw";
	const modData = await (await fetch(url)).json();
	log(`Attempting to download "${chalk.blue(modData.title)}"`);

	const link = modData.link instanceof Array ? modData.link[0] : modData.link;

	log("Finding download link..");
	const downloadUrl = await getDownloadLink[new URL(link).hostname](link);

	log("Downloading mod archive..");
	const arrayBuffer = await (await fetchData(downloadUrl)).arrayBuffer();

	return [Buffer.from(arrayBuffer), path.extname(downloadUrl)];
}
