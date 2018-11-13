import React from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Col, FormGroup, FormControl, ControlLabel, Button, Alert } from 'react-bootstrap';

export default class Authenticate extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			message: "",
			jwt: null
		};

		this.handleSignIn = this.handleSignIn.bind(this);
		this.handleSignUp = this.handleSignUp.bind(this);
	}

	componentDidMount() {
	}

	async handleSignIn() {
		chrome.runtime.sendMessage({
			kind: 'signIn' ,
			credentials: {
				username: document.getElementById('sign-in-username').value,
				password: document.getElementById('sign-in-password').value
			}
		}, response => this.setState(() => response));
	}

	async handleSignUp(){
		chrome.runtime.sendMessage({
			kind: 'signUp' ,
			credentials: {
				username: document.getElementById('sign-up-username').value,
				password: document.getElementById('sign-up-password').value
			}
		}, response => {chrome.extension.getBackgroundPage().console.log(`Handle signup response : ${response}`); this.setState(() => response);});
	}


	render() {

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
						{this.state.message &&
							<FormGroup>
								<Col xsOffset={2} xs={10}><Alert bsStyle="danger">{this.state.message}</Alert></Col>
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
					{this.state.message &&
						<FormGroup>
							<Col xsOffset={2} xs={10}><Alert bsStyle="danger">{this.state.message}</Alert></Col>
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
