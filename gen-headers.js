#!/bin/node
const path = require("path");
const fs = require("fs").promises;

// Files and folders to ignore:
const ignore = [
	// prettier-ignore
	"Headers.ts",
	"Main.ts",
	"tests",
];

async function asyncForEach(array, callback) {
	for (let i = 0; i < array.length; i++) {
		await callback(array[i], i, array);
	}
}

/**
 * @param {string} relativePath
 * @param {string[]} [ignore]
 * @param {(file: { name: string, fullPath: string}) => void} callback Called on every file
 */
async function crawlDir(relativePath, ignore = [], callback) {
	return new Promise(async (resolve, reject) => {
		let target = path.resolve(relativePath);
		let content = await fs.readdir(target);
		await asyncForEach(content, async (item, i, arr) => {
			if (!ignore.includes(item)) {
				const fullPath = path.join(target, item);
				const stat = await fs.stat(fullPath);
				if (stat.isFile()) {
					callback({
						name: item,
						fullPath: fullPath,
					});
				} else if (stat.isDirectory()) {
					await crawlDir(fullPath, ignore, callback);
				}
			}
			if (i == arr.length - 1) resolve();
		});
	});
}

(async () => {
	let data = "";
	console.log("Generating headers...");

	await crawlDir("./src", ignore, file => {
		const target = path.relative("src", file.fullPath).replace(/.ts$/, "");
		data += `export * from "./${target}";\n`;
		console.log("  " + target);
	});

	data = data.slice(0, data.length - 2);
	await fs.writeFile("src/Headers.ts", data);
	console.log("Headers generated!");
})();
