import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { Grid } from 'react-bootstrap';
import Home from './Home.jsx';
import Campaign from './Campaign.jsx';

class App extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Router>
				<Grid>
					<Route exact path="/" component={Home} />
					<Route path="/:id" component={Campaign} />
				</Grid>
			</Router>
		);
	}
}

render(<App />, document.getElementById('app'));
