import React from 'react';

class Block extends React.Component {
    // eslint-disable-next-line
    constructor(props) {
        super(props);
    }

    render() {
        const intensity = this.props.height > 200 ? 200 : this.props.height;
        return (
            <div 
                className="block block-padding" 
                style={{ 
                    backgroundColor: `rgb(${intensity}, ${intensity}, ${intensity})`,
                }}
            >
                {this.props.draggableId}
            </div>
        )
    }
}


export default Block;
