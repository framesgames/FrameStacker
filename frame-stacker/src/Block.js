// import logo from './logo.svg';

import React from 'react';
import {Draggable} from 'react-beautiful-dnd';

class Block extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
        this.getBlockStyle = this.getBlockStyle.bind(this);
    }

    getBlockStyle(isDragging, draggableStyle) {
        return {
            width: `${this.props.length}px`, 
            backgroundColor: `rgb(${this.props.height}, ${this.props.height}, ${this.props.height})`,
            ...draggableStyle
        }
    }

    render() {
        return (
            <Draggable draggableId={this.props.draggableId} index={this.props.index}>
                {(provided, snapshot) => (
                    <div 
                        ref={provided.innerRef} 
                        {...provided.draggableProps} 
                        {...provided.dragHandleProps}
                        className="block block-padding" 
                        style={this.getBlockStyle(snapshot.isDragging, provided.draggableProps.style)}
                    >
                        {this.props.draggableId}
                    </div>
                )}
            </Draggable>
        )
    }
}

export default Block;
