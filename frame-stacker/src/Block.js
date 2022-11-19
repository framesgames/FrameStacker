import React from 'react';

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
