import React from 'react';
import { Row, Col, Form, FormGroup, FormControl, ControlLabel, Button, Panel } from 'react-bootstrap';
import {getCampaign} from './scenarioService.js';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

const REFRESH_TEMPO = 500;

export default class Campaign extends React.Component {

	constructor(props) {
		super(props);
		let match = props.match;

		this.state = {
		  campaignId : match.params.id,
		  campaign : undefined,
		  userId : undefined,
		  loaded : false
		};
		this.setUserId = this.setUserId.bind(this);
	}

	updateCampaign() {
		if (this.state.campaignId) {
			getCampaign(this.state.campaignId)
				.then(campaign => {
					let start = this.campaignChart.data.length;

					for (let index = start; index < campaign.crossentropy.length; index++) {
						let entropy = {
							value:campaign.crossentropy[index].value,
							date: new Date(campaign.crossentropy[index].date),
							pointColor: am4core.color(campaign.crossentropy[index].userColor)
						};
						//console.log(`${JSON.stringify(entropy)}`);
						this.campaignChart.addData(entropy);
						if (campaign.crossentropy[index].userId === this.userId) {
							this.userChart.addData(entropy);
						}
					}
					if (!this.state.loaded) {
						this.setState({
							campaign: campaign,
							loaded: true
						});
					}
					
				})
				.catch((err) => {
					this.setState({
						campaign: undefined,
						error: err,
						loaded: true
					});
				});
		}
	}

	setUserId(event) {
		event.preventDefault();
		console.log(document.getElementById('userId').value);
		this.userId = document.getElementById('userId').value;
	}

	componentWillMount() {
	}

	componentDidMount() {
		let interval = setInterval(() => this.updateCampaign(), REFRESH_TEMPO);
		this.interval = interval;
		this.campaignChart = this.createChart("champEntropy");
		this.userChart = this.createChart("userEntropy");
	}

	componentWillUnmount() {
		if (this.campaignChart) {
		  this.campaignChart.dispose();
		}
		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	createChart(elementId) {
		let chart = am4core.create(elementId, am4charts.XYChart);
		chart.data = [];
		let dateXAxis = chart.xAxes.push(new am4charts.DateAxis());
		dateXAxis.renderer.grid.template.location = 0;
		dateXAxis.renderer.minGridDistance = 30;
		dateXAxis.dateFormats.setKey("second", "ss");
		dateXAxis.periodChangeDateFormats.setKey("second", "[bold]h:mm a");
		dateXAxis.periodChangeDateFormats.setKey("minute", "[bold]h:mm a");
		dateXAxis.periodChangeDateFormats.setKey("hour", "[bold]h:mm a");
		dateXAxis.renderer.inside = true;
		dateXAxis.renderer.axisFills.template.disabled = true;
		dateXAxis.renderer.ticks.template.disabled = true;
		dateXAxis.title.text ="date";
		dateXAxis.interpolationDuration = 500;
		dateXAxis.rangeChangeDuration = 500;

		let valueYAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueYAxis.strictMinMax = true;
		valueYAxis.min = 0;
		valueYAxis.max = 20;
		valueYAxis.title.text ="cross entropy";

		chart.scrollbarX = new am4core.Scrollbar();

		let series = chart.series.push(new am4charts.LineSeries());
		series.dataFields.dateX = "date";
		series.dataFields.valueY = "value";
		series.interpolationDuration = 500;
		series.defaultState.transitionDuration = 0;
		series.tensionX = 1;
		series.tooltipText = "{value}";
		series.minBulletDistance = 15;

		let bullet = series.bullets.push(new am4charts.Bullet());
		bullet.events.on("hit", (ev) => {
			console.log(ev.target);
			console.log(`value : ${ev.target.dataItem.dataContext.value}`);
		});
		let square = bullet.createChild(am4core.Rectangle);
		square.width = 10;
		square.height = 10;
		square.horizontalCenter = "middle";
		square.verticalCenter = "middle";
		square.propertyFields.stroke = "pointColor";
		square.propertyFields.fill = "pointColor";
		square.strokeWidth = 1;

		return chart;
	}

	
	render() {
		let welcomeMsg;
		if (this.state.campaignId) {
			if (this.state.campaign) {
				welcomeMsg = (
					<div>
						<h1>Campaign</h1>
						<Row>
							<Col className='text-right' xs={3} md={2}>
								Campaign Id:
							</Col>
							<Col className='text-left' xs={15} md={10}>
								{this.state.campaign.campaignId}
							</Col>
						</Row>
						<Row>
							<Col className='text-right' xs={3} md={2}>
								created at:
							</Col>
							<Col className='text-left' xs={15} md={10}>
								{new Date(this.state.campaign.createdAt).toTimeString()}
							</Col>
						</Row>
						<Row>
							<Col className='text-right' xs={3} md={2}>
								last Update:
							</Col>
							<Col className='text-left' xs={15} md={10}>
								{new Date(this.state.campaign.lastUpdate).toTimeString()}
							</Col>
						</Row>
						<Row>
							<Col className='text-right' xs={3} md={2}>
								depth:
							</Col>
							<Col className='text-left' xs={15} md={10}>
								{this.state.campaign.depth}
							</Col>
						</Row>
						<Row>
							<Col className='text-right' xs={3} md={2}>
								probability of unknown:
							</Col>
							<Col className='text-left' xs={15} md={10}>
								{this.state.campaign.probaOfUnknown}
							</Col>
						</Row>
					</div>
				);
			} else {
				welcomeMsg = (<div>No campaign for this id</div>);
			}
		} else {
			welcomeMsg = (<div>Use our plugin to create a campaign</div>);
		}

		let userPanel = (
			<Panel>
  				<Panel.Heading>
      			<Panel.Title componentClass="h3">User Entropy</Panel.Title>
    			</Panel.Heading>
    			<Panel.Body>
					<Form horizontal onSubmit={this.setUserId} >
						<FormGroup>
							<Col componentClass={ControlLabel} md={2} lg={2}>
								UserId
							</Col>
							<Col md={8} lg={8}>
								<FormControl id="userId" type="text" placeholder="0228f330-8b64-4858-a325-7f3e23e900be"/>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col md={12} lg={12}>
								<Button type="submit">Set User Id</Button>
							</Col>
						</FormGroup>
					</Form>
					<div id="userEntropy" style={{ width: "100%", height: "500px", visibility:"visible"}}></div>
				</Panel.Body>
  			</Panel>
		);

		let campaignPanel = (
			<Panel>
  				<Panel.Heading>
      			<Panel.Title componentClass="h3">Campaign Entropy</Panel.Title>
    			</Panel.Heading>
    			<Panel.Body>
					<div id="champEntropy" style={{ width: "100%", height: "500px" }}></div>
				</Panel.Body>
			</Panel>
		);

		return (
			<div>
				{welcomeMsg}
				{userPanel}
				{campaignPanel}
			</div>
		);
	}

}
