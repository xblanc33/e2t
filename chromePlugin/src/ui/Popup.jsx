import React from 'react';
import { render } from 'react-dom';
import { PageHeader, Grid, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Route, browserHistory } from 'react-router-dom';

import Authenticate from './Authenticate.jsx';

class Popup extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Router history={browserHistory}>
				<Grid fluid={true}>
					<Row>
						<Col lg={12}>
							<PageHeader>E2T | Exploratory Testing Tool</PageHeader>
							<p className="lead">Record your test expeditions.</p>
						</Col>
					</Row>
					<Row>
						<Col lg={12}>
							<Route
								exact path="/popup.html"
								render={(props) => <Authenticate {...props} />}
							/>
						</Col>
					</Row>
				</Grid>
			</Router>
		);
	}
}

render(<Popup/>, document.getElementById('app'));
