import React from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';

export default class Record extends React.Component {  // TODO
	constructor(props) {
        super(props);
        this.state = {
            isRecording : false
        };     
		this.handleStart = this.handleStart.bind(this);
		this.handlePublish = this.handlePublish.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
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

	render() {
        let buttonToolbar = this.state.isRecording?(  // True if the array is defined (even if empty)
            <ButtonToolbar>
                <Button bsStyle="success" id="success" onClick={this.handlePublish}>Success</Button>
                <Button bsStyle="danger" id="failure" onClick={this.handlePublish}>Failure</Button>
                <Button bsStyle="primary" onClick={this.handleDelete}>Cancel</Button>
            </ButtonToolbar>
        ):(
            <ButtonToolbar>
                <Button bsStyle="primary" onClick={this.handleStart}>Record</Button>
            </ButtonToolbar>
        );
        return (
            <div>
                <p>Campaign ID : {this.state.campaignId}</p>
                {/*<Entropy
                    campaignId={this.props.campaignId}
                />*/}
                {buttonToolbar}
            </div>
        );
    }
}
