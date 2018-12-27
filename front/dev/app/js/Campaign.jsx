import React from 'react';
import { Row } from 'react-bootstrap';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {getCampaign} from './scenarioService.js';

const REFRESH_TEMPO = 10000;

export default class Campaign extends React.Component {

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
						entropyList: campaign.crossentropy,
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
		let entropyList;
		if (this.state.campaignId) {
			if (this.state.campaign) {
				welcomeMsg = (<div>Campaign:</div>);
			} else {
				welcomeMsg = (<div>No campaign for this id</div>);
			}
		} else {
			welcomeMsg = (<div>Use our plugin to create a campaign</div>);
		}

		return (
			<div>
				<Row>
					{welcomeMsg}
				</Row>
                <Row>
					<HighchartsReact
						highcharts={Highcharts}
						options={{
							chart: {
								type: 'spline',
								animation: Highcharts.svg,
								height: 200
							},
							legend: {
								enabled: false
							},
							credits: false,
							title: null,
							xAxis: {
								type: 'datetime',
								labels: {
									enabled: false
								}
							},
							yAxis: {
								title: null
							},
							series: [{
								data: this.state.entropyList
							}]
						}}
					/>
                </Row>
			</div>
		);
	}

}
