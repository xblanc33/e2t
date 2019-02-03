import React from 'react';
import { Row, Col, ControlLabel, FormControl } from 'react-bootstrap';
import Toggle from 'react-bootstrap-toggle';
import QuestionnaireFactory from './QuestionnaireFactory.js';

const LEVEL_DEFAULT = "medium";
const SIZE_DEFAULT = 4;
const BUG_DEFAULT = 2;

export default class Quizz extends React.Component {

	constructor(props) {
		super(props);
		console.log('Quizz');
		this.state = {
			level : props.level || LEVEL_DEFAULT,
			size : props.size || SIZE_DEFAULT,
			bug : props.bug || BUG_DEFAULT
		}
		let factory = new QuestionnaireFactory();
		this.state.questionnaire = factory.buildQuestionnaire(this.state.level, this.state.size);
		console.log(JSON.stringify(this.state.questionnaire));

		this.submit = this.submit.bind(this);
	}

	submit(event) {
		event.preventDefault();
	}


	render() {
		let quizz = this.state.questionnaire.map( question => {
			let text = <Col xs={6}>{question.text}</Col>;
			let answer = (<Col xs={6}>
							<Toggle 
								on="True" 
								off="False"
								size="tiny">
							</Toggle>
						</Col>);
			return <Row>{text}{answer}</Row>;
		})
		return (
			<div>{quizz}</div>
		);
	}
}
