import React from 'react';
import {render} from 'react-dom';
import { Grid, Row, Col, ControlLabel, FormControl } from 'react-bootstrap';


export default class Quizz extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			level : props.level,
			size : props.size,
			bug : props.bug
		}
		this.state.question = buildQuestion(this.level, this.size, this.bug);

		this.submit = this.submit.bind(this);
	}

	buildQuestion(leve, size, bug) {
		
	}

	submit(event) {
		event.preventDefault();
	}


	render() {
		let numbers = Array.apply(null, {length: this.state.value}).map(Number.call, Number)
		let uls = (
			<ul>
				{numbers.map((number) => <li><a href="#" onClick={this.handleClick}>{number}</a></li>)}
			</ul>
		);
		return (
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
		);
	}
}
