import React from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';
import Entropy from './Entropy.jsx';

export default class Record extends React.Component {  // TODO
	constructor(props) {
        super(props);
        
        this.state = {
            message: ''
        };
        
		this.handleStart = this.handleStart.bind(this);
		this.handlePublish = this.handlePublish.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}

	componentDidMount() {
    }
    
    handleStart(event) {
        event.preventDefault();
        
		chrome.runtime.sendMessage({ kind: 'startExpedition' });
		this.props.setParentState({expedition: {events: []}});
	}

	handlePublish(event) {
		event.preventDefault();

        chrome.runtime.sendMessage(
            {kind: 'publishExpedition', campaignId: this.props.campaignId},
            response => this.setState({message: response.message})
        );
        this.props.setParentState({expedition: {events: null}});
    }
    
    handleDelete(event) {
        event.preventDefault();

        chrome.runtime.sendMessage({kind: 'deleteExpedition'});
        this.props.setParentState({expedition: {events: null}});
    }

	render() {
        let buttonToolbar = this.props.expedition.events?(  // True if the array is defined (even if empty)
            <ButtonToolbar>
                <Button bsStyle="primary" onClick={this.handlePublish}>Publish</Button>
                <Button bsStyle="danger" onClick={this.handleDelete}>Delete</Button>
            </ButtonToolbar>
        ):(
            <ButtonToolbar>
                <Button bsStyle="primary" onClick={this.handleStart}>Record</Button>
            </ButtonToolbar>
        );
        return (
            <div>
                <p>Campaign ID : {this.props.campaignId}</p>
                {/*<Entropy
                    campaignId={this.props.campaignId}
                />*/}
                {buttonToolbar}
            </div>
        );
    }
}
