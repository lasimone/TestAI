import React, { Component } from 'react';
import './data-display.css';
import data from '../data/data'
import { Carousel } from 'primereact/carousel';
import { Dropdown } from 'primereact/dropdown';
import { ResponsivePie } from '@nivo/pie'
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";

class DataDisplay extends Component {
  /**
   * Initialize the component and set the first test
   * @param {*} props 
   */
  constructor(props) {
    super(props);
    let firstCase = undefined
    
    if (data.test_cases.length > 0) {
      firstCase = data.test_cases[0]
    }

    this.state = {
			selectedTest: firstCase
		};
  }

  /**
   * The HTML element to display one step of a test case 
   * @param {*} step 
   * @returns 
   */
  stepTemplate = (step) => {
    // Iterate over the cpu data constructing an array for Pie Chart consumption
    let cpuData = []
    for (let i = 0; i < step.cpu.length; i++) {
      cpuData.push({
        id: "Run " + (i + 1),
        value: step.cpu[i]
      })
    }
    
    // Iterate over the launch data constructing an array for Bar Chart consumption
    let launchData = []
    for (let i = 0; i < step.launch_times.length; i++) {
      launchData.push({
        id: "Run " + (i + 1),
        value: step.launch_times[i]
      })
    }
    
    // Iterate over the memory data constructing an array for Line Chart consumption
    let memoryData = []
    for (let i = 0; i < step.memory.length; i++) {
      memoryData.push({
        x: "Run " + (i + 1),
        y: step.memory[i]
      })
    }

    // Add the memory data array to an object to satisfy the Line Chart component requirements
    memoryData = [
      {
        "id": "memory",
        "color": "hsl(90, 70%, 50%)",
        "data": memoryData
      }
    ]

    return (
      <div className="step-item">
        <div className="step-name">
          <div className="step-name-title">Step: </div>
          {step.step_name}
        </div>

        <div className="dashboard">
          <img className="screenshot" src={step.screenshot} alt=""/>
          <div className="graphs">
            
            <div className="graph">
              <div className="graph-label">CPU Timings (s)</div>
              <ResponsivePie height={400} data={cpuData} animate={true} margin={{top: 50, right: 80, bottom: 50, left: 80}}
              colors={{ scheme: 'pastel1' }}/>
            </div>
            
            <div className="graph">
              <div className="graph-label">App Launch Time (s)</div>
              <ResponsiveBar height={400} margin={{ top: 50, right: 60, bottom: 50, left: 60 }} data={launchData} indexBy="id" keys={["value"]}
              colors={{ scheme: 'pastel1' }}/>
            </div>
            
            <div className="graph">
              <div className="graph-label">RAM Usage</div>
              <ResponsiveLine height={400} data={memoryData} margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
              yScale={{ type: 'linear', min: 'auto', max: 'auto' }} useMesh={true} colors={{ scheme: 'pastel1' }}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  render() {
    return (
      <div className="data-display">
        <div className="app-name">
          { data["app_name"] }
        </div>
        
        {/* Check if the selected test is defined - if not tell the user there is no data */}
        {this.state.selectedTest ?
          <div className="test-selector">
            <div className="test-selector-title">Selected Test:</div>
            <Dropdown className="test-dropdown" value={this.state.selectedTest} options={data.test_cases} onChange={e => {
              this.setState({ selectedTest: e.value });
            }} optionLabel="test_name" placeholder=""/>
          
            <div className="test-selector-title">Status:</div>
            <div className="test-case-status">
              <div className={`status-block ${this.state.selectedTest.status ? "passed" : ""}`}/>
              <div className="status-text">{this.state.selectedTest.status ? 'PASSED' : 'FAILED'}</div>
            </div>

          </div>
          :
          <div class="no-data">
            No Test Data to Display
          </div>
        }
        
        {/* Display the data to the selected test */}
        { data.test_cases.filter(testCase => testCase === this.state.selectedTest).map((testCase, index) => (
          <div className="test-case" key={index}>
                        
            <Carousel value={testCase.test_steps} itemTemplate={this.stepTemplate} numVisible={1} numScroll={1}/>
         
          </div>
        ))}
      
      </div>
    );
  }
}

  export default DataDisplay;