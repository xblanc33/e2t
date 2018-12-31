import React from 'react';
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
				if (response.mappedToCampaign) {
					this.props.syncParent();
				}
				this.setState(response);
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
				if (response.mappedToCampaign) {
					this.props.syncParent();
				}
				this.setState(response);
			}
		);
	}

	render() {
		return (
			<Form horizontal onSubmit={this.handleJoin} >
				<Button onClick={this.handleCreate}>Create new Campaign</Button>
				<Button onClick={this.handleJoin}>Or Join existing Campaign</Button>
				<FormGroup>
					<Col componentClass={ControlLabel} sm={2}>
						CampaignId:
					</Col>
					<Col sm={10}>
						<FormControl id="campaignId" type="text" placeholder="0228f330-8b64-4858-a325-7f3e23e900be"/>
					</Col>
				</FormGroup>
			</Form>
		);
	}
}
