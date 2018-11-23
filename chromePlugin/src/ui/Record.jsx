import React from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';
import Entropy from './Entropy.jsx';

export default class Record extends React.Component {  // TODO
	constructor(props) {
        super(props);
        
        this.state = {
            message: ''
        };
        
		this.clickStart = this.clickStart.bind(this);
		this.clickPublish = this.clickPublish.bind(this);
		this.clickDelete = this.clickDelete.bind(this);
	}

	componentDidMount() {
    }
    
    clickStart(event) {
        event.preventDefault();
        
		chrome.runtime.sendMessage({ kind: 'startExpedition' });
		this.props.setParentState({expedition: {events: []}});
	}

	clickPublish(event) {
		event.preventDefault();

        chrome.runtime.sendMessage(
            {kind: 'publishExpedition', campaignId: this.props.campaignId},
            response => this.setState({message: response.message})
        );
        this.props.setParentState({expedition: {events: null}});
    }
    
    clickDelete(event) {
        event.preventDefault();

        chrome.runtime.sendMessage({kind: 'deleteExpedition'});
        this.props.setParentState({expedition: {events: null}});
    }

	render() {
        let buttonToolbar = this.props.expedition.events?(  // True if the array is defined (even if empty)
            <ButtonToolbar>
                <Button bsStyle="primary" onClick={this.clickPublish}>Publish</Button>
                <Button bsStyle="danger" onClick={this.clickDelete}>Delete</Button>
            </ButtonToolbar>
        ):(
            <ButtonToolbar>
                <Button bsStyle="primary" onClick={this.clickStart}>Record</Button>
            </ButtonToolbar>
        );
        return (
            <div>
                <p>Campaign ID : {this.props.campaignId}</p>
                <Entropy
                    campaignId={this.props.campaignId}
                />
                {buttonToolbar}
            </div>
        );
    }
}
