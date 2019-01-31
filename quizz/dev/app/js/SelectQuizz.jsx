import React from 'react';
import { Row, Col, ControlLabel, FormControl } from 'react-bootstrap';


export default class SelectQuizz extends React.Component {

	constructor(props) {
        super(props);
        this.onQuizzSelected = props.onQuizzSelected;
		this.selectQuizz = this.selectQuizz.bind(this);
	}

	selectQuizz(event) {
		event.preventDefault();
        let selectedQuizz = event.target.value;
        this.onQuizzSelected(selectedQuizz);
	}

	render() {
		return (
			<Row>
    			<Col xs={4}>
					<ControlLabel>Select Quizz</ControlLabel>
				</Col>
				<Col xs={8}>
                    <FormControl componentClass="select" placeholder="easy">
                        <option value="easy">easy</option>
                        <option value="medium">medium</option>
                        <option value="hard">hard</option>
                    </FormControl>
				</Col>
                <Col xs={2}>
                    <Button type="submit" onSubmit={this.selectQuizz}>Submit</Button>
                </Col>
			</Row>
		);
	}
}
