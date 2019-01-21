import axios from 'axios';

const BASE_URL = location.protocol + '//' + location.hostname + (location.port ? ':'+location.port: '');

export function getCampaign(campaignId) {
	const url = `${BASE_URL}/api/campaign/${campaignId}`;
	return get(url);
}

function get(url) {
	return new Promise((resolve, reject) => {
		axios.get(url)
			.then( response => {
				resolve(response.data);
			})
			.catch (err => {
				reject(err);
			});
	});
}