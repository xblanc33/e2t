import React from 'react';
import {render} from 'react-dom';
import { Grid, Row, Col, ControlLabel, FormControl } from 'react-bootstrap';


class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			value : 10,
			clicked : 'Not Yet'
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	handleChange(event) {
		event.preventDefault();
		let lis = parseInt(event.target.value);
		if (!isNaN(lis)) {
			console.log("setState");
			this.setState({value:event.target.value});
		}
	}

	handleClick(event) {
		event.preventDefault();
		let clicked = event.target.innerHTML;
		this.setState({clicked:clicked});
	}

	render() {
		let numbers = Array.apply(null, {length: this.state.value}).map(Number.call, Number)
		let uls = (
			<ul>
				{numbers.map((number) => <li><a href="#" onClick={this.handleClick}>{number}</a></li>)}
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
				<Row>
					<h1>Last Click</h1>
					<h2>{this.state.clicked}</h2>
				</Row>
			</Grid>
		);
	}
}

render(<App />, document.getElementById('app'));
