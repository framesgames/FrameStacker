// import logo from './logo.svg';
import './App.css';
import Block from './Block'
import React from 'react';
import * as Papa from 'papaparse';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
    this.dragEnd = this.dragEnd.bind(this);
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
        <Block key={block.id} draggableId={block.id} index={id} />
      )
    });
  }

  dragEnd() {
    console.log('drag end!!!')
  }
  
  render() {
    return (
      <div>
        <h1>Frame Stacker</h1>
        <div className="flex-container">
          <DragDropContext onDragEnd={this.dragEnd}>
            <Droppable droppableId="unplaced-blocks">
              {(provided) => (
                <div  {...provided.droppableProps} ref={provided.innerRef} className="column1">
                  { this.renderBlocks() }
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div className="padding">
          <div>
            {/* upload button */}
            <input id="frames" className="ui-button ui-widget ui-corner-all" type="file" name="frames" accept="test/csv" onChange={this.readFiles} multiple />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

