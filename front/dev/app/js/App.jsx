import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './Home.jsx';

class App extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Router >
				<div>
					<Route path="/:id" component={Home} />
				</div>
			</Router>
		);
	}
}

render(<App />, document.getElementById('app'));
