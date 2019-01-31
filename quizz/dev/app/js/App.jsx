import React from 'react';
import {render} from 'react-dom';
import { Grid } from 'react-bootstrap';
import SelectQuizz from './SelectQuizz.jsx';


class App extends React.Component {

	constructor(props) {
		this.state = {
			selectedQuizz : undefined
		}
	}

	onSelectedQuizz(selectedQuizz) {
		console.log(`quizzSelected:${selectedQuizz}`);
	}

	render() {
		let mainWindow;
		if (! this.selectedQuizz) {
			mainWindow = (<SelectQuizz onSelectedQuizz="this.onSelectedQuizz"/>);
		}
		return (
			<Grid>
				{mainWindow}
			</Grid>
		);
	}
}

render(<App />, document.getElementById('app'));
