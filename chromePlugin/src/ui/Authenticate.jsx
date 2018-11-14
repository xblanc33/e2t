import React from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Col, FormGroup, FormControl, ControlLabel, Button, Alert } from 'react-bootstrap';

export default class Authenticate extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			signInMessage: "",
			signUpMessage: "",
			jwt: null
		};

		this.handleSignIn = this.handleSignIn.bind(this);
		this.handleSignUp = this.handleSignUp.bind(this);
	}

	componentDidMount() {
	}

	async handleSignIn(event) {
		event.preventDefault();

		chrome.runtime.sendMessage({
			kind: 'signIn' ,
			credentials: {
				username: document.getElementById('sign-in-username').value,
				password: document.getElementById('sign-in-password').value
			}
		}, response => this.setState({
			jwt: response.jwt,
			signInMessage: response.message
		}));
	}

	async handleSignUp(event){
		event.preventDefault();

		chrome.runtime.sendMessage({
			kind: 'signUp' ,
			credentials: {
				username: document.getElementById('sign-up-username').value,
				password: document.getElementById('sign-up-password').value
			}
		}, response => this.setState({signUpMessage: response.message}));
	}


	render() {

		chrome.extension.getBackgroundPage().console.log(`State : ${JSON.stringify(this.state)}`);

		if (this.state.isLoggedIn) {
			return <Redirect to="/token"/>;
		}
		else {
			return (
				<div>
					<Form horizontal onSubmit={this.handleSignIn}>
						<FormGroup>
							<Col xs={2}><ControlLabel>Username</ControlLabel></Col>
							<Col xs={10}>
								<FormControl id="sign-in-username" type="text" value={this.state.username}/>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col xs={2}><ControlLabel>Password</ControlLabel></Col>
							<Col xs={10}>
								<FormControl id="sign-in-password" type="password" value={this.state.password}/>
							</Col>
						</FormGroup>
						{this.state.signInMessage &&
							<FormGroup>
								<Col xsOffset={2} xs={10}><Alert bsStyle="danger">{this.state.signInMessage}</Alert></Col>
							</FormGroup>
						}
						<FormGroup>
							<Col xsOffset={2} xs={10}><Button id="signInButton" bsStyle="primary" type="submit">Sign-In</Button></Col>
						</FormGroup>
					</Form>

					<Form horizontal onSubmit={this.handleSignUp}>
					<FormGroup>
						<Col xs={2}><ControlLabel>Username</ControlLabel></Col>
						<Col xs={10}>
							<FormControl id="sign-up-username" type="text" value={this.state.username}/>
						</Col>
					</FormGroup>
					<FormGroup>
						<Col xs={2}><ControlLabel>Password</ControlLabel></Col>
						<Col xs={10}>
							<FormControl id="sign-up-password" type="password" value={this.state.password}/>
						</Col>
					</FormGroup>
					{this.state.signUpMessage &&
						<FormGroup>
							<Col xsOffset={2} xs={10}><Alert bsStyle="danger">{this.state.signUpMessage}</Alert></Col>
						</FormGroup>
					}
					<FormGroup>
						<Col xsOffset={2} xs={10}><Button id="signUpButton" bsStyle="primary" type="submit">Sign-Up</Button></Col>
					</FormGroup>
					</Form>
				</div>
			);
		}

	}
}
