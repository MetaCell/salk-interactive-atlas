
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core';

const styles = () => ({
    canvasContainer: {
        width: '100%',
        height: '100%',
    },
});


class CanvasExample extends Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        // @ts-ignore
        const {classes} = this.props

        return (
            <div className={classes.canvasContainer}>
                Hello World
            </div>)
    }
}

export default withStyles(styles)(CanvasExample);