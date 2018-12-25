import axios from 'axios';

const BASE_URL = location.protocol + '//' + location.hostname + (location.port ? ':'+location.port: '');

export function getCampaign() {
	const url = `${BASE_URL}/campaign/${sid}`;
	return get(url);
}

function get(url) {
	return new Promise((resolve, reject) => {
		axios.get(url)
			.then( response => {
				console.log(`Response to GET ${url} : ${response.data}`);
				resolve(response.data);
			})
			.catch (err => {
				console.log(`Error to GET ${url} : ${err} `);
				reject(err);
			});
	});
}