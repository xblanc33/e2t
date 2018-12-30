import React from 'react';
import { render } from 'react-dom';
import { PageHeader, Grid, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Route, browserHistory } from 'react-router-dom';

import CampaignSelection from './CampaignSelection.jsx';
import Record from './Record.jsx';

class Popup extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Router history={browserHistory}>
				<Grid fluid={true}>
					<Row className="show-grid">
						<Col xs={12} xsOffset={1}>
							<PageHeader>E2T</PageHeader>
							<p className="lead">Test Exploration</p>
						</Col>
					</Row>
					<Row className="show-grid">
						<Col xs={12} xsOffset={1}>
							<Route
								exact path="/popup.html"
								component={CampaignSelection}
							/>
							<Route 
								path="/record"
								component={Record}
							/>
						</Col>
					</Row>
				</Grid>
			</Router>
		);
	}
}

render(<Popup/>, document.getElementById('app'));
