import React from 'react';
import { useDrop } from 'react-dnd'
import { ItemTypes } from './Constants';

const Column = (props) => {
    const [{ collectedProps }, drop] = useDrop(
        () => ({ 
            accept: ItemTypes.BLOCK,
            drop: (item) => {
                console.log(item);
            }
        }),
    )
    
    return (
        <div className="column1" ref={drop}>
            {props.renderBlocks ? props.renderBlocks() : <div><p>Yeeet</p></div>}
        </div>
    )
}

export default Column;
