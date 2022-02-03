
import React, {useEffect, useState} from 'react';
import {useStore, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
// @ts-ignore
import {getLayoutManagerInstance} from "@metacell/geppetto-meta-client/common/layout/LayoutManager";
// @ts-ignore
import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";
// @ts-ignore
import { addWidget } from '@metacell/geppetto-meta-client/common/layout/actions';
import {Box, Button} from "@material-ui/core";


const useStyles = makeStyles({
    layoutContainer: {
        position: 'relative',
        width: '100%',
        height: '90vh',
        '&> div': {
            height: '100%',
        }
    }
});

export const CanvasWidget = {
    id: 'canvasWidget',
    name: "3D Canvas",
    component: "canvas",
    panelName: "leftPanel",
    enableClose: false,
    status: WidgetStatus.ACTIVE,
};

/**
 * The component that renders the FlexLayout component of the LayoutManager.
 */
const ExperimentsPage = () => {

    const classes = useStyles();
    const store = useStore();
    const dispatch = useDispatch();
    const [LayoutComponent, setLayoutManager] = useState(undefined);

    useEffect(() => {
        if (LayoutComponent === undefined) {
            const myManager = getLayoutManagerInstance();
            if (myManager) {
                setLayoutManager(myManager.getComponent());
            }
        }
    }, [store])

    const onAddWidgetClick = (widget: { id: string; name: string; component: string; panelName: string; enableClose: boolean; status: any; }) =>
    {
        dispatch(addWidget(widget));
    }


    return (
        <Box display="flex" >
            <Button color="secondary" onClick={() => onAddWidgetClick(CanvasWidget)}>Add Canvas</Button>
            <Box className={classes.layoutContainer}>
                <div className={classes.layoutContainer}>
                    {LayoutComponent === undefined ? <CircularProgress/> : <LayoutComponent/>}
                </div>
            </Box>
        </Box>

    );
}

export default ExperimentsPage;