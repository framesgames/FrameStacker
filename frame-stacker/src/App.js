// import logo from './logo.svg';
import './App.css';
import Block from './Block'
import Column from './Column';
import React from 'react';
import * as Papa from 'papaparse';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend'
// import { DndProvider } from 'react-dnd'
import Draggable from 'react-draggable';


class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      blocks: [],
    }
    this.generateBlocks = this.generateBlocks.bind(this);
    this.scaleBlocks = this.scaleBlocks.bind(this);
    this.getDataFromCSV = this.getDataFromCSV.bind(this);
    this.readFiles = this.readFiles.bind(this);
    this.renderBlocks = this.renderBlocks.bind(this);
  }

  /**
   * Generates Block classes that data gets stored in.
   * @param {*} data 
   * @returns 
   */
  generateBlocks(data) {
    const blocks = [];
    for (const row of data) {
      blocks.push({
        id: row.id,
        length: +row.length,
        width: +row.width,
        height: +row.height,
        coords: {
          left: 50,
          top: 50
        }
      })
    }
    return blocks;
  }
  
  /**
   * Linearly scales blocks so that the maximum length is 50% of the draggable area and maximum height is 200.
   * @param {*} blocks 
   * @returns 
   */
  scaleBlocks(blocks) {
    const maxLength = blocks.reduce((acc, el) => {
      if (acc < el.length) {
        acc = el.length;
      }
      return acc;
    }, -Infinity);
    const maxHeight = blocks.reduce((acc, el) => {
      if (acc < el.height) {
        acc = el.height;
      }
      return acc;
    }, -Infinity);
    blocks.forEach((block) => {
      block.length = block.length * (50 / maxLength); // values can range from 0-50
      block.height = 50 + block.height * (150 / maxHeight); // values can range from 50-200
    });
    return blocks;
  }
  
  getDataFromCSV(file) {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(results.errors);
          }
          resolve(results.data.map((row) => {
            if (!row.id) {
              reject('Could not find valid "id" column');
            }
            if (!row.length) {
              reject('Could not find valid "length" column');
            }
            if (!row.height) {
              reject('Could not find valid "height" column');
            }
            return {
              id: row.id,
              length: +row.length,
              height: +row.height,
            }
          }));
        },
        header: true, 
        skipEmptyLines: true,
      })
    })
  }
  
  
  async readFiles(event) {
    const files = event.target.files;
    Promise.all(
      Array.from(files).map(file => this.getDataFromCSV(file))
    )
    .then((jaggedData) => {
      const data = jaggedData.flat();
      this.setState({
        blocks: this.scaleBlocks(this.generateBlocks(data))
      });
    })
    .catch((err) => {
      console.error(err);
      alert(err);
    });
  }

  renderBlocks() {
    return this.state.blocks.map((block, id) => {
      
      return (
        <Block 
          key={block.id} 
          draggableId={block.id} 
          index={id} 
          length={block.length} 
          height={block.height} 
        />
      )
    });
  }
  
  render() {
    return (
      // <DndProvider backend={HTML5Backend}>
        <div>
          <Draggable><div>Frame Stacker</div></Draggable>
          {/* <Column renderBlocks={this.renderBlocks} /> */}
          <div className="padding">
            <div>
              <input id="frames" className="ui-button ui-widget ui-corner-all" type="file" name="frames" accept="test/csv" onChange={this.readFiles} multiple />
            </div>
          </div>
        </div>
      // </DndProvider>
    );
  }
}

export default App;

