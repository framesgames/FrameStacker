import React from 'react';

class DropZone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hovered: false,
        }
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
    }

    onDragEnter(e) {
        this.setState({ hovered: true });
    }
    
    onDragLeave(e) {
        this.setState({ hovered: false });
    }

    render() {
        return (
            <div 
                style={{ height: '100%' }}
                onDragEnter={this.onDragEnter}
                onDragLeave={this.onDragLeave}
                onDrop={this.onDragLeave}
            >
            </div>
        )
    }
}


export default DropZone;
