export class ResourceManager {
	private static cache = new Map<string, any>();

	/**
	 * Fetch the contents of a text file. Results can be cached for faster access on subsequent
	 * calls.
	 * @param url The file url
	 * @param cache Whether or not the file should be cached
	 * @param forceReload Force a new GET request even if the file is already cached
	 */
	public static async loadTextFile(
		url: string,
		cache = false,
		forceReload = false,
	): Promise<string> {
		return new Promise((resolve, reject) => {
			ResourceManager.fetch(url, cache, forceReload, "text::")
				.then(async resp => {
					const data = await resp.text();
					if (typeof data !== "string") {
						reject("Response data was not of type 'string'!");
						console.error(data);
					} else {
						resolve(data);
					}
				})
				.catch(reason => {
					reject(reason);
				});
		});
	}

	/**
	 * Fetch the contents of a json file as an object. Results can be cached for faster access on
	 * subsequent calls.
	 * @param url The file url
	 * @param cache Whether or not the file should be cached
	 * @param forceReload Force a new GET request even if the file is already cached
	 */
	public static async loadJsonFile(
		url: string,
		cache = false,
		forceReload = false,
	): Promise<string> {
		return new Promise((resolve, reject) => {
			ResourceManager.fetch(url, cache, forceReload, "json::")
				.then(async resp => {
					const data = await resp.json();
					if (typeof data !== "object") {
						reject("Response data was not of type 'object'!");
						console.error(data);
					} else {
						resolve(data);
					}
				})
				.catch(reason => {
					reject(reason);
				});
		});
	}

	/**
	 * Perform a GET request and optionally cache the sucessfull response.
	 * @param url
	 * @param cache Whether or not the response should be cached. Only sucessfull requests are
	 * cached.
	 * @param forceReload Perform a new GET request regardless of whether or not an entry exists in
	 * cache.
	 * @param cacheKeyPrefix A prefix for the cache key.
	 * @param options
	 */
	public static async fetch(
		url: string,
		cache: boolean,
		forceReload: boolean,
		cacheKeyPrefix = "fetch::",
		options: RequestInit = {},
	): Promise<Response> {
		return new Promise((resolve, reject) => {
			let resolvedUrl = new URL(url, location.origin).href;
			let cacheKey = cacheKeyPrefix + resolvedUrl;
			if (cache && !forceReload) {
				if (ResourceManager.cache.has(cacheKey)) {
					resolve(ResourceManager.cache.get(cacheKey));
					return;
				}
			}
			fetch(url, options)
				.then(resp => {
					if (resp.ok) {
						if (cache) {
							ResourceManager.cache.set(cacheKey, resp);
						}
						resolve(resp);
					} else reject(resp);
				})
				.catch(reason => {
					reject(reason);
				});
		});
	}
}
