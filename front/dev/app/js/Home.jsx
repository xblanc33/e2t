import React from 'react';
import { Row } from 'react-bootstrap';

export default class Home extends React.Component {

	constructor(props) {
		super(props);
		let match = props.match;

		this.state = {
		  campaignId : match.params.id
		};
	}
	
	render() {
		return (
			<div>
                <Row>
                    <h1>Home</h1>
					<span>{this.state.campaignId}</span>
                </Row>
			</div>
		);
	}

}
