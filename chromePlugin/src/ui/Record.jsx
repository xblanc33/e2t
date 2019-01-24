import React from 'react';
import { Row, Col, ButtonToolbar, Button, FormControl, ControlLabel} from 'react-bootstrap';
import Toggle from 'react-bootstrap-toggle';

export default class Record extends React.Component {  // TODO
	constructor(props) {
        super(props);
        this.state = {
            isRecording : false
        };     
		this.handleRecording = this.handleRecording.bind(this);
	}

	componentDidMount() {
        chrome.runtime.sendMessage(
			{kind:'getState'}, 
			response => {
				this.setState(response);
			}
		);
    }
    
    handleRecording(event) {
        //event.preventDefault();
        if (!this.state.isRecording) {
            chrome.runtime.sendMessage(
                { kind: 'startExpedition' },
                response => this.setState(response)
            );
        } else {
            chrome.runtime.sendMessage(
                { kind: 'stopExpedition' },
                response => this.setState(response)
            );
        }
	}
    
	render() {
        let profile = (
            <Row>
                <Col xs={12} style={{fontSize:35}}>User's Profile</Col>
                <Col xs={2} >Id </Col>
                <Col xs={10}>{this.state.userId}</Col>
                <Col xs={2} >Color </Col>
                <Col xs={10}>
                    <table width="20" height="20" align="left" style={{backgroundColor: this.state.userColor}}  cellPadding="2" border="3" border-style="ridge">
                        <tbody>
                            <tr>
                                <td>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Col>
            </Row>
        )
        let infos = (
            <Row>
                <Col xs={12} style={{fontSize:35}}>Joined Campaign</Col>
                <Col xs={2}>Id </Col>
                <Col xs={8}>{this.state.campaignId}</Col>
            </Row>
        );
        let autoPublish = (
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
        let buttonToolbar = this.state.isRecording?(  // True if the array is defined (even if empty)
            <Row>
                <Col xs={12} style={{fontSize:35}}>Test Result</Col>
                <Col xs={10}>
                    <ButtonToolbar>
                        <Button bsStyle="success" id="success" onClick={this.handlePublish} disabled={this.state.autoPublish}>Success</Button>
                        <Button bsStyle="danger" id="failure" onClick={this.handlePublish} disabled={this.state.autoPublish}>Failure</Button>
                    </ButtonToolbar>
                </Col>
            </Row>
        ):(
            <Row>
            </Row>
        );
        return (
            <div>
                {profile}
                {infos}
                {autoPublish}
                {buttonToolbar}
            </div>
        );
    }
}
