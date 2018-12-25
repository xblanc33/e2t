import React from 'react';
import { Row } from 'react-bootstrap';
import {getCampaign} from './scenarioService.js';

const REFRESH_TEMPO = 10000;

export default class Home extends React.Component {

	constructor(props) {
		super(props);
		let match = props.match;

		this.state = {
		  campaignId : match.params.id,
		  campaign : undefined,
		  loaded : false
		};
	}

	updateCampaign() {
		if (this.state.campaignId) {
			getCampaign(this.state.campaignId)
				.then(campaign => {
					//console.log('fetched');
					this.setState({
						campaign: campaign,
						loaded: true
					});
				})
				.catch((err) => {
					//console.log(`error:${err}`);
					this.setState({
						campaign: undefined,
						error: err,
						loaded: true
					});
				});
		}
	}

	componentWillMount() {
		let interval = setInterval(() => this.updateCampaign(), REFRESH_TEMPO);

		this.setState({
			intervalId: interval
		});

		this.updateCampaign();
	}

	
	render() {
		let welcomeMsg;
		let lastEntropy;
		if (! this.state.campaignId) {
			welcomeMsg = (<div>Use our plugin to create a campaign</div>);
		}
		if (this.state.campaignId) {
			if (! this.state.campaign) {
				welcomeMsg = (<div>No campaign for this id</div>);
			}
			if (this.state.campaign) {
				welcomeMsg = (<div>Campaign:</div>);
				lastEntropy = (<div>{this.state.campaign.crossentropy.join('-')}</div>);
			}
		}

		

		return (
			<div>
				<Row>
					{welcomeMsg}
				</Row>
                <Row>
                    {lastEntropy}
                </Row>
			</div>
		);
	}

}
