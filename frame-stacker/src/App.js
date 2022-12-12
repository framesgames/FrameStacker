import './App.css';
import Block from './Block'
import React from 'react';
import * as Papa from 'papaparse';
import _ from 'lodash';
import DropZone from './DropZone';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      unplacedBlocks: {},
      isDragging: undefined,
      horizontalScale: undefined,
      verticalScale: undefined,
    };

    this.generateBlocks = this.generateBlocks.bind(this);
    this.scaleBlocks = this.scaleBlocks.bind(this);
    this.scaleLength = this.scaleLength.bind(this);
    this.scaleHeight = this.scaleHeight.bind(this);
    this.getDataFromCSV = this.getDataFromCSV.bind(this);
    this.readFiles = this.readFiles.bind(this);
    this.renderBlocks = this.renderBlocks.bind(this);
    this.renderDragImage = this.renderDragImage.bind(this);
    this.dragStart = this.dragStart.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
    this.drag = this.drag.bind(this);
    this.keyUp = this.keyUp.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keyup', this.keyUp, false);
  }

  keyUp(e) {
    const blockId = this.state.isDragging;
    if (blockId && e.key === ' ') {
      const unplacedBlocks = _.cloneDeep(this.state.unplacedBlocks);
      unplacedBlocks[blockId].flipped = !unplacedBlocks[blockId].flipped;
      this.setState({ unplacedBlocks });
    }
  }

  /**
   * Generates Block classes that data gets stored in.
   * @param {*} data 
   * @returns 
   */
  generateBlocks(data) {
    const blocks = {};
    for (const row of data) {
      blocks[row.id] = {
        id: row.id,
        length: +row.length,
        height: +row.height,
        flipped: false,
      };
    }
    return blocks;
  }
  
  /**
   * Linearly scales blocks so that the maximum length is 50% of the draggable area and maximum height is 200.
   * @param {*} blocks 
   * @returns 
   */
  scaleBlocks(blocks) {
    const maxLength = Object.keys(blocks).reduce((acc, blockId) => {
      const length = blocks[blockId].length;
      if (acc < length) {
        acc = length;
      }
      return length;
    }, -Infinity);
    const maxHeight = Object.keys(blocks).reduce((acc, blockId) => {
      const height = blocks[blockId].height;
      if (acc < height) {
        acc = height;
      }
      return height;
    }, -Infinity);
    this.setState({
      horizontalScale: 50 / maxLength,
      verticalScale: 150 / maxHeight
    })
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
      const unplacedBlocks = this.generateBlocks(data);
      this.scaleBlocks(unplacedBlocks);
      this.setState({ unplacedBlocks });
    })
    .catch((err) => {
      console.error(err);
      alert(err);
    });
  }

  dragStart(e, blockId) {
    e.dataTransfer.setDragImage(
      document.getElementById('dragImage'), 
      e.nativeEvent.offsetX, 
      e.nativeEvent.offsetY
    );

    const unplacedBlocks = _.cloneDeep(this.state.unplacedBlocks);
    unplacedBlocks[blockId].diffX = 0; 
    unplacedBlocks[blockId].diffY = 0; 
    unplacedBlocks[blockId].tmpTranslationX = unplacedBlocks[blockId].translationX || 0; 
    unplacedBlocks[blockId].tmpTranslationY = unplacedBlocks[blockId].translationY || 0; 
    unplacedBlocks[blockId].currentX = e.clientX;
    unplacedBlocks[blockId].currentY = e.clientY;
    
    this.setState({ unplacedBlocks, isDragging: blockId });
  }


  drag(e, blockId) {
    const unplacedBlocks = _.cloneDeep(this.state.unplacedBlocks);
    
    unplacedBlocks[blockId].diffX = e.clientX - unplacedBlocks[blockId].currentX;
    unplacedBlocks[blockId].diffY = e.clientY - unplacedBlocks[blockId].currentY;
    unplacedBlocks[blockId].currentX = e.clientX;
    unplacedBlocks[blockId].currentY = e.clientY;
    unplacedBlocks[blockId].tmpTranslationX += unplacedBlocks[blockId].diffX;
    unplacedBlocks[blockId].tmpTranslationY += unplacedBlocks[blockId].diffY;

    this.setState({ unplacedBlocks });
  }
  
  dragEnd(e, blockId) {
    e.preventDefault();
    const unplacedBlocks = _.cloneDeep(this.state.unplacedBlocks);
    unplacedBlocks[blockId].translationX = unplacedBlocks[blockId].tmpTranslationX;
    unplacedBlocks[blockId].translationY = unplacedBlocks[blockId].tmpTranslationY;
    this.setState({ unplacedBlocks });
  }

  scaleLength(block) {
    if (block.flipped) {
      return block.height * this.state.horizontalScale;
    }
    return block.length * this.state.horizontalScale;
  }

  scaleHeight(block) {
    if (block.flipped) {
      return 50 + block.length * this.state.verticalScale;
    }
    return 50 + block.height * this.state.verticalScale;
  }

  renderBlocks(blocks) {
    return Object.keys(blocks).map((blockId, id) => {   
      const block = blocks[blockId];
      return (
        <div 
          id={`block${block.id}`}
          key={`block${block.id}`}
          style={{ 
            width: `${this.scaleLength(block)}%`, 
            transform: `translate(${block.translationX}px, ${block.translationY}px)`
          }}
          onDragStart={(e) => this.dragStart(e, block.id)}
          onDrag={(e) => this.drag(e, block.id)}
          onDragEnd={(e) => this.dragEnd(e, block.id)}
          draggable
        >
          <Block 
            draggableId={block.id} 
            index={id} 
            length={this.scaleLength(block)} 
            height={this.scaleHeight(block)} 
          />
        </div>
      )
    });
  }

  renderDragImage(block) {
    if (!block) {
      return (
        <canvas 
          id="dragImage" 
          style={{ 
            backgroundColor: 'gray', 
            zIndex: -1000,
            position: 'relative',
          }} 
        />
      );
    }
    const length = this.scaleLength(block);
    const height = this.scaleHeight(block);
    const colorIntensity = height < 200 ? height : 200;
    return (
      <canvas 
        id="dragImage" 
        style={{
          width: `${length}%`,
          backgroundColor: `rgb(${colorIntensity}, ${colorIntensity}, ${colorIntensity})`,
          height: '30px',
          position: 'relative',
          zIndex: -1000,
        }} 
      />
    );
  }
  
  render() {
    return (
        <div 
          className="flex-container padding" 
          onDragOver={(e) => e.preventDefault()}
        >
          <h1>Frame Stacker</h1>
            <Stack direction="vertical" className="stack" gap={3}>
              <Row id="file-input">
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>Import one or more CSV files with blocks to be stacked</Form.Label>
                  <Form.Control 
                    className="ui-button ui-widget ui-corner-all" 
                    type="file" 
                    name="frames" 
                    accept="test/csv" 
                    onChange={this.readFiles} 
                    multiple 
                  />
                </Form.Group>
              </Row>
              <Row id="frame-stacker">
                <Stack direction="horizontal" className="stack" gap={3}>
                  <div className="bg-light border column padding">
                    <p>Unplaced blocks:</p>
                    {this.renderBlocks(this.state.unplacedBlocks)}
                    {this.renderDragImage(this.state.unplacedBlocks[this.state.isDragging])}
                  </div>
                  <div className="bg-light border column padding">
                    <p>Place blocks here:</p>
                    <DropZone />
                  </div>
                </Stack>
              </Row>
            </Stack>
        </div>
    );
  }
}

export default App;

