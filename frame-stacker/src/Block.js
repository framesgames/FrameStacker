// import logo from './logo.svg';

import React from 'react';
import {Draggable} from 'react-beautiful-dnd';

class Block extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <Draggable draggableId={this.props.draggableId} index={this.props.index}>
                {(provided) => (
                    <div 
                        ref={provided.innerRef} 
                        {...provided.draggableProps} 
                        {...provided.dragHandleProps}
                        // className="block block-padding" 
                        // style={{ width: `${this.props.length}px`, backgroundColor: `rgb(${this.props.height}, ${this.props.height}, ${this.props.height})` }}
                    >
                        {this.props.draggableId}
                    </div>
                )}
            </Draggable>
        )
    }
}

export default Block;
