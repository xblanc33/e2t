import React from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Col, FormGroup, FormControl, ControlLabel, Button, Alert } from 'react-bootstrap';

export default class CampaignSelection extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			campaignId: null,
			message: ''
		};
		this.handleJoin = this.handleJoin.bind(this);
		this.handleCreate = this.handleCreate.bind(this);
	}

	componentDidMount() {
	}

	handleCreate(event){
        event.preventDefault();
        
		chrome.runtime.sendMessage({
			kind: 'createCampaign'
		}, response => {
			console.log('CampaignSelection: create response');
			this.setState({message: response.message});
			chrome.extension.getBackgroundPage().console.log(`Create response : ${JSON.stringify(response)}`);
			this.props.setParentState({campaignId: response.campaignId});
		});
	}

	handleJoin(event) {
		event.preventDefault();

		let campaignId = document.getElementById('campaignId').value;
		chrome.runtime.sendMessage({
			kind: 'joinCampaign',
			campaignId: campaignId
		}, response => {
			this.setState({message: response.message});
			this.props.setParentState({campaignId: response.campaignId});
		});
	}

	render() {
		if (this.props.campaignId) {
			return <Redirect to="/record"/>;
		} 
		return (
			<div>
				<Button onClick={this.handleCreate}>Create new Campaign</Button>
				<br/>
				<Form horizontal onSubmit={this.handleJoin}>
					<FormGroup>
						<Col xs={2}><ControlLabel>CampaignId</ControlLabel></Col>
						<Col xs={10}>
							<FormControl id="campaignId" type="text" value={this.state.token}/>
						</Col>
					</FormGroup>
					{this.state.message &&
						<FormGroup>
							<Col xsOffset={2} xs={10}><Alert bsStyle="danger">{this.state.message}</Alert></Col>
						</FormGroup>
					}
					<FormGroup>
						<Col xsOffset={2} xs={10}><Button id="joinButton" bsStyle="primary" type="submit">Or Join existing Campaign</Button></Col>
					</FormGroup>
				</Form>
			</div>
		);
	}
}
