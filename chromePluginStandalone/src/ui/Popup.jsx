import React from 'react';
import { render } from 'react-dom';

import { Grid, PageHeader, Row, Col, ControlLabel} from 'react-bootstrap';
import Toggle from 'react-bootstrap-toggle';

class Popup extends React.Component {

	constructor(props) {
		super(props);
        this.state = {
            isRecording : false
        };     
		this.handleRecording = this.handleRecording.bind(this);
	}
    
    handleRecording(event) {
        //event.preventDefault();
        if (!this.state.isRecording) {
			chrome.windows.getCurrent({populate:true}, window => {
				chrome.runtime.sendMessage(
					{ kind: 'startExpedition' , windowId: window.id},
					response => this.setState(response)
				);
			});
            
        } else {
            chrome.runtime.sendMessage(
                { kind: 'stopExpedition' },
                response => this.setState(response)
            );
        }
	}

	render() {
        let record = (
            <Row>
                <Col xs={12} style={{fontSize:35}}>Recording</Col>
                <Col componentClass={ControlLabel} xs={2}>
                        State:
				</Col>
                <Col xs={4}>
                    <Toggle 
                        onClick={this.handleRecording}
                        on="Record" 
                        off="Pause"
                        size="tiny"
                        active={this.state.isRecording}>
                    </Toggle>
                </Col>
            </Row>
        );
        
        return (
			<Grid fluid={true}>
				<Row>
					<PageHeader>E2T <small>Managin Test Exploration</small></PageHeader>
					
				</Row>
				{record}			
			</Grid>
        );
    }
}

render(<Popup/>, document.getElementById('app'));
