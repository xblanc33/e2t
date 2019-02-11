import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
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
			bug : props.bug || BUG_DEFAULT,
		}
		let factory = new QuestionnaireFactory();
		this.state.questionnaire = factory.buildQuestionnaire(this.state.level, this.state.size);
		this.state.answers = [];
		for (let index = 0; index < this.state.questionnaire.length; index++) {
			this.state.answers[index] = false;
		}
		console.log(JSON.stringify(this.state.questionnaire));

		this.submit = this.submit.bind(this);
		this.handleAnswerToQuestion = this.handleAnswerToQuestion.bind(this);
	}

	handleAnswerToQuestion(event) {
		console.log(event)
		event.target.active = ! event.target.active;
	}

	submit(event) {
		event.preventDefault();
		console.log('submit');
	}


	render() {
		let quizz = this.state.questionnaire.map( (question, index) => {
			let text = <Col xs={6}>{question.text}</Col>;
			let answer = (<Col xs={6}>
							<Toggle 
								id={`toggle_${index}`}
								onClick={this.handleAnswerToQuestion}
								on="True" 
								off="False"
								size="tiny"
								active={this.state.answers[number]}>
							</Toggle>
						</Col>);
			return <Row>{text}{answer}</Row>;
		})
		return (
			<div>
				{quizz}
				<Col xs={4}>Submit</Col>
				<Col xs={8}>
					<Button onClick={this.submit}>Submit</Button>
				</Col>
			</div>
		);
	}
}
