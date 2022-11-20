import React from 'react';

class Block extends React.Component {
    // eslint-disable-next-line
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div 
                className="block block-padding" 
                style={{ 
                    backgroundColor: `rgb(${this.props.height}, ${this.props.height}, ${this.props.height})`,
                }}
            >
                {this.props.draggableId}
            </div>
        )
    }
}


export default Block;
