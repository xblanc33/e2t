import React from 'react';
import { Row } from 'react-bootstrap';
import {getCampaign} from './scenarioService.js';

const REFRESH_TEMPO = 10000;

export default class Home extends React.Component {

	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<div>
				<Row>
					Please use our plugin to create a campaign !
				</Row>
			</div>
		);
	}

}
