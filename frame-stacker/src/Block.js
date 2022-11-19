// import logo from './logo.svg';

import React from 'react';
import { useDrag } from 'react-dnd'
import { ItemTypes } from './Constants';


const Block = (props) => {
    
    const [{ opacity }, dragRef] = useDrag(
        () => ({
            type: ItemTypes.BLOCK,
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        })
    )
    return (
        <div 
            ref={dragRef}
            className="block block-padding" 
            style={{
                width: `${props.length}px`, 
                backgroundColor: `rgb(${props.height}, ${props.height}, ${props.height})`,
            }}
        >
            {props.draggableId}
        </div>
    )
}

export default Block;
