import { ResourceManager } from "../Utils/ResourceManager";

const href = process.env["TEST_URL"] || "http://localhost:3000";

test("Text file is loaded correctly and resolves with a string.", async () => {
	return new Promise((resolve, reject) => {
		ResourceManager.loadTextFile(href + "/LICENSE")
			.then(data => {
				expect(typeof data).toBe("string");
				resolve();
			})
			.catch(reason => {
				reject(reason);
			});
	});
});

test("Non-existing file will fail and reject Promise.", async () => {
	return new Promise((resolve, reject) => {
		ResourceManager.loadTextFile(href + "/my-dad")
			.catch(reason => {
				resolve();
			})
			.then(data => {
				reject();
			});
	});
});
