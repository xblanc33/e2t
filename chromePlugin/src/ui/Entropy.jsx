import React from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default class Entropy extends React.Component {
	constructor(props) {
        super(props);
        
        this.state = {
            data: []
        };

        setInterval(() => {
			chrome.runtime.sendMessage({
				kind: 'getEntropies',
				campaignId: this.props.campaignId,
				//limit: 20  // TODO Allow to limit results
			}, (response) => {
				chrome.extension.getBackgroundPage().console.log(`Response from Record.jsx is : ${response}`);
				this.setState({data: response.entropyValues});
			});
		}, 1500);
	}

	componentDidMount() {

    }

	render() {
        return (
            <HighchartsReact
                highcharts={Highcharts}
                options={{
                    chart: {
                        type: 'spline',
                        animation: Highcharts.svg,
                        height: 200
                    },
                    legend: {
                        enabled: false
                    },
                    credits: false,
                    title: null,
                    xAxis: {
                        type: 'datetime',
                        labels: {
                            enabled: false
                        }
                    },
                    yAxis: {
                        title: null
                    },
                    series: [{
                        data: this.state.data
                    }]
                }}
            />
        );
    }
}
