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
                style={{ 
                    height: '100%',
                    backgroundColor: this.state.hovered ? '#99ccff' : 'inherit',
                    borderColor: 'black',
                    borderTop: '1px solid', 
                }}
                onDragEnter={this.onDragEnter}
                onMouseEnter={this.onDragEnter}
                onDragLeave={this.onDragLeave}
                onDrop={this.onDragLeave}
                onMouseLeave={this.onDragLeave}
            >
            </div>
        )
    }
}


export default DropZone;
