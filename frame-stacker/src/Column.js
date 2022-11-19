import React from 'react';
import { useDrop } from 'react-dnd'
import { ItemTypes } from './Constants';

class Column extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="column1">
                {this.props.renderBlocks ? this.props.renderBlocks() : <div><p>Yeeet</p></div>}
            </div>
        )
    }

}


export default Column;
