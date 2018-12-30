import React from 'react';
import { Redirect } from 'react-router-dom';
import { Row, Form, Col, FormGroup, FormControl, ControlLabel, Button, Alert } from 'react-bootstrap';

export default class CampaignSelection extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			campaignId: null,
			message: 'plugin initialization'
		};
		this.handleJoin = this.handleJoin.bind(this);
		this.handleCreate = this.handleCreate.bind(this);
	}

	componentDidMount() {
		chrome.runtime.sendMessage(
			{kind:'getState'}, 
			response => {
				chrome.extension.getBackgroundPage().console.log(`Got state : ${JSON.stringify(response)}`); 
				this.setState(response);
			}
		);
	}

	handleCreate(event){
        event.preventDefault();
        
		chrome.runtime.sendMessage(
			{
				kind: 'createCampaign'
			}, response => {
				console.log('CampaignSelection: create response');
				this.setState(response);
				chrome.extension.getBackgroundPage().console.log(`Create response : ${JSON.stringify(response)}`);
			}
		);
	}

	handleJoin(event) {
		event.preventDefault();

		let campaignId = document.getElementById('campaignId').value;
		chrome.runtime.sendMessage(
			{
				kind: 'joinCampaign',
				campaignId: campaignId
			}, response => {
				this.setState(response);
			}
		);
	}

	render() {
		if (this.state.mappedToCampaign) {
			return <Redirect to="/record"/>;
		} 
		return (
			<div>
				
				<Row className="show-grid">
					<Alert bsStyle="info">{this.state.message}</Alert>
				</Row>

				<Row className="show-grid">
					<Form horizontal onSubmit={this.handleJoin}>
						<Col xs={6}>
							<Button onClick={this.handleCreate}>Create new Campaign</Button>
						</Col>
						<Col xs={6}>
							<Button onClick={this.handleJoin}>Or Join existing Campaign</Button>
						</Col>				
						<FormGroup>
							<Col xs={2}>
								<ControlLabel>CampaignId</ControlLabel>
							</Col>
							<Col xs={10}>
								<FormControl id="campaignId" type="text"/>
							</Col>
						</FormGroup>
					</Form>
				</Row>
			</div>
		);
	}
}
