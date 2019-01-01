import React from 'react';
import { Row, Jumbotron } from 'react-bootstrap';

const REFRESH_TEMPO = 10000;

export default class Home extends React.Component {

	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<Jumbotron>
  				<h1>E2T : Exploratory Testing Tool</h1>
  				<p>
					E2T allows you to perform exploratory testing campaigns on your website.
  				</p>
  				<p>
    				Please use our plugin to create or join a campaign !
  				</p>
			</Jumbotron>
		);
	}

}
