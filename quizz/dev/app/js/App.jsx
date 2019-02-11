import React from 'react';
import {render} from 'react-dom';
import { Grid } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SelectQuizz from './SelectQuizz.jsx';
import Quizz from './Quizz.jsx';


class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			selectedQuizz : undefined
		}
		this.onQuizzSelected = this.onQuizzSelected.bind(this);
	}

	onQuizzSelected(selectedQuizz) {
		console.log(`onQuizzSelected:${selectedQuizz}`);
		this.setState({selectedQuizz:selectedQuizz});
	}

	render() {
		console.log('App Render');
		console.log(`this.quizzSelected:${this.state.selectedQuizz}`);
		let mainWindow;
		if (! this.state.selectedQuizz) {
			mainWindow = (<SelectQuizz onQuizzSelected={this.onQuizzSelected}/>);
		} else {
			mainWindow = (<Quizz level={this.state.selectedQuizz}/>);
		}
		return (

			<Router>
				<Route exact path="/" component={SelectQuizz} />
				<Route path="/quizz" component={Quizz} />
				<Route path="/result" component={Result} />
    		</Router>
		);
	}
}

render(<App />, document.getElementById('app'));
