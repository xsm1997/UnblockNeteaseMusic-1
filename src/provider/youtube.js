const cache = require('../cache')
const execa = require('execa');

/**
 * The arguments to pass to youtube-dl
 * 
 * ```plain
 * youtube-dl -f bestaudio --dump-json <query>
 *		-f bestaudio 	choose the best quality of the audio
 *		--dump-json		dump the information as JSON without downloading it
 * ```
 * 
 * @param {string} query 
 */
const dlArguments = (query) => ["-f", "140", "--dump-json", query];
/** @param {string} id */
const byId = (id) => `https://www.youtube.com/watch?v=${id}`;
/** @param {string} keyword */
const byKeyword = (keyword) => `ytsearch1:${keyword}`;

/**
 * Checking if youtube-dl is available,
 * then execute the command and extract the ID and URL.
 * 
 * @param {string[]} args
 * @returns {Promise<{id: string, url: string}>}
 */
async function getUrl(args) {
	const { stdout } = await execa("youtube-dl", args);
	const response = JSON.parse(stdout);
	if (
		typeof response === "object" &&
		typeof response.id === "string" &&
		typeof response.url === "string"
	) {
		console.log(response.url);
		return response;
	}

	throw new Error("the response from youtube-dl is invalid.");
}

const search = async (info) => {
	const { id } = await getUrl(dlArguments(byKeyword(info.keyword)));
	return id;
}

const track = async id => {
	const { url } = await getUrl(dlArguments(byId(id)));
	return url;
}

const check = info => cache(search, info).then(track)

module.exports = {check, track}
