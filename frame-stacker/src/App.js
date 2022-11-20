import './App.css';
import Block from './Block'
import React from 'react';
import * as Papa from 'papaparse';
import Draggable from 'react-draggable';


class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      blocks: [],
      isDragging: [],
    }
    this.generateBlocks = this.generateBlocks.bind(this);
    this.scaleBlocks = this.scaleBlocks.bind(this);
    this.getDataFromCSV = this.getDataFromCSV.bind(this);
    this.readFiles = this.readFiles.bind(this);
    this.renderBlocks = this.renderBlocks.bind(this);
    this.dragStart = this.dragStart.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
    this.keyDown = this.keyDown.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keypress', this.keyDown, false);
  }

  keyDown() {
    let blocks = this.state.blocks.map((block) => {
      if (this.state.isDragging.includes(block.id)) {
        const length = block.length;
        const height = block.height;
        block.length = height;
        block.height = length;
      }
      return block;
    });
    blocks = this.scaleBlocks(blocks);
    this.setState({ blocks });
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
        scaledLength: +row.length,
        scaledWidth: +row.width,
        scaledHeight: +row.height,
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
      block.scaledLength = block.length * (50 / maxLength); // values can range from 0-50
      block.scaledHeight = 50 + block.height * (150 / maxHeight); // values can range from 50-200
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

  dragStart(blockId) {
    if (!this.state.isDragging.includes(blockId)) {
      this.setState({
        isDragging: this.state.isDragging.concat(blockId),
      })
    }
  }

  dragEnd(blockId) {
    this.setState({
      isDragging: this.state.isDragging.filter(id => id !== blockId),
    })
  }

  renderBlocks() {
    return this.state.blocks.map((block, id) => {  
      return (
        // this div controls the length of the blocks, not the block itself
        <div 
          style={{ width: `${block.scaledLength}%` }}
          key={block.id}
        >
          <Draggable 
            onStart={() => this.dragStart(block.id)}
            onStop={() => this.dragEnd(block.id)}
          >
            <div>
              <Block 
                draggableId={block.id} 
                index={id} 
                length={block.scaledLength} 
                height={block.scaledHeight} 
              />
            </div>
          </Draggable>
        </div>
      )
    });
  }
  
  render() {
    return (
        <div>
          <h1>Frame Stacker</h1>
          <div className="flex-container">
            <div id="unplaced-blocks" className="column1 padding droppables">
              <p>Unplaced blocks:</p>
              {this.renderBlocks ? this.renderBlocks() : <div><p>Yeeet</p></div>}
            </div>
            <div id="placed-blocks" className="column2 padding droppables"></div>
          </div>
          <div className="padding">
            <div>
              <input id="frames" className="ui-button ui-widget ui-corner-all" type="file" name="frames" accept="test/csv" onChange={this.readFiles} multiple />
            </div>
          </div>
        </div>
    );
  }
}

export default App;

