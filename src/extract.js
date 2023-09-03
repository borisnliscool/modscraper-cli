import path from "path";
import yauzl from "yauzl";

/**
 * Object containing handlers for different file types.
 * @type {Object.<string, Function>}
 */
const handlers = {
	/**
	 * Asynchronous handler for .zip files.
	 * @param {string} filePath - The path to the .zip file.
	 * @returns {Promise<Buffer>} - A Promise that resolves with the content of the "dlc.rpf" file.
	 */
	".zip": (filePath) => {
		return new Promise((resolve, reject) => {
			yauzl.open(filePath, { lazyEntries: true }, (err, zipfile) => {
				if (err) reject(err);

				zipfile.readEntry();

				zipfile.on("entry", (entry) => {
					if (entry.fileName.includes("dlc.rpf")) {
						zipfile.openReadStream(entry, (readErr, readStream) => {
							if (readErr) reject(readErr);

							const chunks = [];
							readStream.on("data", (chunk) => {
								chunks.push(chunk);
							});

							readStream.on("end", () => {
								resolve(Buffer.concat(chunks));
							});

							readStream.on("error", (streamErr) => {
								reject(streamErr);
							});
						});
					} else {
						zipfile.readEntry();
					}
				});

				zipfile.on("end", () => {
					reject(new Error("File 'dlc.rpf' not found in the ZIP archive."));
				});
			});
		});
	},
};

/**
 * Extracts a file based on its extension.
 * @param {string} filePath - The path to the file to be extracted.
 * @returns {Promise<Buffer>} - A Promise that resolves with the content of the extracted file.
 */
export async function extractFile(filePath) {
	const extensionName = path.extname(filePath);
	if (handlers[extensionName]) {
		return handlers[extensionName](filePath);
	} else {
		throw new Error("Unsupported file extension");
	}
}
