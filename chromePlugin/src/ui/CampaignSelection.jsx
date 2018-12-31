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

		let depth = document.getElementById('depth').value;
		let proba = document.getElementById('proba').value;
        
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
						<Col componentClass={ControlLabel} xs={2}>
							depth:
						</Col>
						<Col xs={10}>
							<FormControl id="depth" type="text" placeholder="4"/>
						</Col>
					</FormGroup>
					<FormGroup>
						<Col componentClass={ControlLabel} xs={2}>
							proba of unknown:
						</Col>
						<Col xs={10}>
							<FormControl id="proba" type="text" placeholder="0.05"/>
						</Col>
					</FormGroup>
					<FormGroup>
						<Col xsOffset={2} xs={10}>
							<Button type="submit">Create Campaign</Button>
						</Col>
					</FormGroup>
				</Form>
				<Form horizontal onSubmit={this.handleJoin} >
					<FormGroup>
						<Col componentClass={ControlLabel} xs={2}>
							CampaignId:
						</Col>
						<Col xs={10}>
							<FormControl id="campaignId" type="text" placeholder="0228f330-8b64-4858-a325-7f3e23e900be"/>
						</Col>
					</FormGroup>
					<FormGroup>
						<Col xsOffset={2} xs={10}>
							<Button type="submit">Or Join existing Campaign</Button>
						</Col>
					</FormGroup>
				</Form>
			</div>
		);
	}
}
