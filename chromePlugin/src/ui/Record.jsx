import React from 'react';
import { Row, Col, ButtonToolbar, Button, FormControl, ControlLabel} from 'react-bootstrap';
import Toggle from 'react-bootstrap-toggle';

export default class Record extends React.Component {  // TODO
	constructor(props) {
        super(props);
        this.state = {
            isRecording : false,
            autoPublish : false,
            autoPublishTime : 4000,
        };     
		this.handleStart = this.handleStart.bind(this);
		this.handlePublish = this.handlePublish.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAutoPublish = this.handleAutoPublish.bind(this);
	}

	componentDidMount() {
        chrome.runtime.sendMessage(
			{kind:'getState'}, 
			response => {
				this.setState(response);
			}
		);
    }
    
    handleStart(event) {
        event.preventDefault();
		chrome.runtime.sendMessage(
            { kind: 'startExpedition' },
            response => this.setState(response)
        );
	}

	handlePublish(event) {
        event.preventDefault();
        chrome.runtime.sendMessage(
            {
                kind: 'publishExpedition',
                result: event.target.id
            },
            response => this.setState(response)
        );
    }
    
    handleDelete(event) {
        event.preventDefault();
        chrome.runtime.sendMessage(
            {kind: 'deleteExpedition'},
            response => this.state.setState(response)
        );
    }

    handleAutoPublish() {
        this.setState({autoPublish: !this.state.autoPublish}, this.launchAutoPublish);
    }

    handleAutoPublishTime(event) {
        this.setState({autoPublishTime: event.target.value}, this.launchAutoPublish);
    }

    launchAutoPublish() {
        chrome.runtime.sendMessage(
            {kind: 'launchAutoRecord',
            autoPublish: this.state.autoPublish,
            autoPublishTime: this.state.autoPublishTime
            }
        );
    }

	render() {
        let profile = (
            <Row>
                <Col xs={8} style={{fontSize:40}}>User's Profile</Col>
                <Col xs={4}>
                    <span style={{color: this.state.userColor, fontSize:50}}>&#9679;</span>
                </Col>
                <Col xs={2} >Id </Col>
                <Col xs={8}>{this.state.userId}</Col>
            </Row>
        )
        let infos = (
            <Row>
                <Col xs={12} style={{fontSize:40}}>Campaign</Col>
                <Col xs={2}>Id </Col>
                <Col xs={8}>{this.state.campaignId}</Col>
            </Row>
        );
        let autoPublish = (
            <Row>
                <Col xs={12} style={{fontSize:40}}>Recording</Col>
                <Col componentClass={ControlLabel} xs={2}>
                        Mode:
				</Col>
                <Col xs={4}>
                    <Toggle 
                        onClick={this.handleAutoPublish}
                        on="Auto" 
                        off="Manual"
                        size="tiny"
                        active={this.state.autoPublish}>
                    </Toggle>
                </Col>
                <Col componentClass={ControlLabel} xs={2}>
                        each(ms):
				</Col>
                <Col xs={4}>
                    <FormControl id="autoPulishTime" type="text" placeholder="3000" disabled={!this.state.autoPublish}/>
                </Col>
            </Row>
        );
        let buttonToolbar = this.state.isRecording?(  // True if the array is defined (even if empty)
            <Row>
                <Col xs={10}>
                    <ButtonToolbar>
                        <Button bsStyle="success" id="success" onClick={this.handlePublish} disabled={this.state.autoPublish}>Success</Button>
                        <Button bsStyle="danger" id="failure" onClick={this.handlePublish} disabled={this.state.autoPublish}>Failure</Button>
                        <Button bsStyle="primary" onClick={this.handleDelete} disabled={this.state.autoPublish}>Cancel</Button>
                    </ButtonToolbar>
                </Col>
            </Row>
        ):(
            <Row>
                <Col xs={10}>
                    <ButtonToolbar>
                        <Button bsStyle="primary" onClick={this.handleStart} disabled={this.state.autoPublish}>Record</Button>
                    </ButtonToolbar>
                </Col>
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
