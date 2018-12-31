import React from 'react';
import { render } from 'react-dom';
import { PageHeader, Grid, Row, Col, Button } from 'react-bootstrap';

import CampaignSelection from './CampaignSelection.jsx';
import Record from './Record.jsx';

class Popup extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			mappedToCampaign : false,
		}
		this.handleInitialization = this.handleInitialization.bind(this);
		this.syncWithBackground = this.syncWithBackground.bind(this);
	}

	componentDidMount() {
		this.syncWithBackground();
	}

	syncWithBackground() {
		chrome.runtime.sendMessage(
			{kind:'getState'}, 
			response => {
				chrome.extension.getBackgroundPage().console.log(`Got state : ${JSON.stringify(response)}`); 
				this.setState(response);
			}
		);
	}

	handleInitialization() {
		event.preventDefault();
		chrome.runtime.sendMessage(
			{kind: 'initialize'},
			response => {
				this.setState(response);
			}
		);
	}

	render() {
		let mainWindow;
		if (this.state.mappedToCampaign) {
			mainWindow = (<Record/>);
		} else {
			mainWindow = (<CampaignSelection syncParent={this.syncWithBackground}/>); 
		}
		return (
			<Grid fluid={true}>
				<Row>
					<Col xs={12} xsOffset={2}>
						<PageHeader>E2T</PageHeader>
						<p className="lead">Test Exploration</p>
						<Button onClick={this.handleInitialization}>Init</Button>
					</Col>
				</Row>
				{mainWindow}
			</Grid>
		);
	}
}

render(<Popup/>, document.getElementById('app'));
