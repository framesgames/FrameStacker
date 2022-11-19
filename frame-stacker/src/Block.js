// import logo from './logo.svg';

import React from 'react';
import { useDrag } from 'react-dnd'
import { ItemTypes } from './Constants';


class Block extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div 
                className="block block-padding" 
                style={{
                    width: `${this.props.length}px`, 
                    backgroundColor: `rgb(${this.props.height}, ${this.props.height}, ${this.props.height})`,
                }}
            >
                {this.props.draggableId}
            </div>
        )
    }
}


export default Block;
