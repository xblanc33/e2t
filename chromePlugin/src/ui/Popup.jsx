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
		chrome.windows.getCurrent({populate:true}, window => {
			chrome.runtime.sendMessage(
				{kind:'setWindow' , windowId : window.id},
				() => {
					chrome.runtime.sendMessage(
						{kind:'getState'}, 
						response => {
							chrome.extension.getBackgroundPage().console.log(`Got state : ${JSON.stringify(response)}`); 
							this.setState(response);
						}
					);
				}
			)
		});
		
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
		let footer;
		if (this.state.mappedToCampaign) {
			mainWindow = (<Record/>);
			footer = (
				<Row>
					<Col xsOffset={6} xs={2}>
						<Button onClick={this.handleInitialization}>Change Campaign</Button>
					</Col>
				</Row>
			);
		} else {
			mainWindow = (<CampaignSelection syncParent={this.syncWithBackground}/>); 
		}
		return (
			<Grid fluid={true}>
				<Row>
					<PageHeader>E2T <small>Managin Test Exploration</small></PageHeader>
					
				</Row>
				{mainWindow}
				{footer}
			</Grid>
		);
	}
}

render(<Popup/>, document.getElementById('app'));
