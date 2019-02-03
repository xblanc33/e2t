import React from 'react';
import { Row, Col, ControlLabel, FormControl, Button } from 'react-bootstrap';


export default class SelectQuizz extends React.Component {

	constructor(props) {
        super(props);
		this.onQuizzSelected = props.onQuizzSelected;
		console.log(this.onQuizzSelected);
		this.selectQuizz = this.selectQuizz.bind(this);
	}

	selectQuizz(event) {
		event.preventDefault();
		console.log('selectQuizz');
        let selectedQuizz = document.getElementById("difficulty").value;
        this.onQuizzSelected(selectedQuizz);
	}

	render() {
		return (
			<Row>
    			<Col xs={4}>
					<ControlLabel>Select Quizz</ControlLabel>
				</Col>
				<Col xs={8}>
                    <FormControl id="difficulty" componentClass="select" placeholder="easy">
                        <option value="easy">easy</option>
                        <option value="medium">medium</option>
                        <option value="hard">hard</option>
                    </FormControl>
				</Col>
                <Col xs={2}>
                    <Button type="submit" onClick={this.selectQuizz}>Submit</Button>
                </Col>
			</Row>
		);
	}
}
