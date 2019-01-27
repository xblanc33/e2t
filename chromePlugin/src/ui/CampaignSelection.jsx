import React from 'react';
import { Form, Col, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

const PROBA = 0.000001; 

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

		let depth = document.getElementById('depth').value;
		let proba = PROBA;
        
		chrome.runtime.sendMessage(
			{
				kind: 'createCampaign',
				options: {
					depth: depth,
					proba: proba
				}
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
			<div>
				<Form horizontal onSubmit={this.handleCreate} >
					<FormGroup>
						<Col xs={10}>
							<Button type="submit">Create Campaign</Button>
						</Col>
					</FormGroup>
					<FormGroup>
						<Col componentClass={ControlLabel} xs={2}>
							depth:
						</Col>
						<Col xs={10}>
							<FormControl id="depth" type="text" placeholder="3"/>
						</Col>
					</FormGroup>
				</Form>
				<Form horizontal onSubmit={this.handleJoin} >
					<FormGroup>
						<Col xs={10}>
							<Button type="submit">Or Join existing Campaign</Button>
						</Col>
					</FormGroup>
					<FormGroup>
						<Col componentClass={ControlLabel} xs={2}>
							Id:
						</Col>
						<Col xs={10}>
							<FormControl id="campaignId" type="text" placeholder="0228f330-8b64-4858-a325-7f3e23e900be"/>
						</Col>
					</FormGroup>
					
				</Form>
			</div>
		);
	}
}
