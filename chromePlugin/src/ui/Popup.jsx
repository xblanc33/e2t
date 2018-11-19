import React from 'react';
import { render } from 'react-dom';
import { PageHeader, Grid, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Route, browserHistory } from 'react-router-dom';

import Authenticate from './Authenticate.jsx';
import CampaignSelection from './CampaignSelection.jsx';
import Record from './Record.jsx';

class Popup extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			jwt: null,
			campaignId: null,
		};

		this.setParentState = this.setParentState.bind(this);
	}

	componentDidMount() {
		chrome.runtime.sendMessage({kind:'getState'}, response => this.setState(response));
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
							<PageHeader>E2T | Exploratory Testing Tool</PageHeader>
							<p className="lead">Record your test expeditions.</p>
						</Col>
					</Row>
					<Row>
						<Col lg={12}>
							<Route
								exact path="/popup.html"
								render={(props) => <Authenticate
									{...props}
									jwt={this.state.jwt} 
									setParentState={this.setParentState}
								/>}
							/>
							<Route 
								path="/campaign-selection"
								render={(props) => <CampaignSelection
									{...props}
									jwt={this.state.jwt}
									campaignId={this.state.campaignId}
									setParentState={this.setParentState}
								/>}
							/>
							<Route 
								path="/record"
								render={(props) => <Record
									{...props}
									jwt={this.state.jwt}
									campaignId={this.state.campaignId}
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
