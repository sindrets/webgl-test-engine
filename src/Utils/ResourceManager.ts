import axios from "axios";

export class ResourceManager {
	/**
	 * Fetch the contents of a text file. Results are cached for faster access on subsequent calls.
	 * @param url The file url
	 * @param forceReload Force a new GET request even if the file is already cached
	 */
	public static async loadTextFile(url: string, forceReload = false): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			let resolvedUrl = new URL(url, location.origin).href;
			if (!forceReload) {
				if (Object.keys(sessionStorage).indexOf(resolvedUrl) > -1) {
					resolve(sessionStorage.getItem(resolvedUrl) as string);
					return;
				}
			}
			axios
				.get(url)
				.then(resp => {
					if (200 <= resp.status && resp.status < 300) {
						if (typeof resp.data !== "string") {
							reject("Response data was not of type string!");
						} else {
							// cache the data with the file url as key
							sessionStorage.setItem(resolvedUrl, resp.data);
							resolve(resp.data);
						}
					} else reject(resp);
				})
				.catch(reason => {
					reject(reason);
				});
		});
	}
}
