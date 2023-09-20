import puppeteer from "puppeteer";
import path from "path";
import { fetchData } from "./fetch.js";
import { log } from "./logger.js";
import chalk from "chalk";
import open from "open";

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
	"libertycity.net": async (url) => {
		open(url, { wait: false });
		return false;
	},
	"gta5mod.net": async (url) => {
		const browser = await puppeteer.launch({
			headless: "new",
		});
		const page = await browser.newPage();
		await page.goto(url);
		await page.waitForNavigation();

		const download = await page.$("a.attachment-link");
		const link = await download.evaluate((el) => el.getAttribute("href"));
		await browser.close();

		return link;
	},
	"gtainside.com": async (url) => {
		const browser = await puppeteer.launch({
			headless: false,
		});
		const page = await browser.newPage();
		await page.goto(url + "/download");

		const download = await page.$("a.break-word");
		const link = await download.evaluate((el) => el.getAttribute("href"));
		await browser.close();

		return link;
	},
};

/**
 * @param {string} _url
 */
export async function downloadMod(_url) {
	const url = new URL(_url);
	let link = "";

	if (url.hostname == "msw.boris.foo") {
		if (!_url.startsWith("https://msw.boris.foo/mod/")) {
			_url = "https://msw.boris.foo/mod/" + _url;
		}
		if (!_url.endsWith("/raw")) {
			_url += "/raw";
		}

		const modData = await (await fetch(_url)).json();
		log(`Attempting to download "${chalk.blue(modData.title)}"`);

		link = modData.link instanceof Array ? modData.link[0] : modData.link;
	} else if (getDownloadLink[url.hostname.replace("www.", "")]) {
		link = _url.replace("www.", "");
	} else {
		return false;
	}

	log("Finding download link..");
	const downloadUrl = await getDownloadLink[new URL(link).hostname](link);

	if (!downloadUrl) {
		log(
			"Couldn't find download link, opening page in browser for manual download."
		);
		return false;
	}

	log("Downloading mod archive..");
	const response = await fetchData(downloadUrl);
	const arrayBuffer = await response.arrayBuffer();

	return {
		buffer: Buffer.from(arrayBuffer),
		ext: path.extname(response.url),
	};
}
