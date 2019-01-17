import React from 'react';
import {render} from 'react-dom';
import { Grid, Row, Col, ControlLabel, FormControl } from 'react-bootstrap';


class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			value : 10
		}
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		console.log(event.target.value);
		event.preventDefault();
		let lis = parseInt(event.target.value);
		console.log(lis);
		if (!isNaN(lis)) {
			console.log("setState");
			this.setState({value:event.target.value});
		}
	}

	render() {
		console.log(`${this.state.value}`);
		let numbers = Array.apply(null, {length: this.state.value}).map(Number.call, Number)
		let uls = (
			<ul>
				{numbers.map((number) => <li><a href="http://localhost">{number}</a></li>)}
			</ul>
		);
		return (
			<Grid>
				<Row>
					<Col xs={2}>
						<ControlLabel>#IL</ControlLabel>
					</Col>
					<Col xs={10}>
						<FormControl
							type="text"
							value={this.state.value}
							placeholder="8"
							onChange={this.handleChange}
						/>
					</Col>
				</Row>
				<Row>
					{uls}
				</Row>
			</Grid>
		);
	}
}

render(<App />, document.getElementById('app'));
