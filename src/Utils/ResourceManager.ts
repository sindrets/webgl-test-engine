import axios from "axios";

export class ResourceManager {

	public static async loadTextFile(url: string): Promise<string> {

		return new Promise<string>((resolve, reject) => {
			axios.get(url)
				.then(resp => {
					if (200 <= resp.status && resp.status < 300) {
						if (typeof resp.data !== "string") {
							reject("Response data was not of type string!");
						}
						else resolve(resp.data);
					}
					else reject(resp);
				})
				.catch(reason => {
					reject(reason);
				});
		});

	}

}