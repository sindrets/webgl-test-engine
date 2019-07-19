import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

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
			ResourceManager.fetch(url, cache, forceReload, "text::", {
				responseType: "text",
				transformResponse: data => data,
			})
				.then(resp => {
					if (typeof resp.data !== "string") {
						reject("Response data was not of type 'string'!");
						console.error(resp.data);
					} else {
						resolve(resp.data);
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
			ResourceManager.fetch(url, cache, forceReload, "json::", { responseType: "json" })
				.then(resp => {
					if (typeof resp.data !== "object") {
						reject("Response data was not of type 'object'!");
						console.error(resp.data);
					} else {
						resolve(resp.data);
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
		options: AxiosRequestConfig = {},
	): Promise<AxiosResponse> {
		return new Promise((resolve, reject) => {
			let resolvedUrl = new URL(url, location.origin).href;
			let cacheKey = cacheKeyPrefix + resolvedUrl;
			if (cache && !forceReload) {
				if (ResourceManager.cache.has(cacheKey)) {
					resolve(ResourceManager.cache.get(cacheKey));
					return;
				}
			}
			axios
				.get(url, options)
				.then(resp => {
					if (~~(resp.status / 100) == 2) {
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
