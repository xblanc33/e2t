import React from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Col, FormGroup, FormControl, ControlLabel, Button, Alert } from 'react-bootstrap';

export default class Token extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			credential : {
				token : ''
			},
			message: null,
			isLoggedIn : false
		};
		this.handleJoin = this.handleJoin.bind(this);
		this.handleNew = this.handleNew.bind(this);
	}

	componentDidMount() {
	}

	async handleNew(event){
        event.preventDefault();
        
		chrome.runtime.sendMessage({ kind: 'newToken'}, (response) => {
			if (response.groupSessionToken) {
				//this.props.callbackFromParent(response.groupSessionToken);
				this.setState(() => {
					return {
						groupSessionToken: response.groupSessionToken
					};
				});
			} else {
				this.setState(() => {
					return {
						groupSessionToken: undefined
					};
				});
			}
		});
	}

	async handleJoin(event) {
		event.preventDefault();

		let groupSessionToken = document.getElementById('token').value;

		chrome.runtime.sendMessage({
			kind: 'token',
			groupSessionToken: groupSessionToken
		}, (response) => {
			if (response.groupSessionToken) {
				this.props.callbackFromParent(response.groupSessionToken);
				this.setState(() => {
					return {
						groupSessionToken: response.groupSessionToken,
						message: null
					};
				});
				button.removeChild(span);
			} else {
				this.setState(() => {
					return {
						groupSessionToken: undefined,
						message: 'Invalid token. Either correct it or create a new one.'
					};
				});
				button.removeChild(span);
			}
		});
	}

	render() {
		if (this.state.groupSessionToken) {
			return <Redirect to="/record"/>;
		} else {
			return (
				<div>
					<Button onClick={this.handleNew}>Create Session</Button>
					<br/>
					<Form horizontal onSubmit={this.handleJoin}>
						<FormGroup>
							<Col xs={2}><ControlLabel>Join session with Token</ControlLabel></Col>
							<Col xs={10}>
								<FormControl id="token" type="text" value={this.state.token}/>
							</Col>
						</FormGroup>
						{this.state.message &&
							<FormGroup>
								<Col xsOffset={2} xs={10}><Alert bsStyle="danger">{this.state.message}</Alert></Col>
							</FormGroup>
						}
						<FormGroup>
							<Col xsOffset={2} xs={10}><Button id="joinButton" bsStyle="primary" type="submit">Join session</Button></Col>
						</FormGroup>
					</Form>
				</div>
			);
		}

	}
}
