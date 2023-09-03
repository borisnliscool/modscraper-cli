import fetch from "node-fetch";

/**
 * @export
 * @param {string} url
 * @param {string[] | undefined} requestCookies
 * @return {*}
 */
export async function fetchData(url, requestCookies) {
	const headers = {
		"User-Agent":
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
		Cookie: requestCookies?.join("; "),
	};

	const response = await fetch(url, {
		headers,
	});
	return response;
}
