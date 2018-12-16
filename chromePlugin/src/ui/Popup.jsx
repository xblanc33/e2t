import React from 'react';
import { render } from 'react-dom';
import { PageHeader, Grid, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Route, browserHistory } from 'react-router-dom';

import CampaignSelection from './CampaignSelection.jsx';
import Record from './Record.jsx';

class Popup extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			campaignId: null,
			expedition: {
				events: null
			}
		};

		this.setParentState = this.setParentState.bind(this);
	}

	componentDidMount() {
		chrome.runtime.sendMessage({kind:'getState'}, response => {chrome.extension.getBackgroundPage().console.log(`Got state : ${JSON.stringify(response)}`); this.setState(response);});
	}

	setParentState(state){
		chrome.extension.getBackgroundPage().console.log(`Setting state : ${JSON.stringify(state)}`);
		this.setState(state);
	}

	render() {
		return (
			<Router history={browserHistory}>
				<Grid fluid={true}>
					<Row>
						<Col lg={12}>
							<PageHeader>E2T</PageHeader>
							<p className="lead">Test Exploration</p>
						</Col>
					</Row>
					<Row>
						<Col lg={12}>
							<Route
								exact path="/popup.html"
								render={(props) => <CampaignSelection
									{...props}
									campaignId={this.state.campaignId}
									setParentState={this.setParentState}
								/>}
							/>
							<Route 
								path="/record"
								render={(props) => <Record
									{...props}
									campaignId={this.state.campaignId}
									expedition={this.state.expedition}
									setParentState={this.setParentState}
								/>}
							/>
						</Col>
					</Row>
				</Grid>
			</Router>
		);
	}
}

render(<Popup/>, document.getElementById('app'));
