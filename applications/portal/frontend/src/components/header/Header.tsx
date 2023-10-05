import * as React from "react";
import { useRouteMatch } from 'react-router-dom';

import {
    Toolbar,
    Box,
    Button,
    makeStyles,
    Typography,
    Breadcrumbs,
    Link,
    Avatar, Snackbar,
} from "@material-ui/core";
import { headerBorderColor, headerButtonBorderColor, headerBg } from "../../theme";
// @ts-ignore
import LOGO from "../../assets/images/logo.svg";
// @ts-ignore
import USER from "../../assets/images/icons/user.svg";
import { UserAccountDialog } from "./UserAccountDialog";
import { CreateUpdateExperimentDialog } from "./ExperimentDialog/CreateUpdateExperimentDialog";
import { EXPERIMENTS_ROUTE, HEADER_TITLE, SNACKBAR_TIMEOUT } from "../../utilities/constants";
import { Alert } from "@material-ui/lab";
import workspaceService from "../../service/WorkspaceService";
import { Experiment } from "../../apiclient/workspaces";

interface RouteParams {
    id: string;
}

const useStyles = makeStyles((theme) => ({
    toolbar: {
        backgroundColor: headerBg,
        paddingRight: "0.5rem",
        paddingLeft: "0.875rem",
        justifyContent: "space-between",
        borderBottom: `0.0625rem solid ${headerBorderColor}`,
        height: '3rem',
        flexShrink: 0,

        '& .MuiAvatar-root': {
            width: '1.5rem',
            height: '1.5rem',
        },

        '& img': {
            display: 'block',
        },
    },
    toolbarTitle: {
        flex: 1,
    },
    toolbarSecondary: {
        justifyContent: "space-between",
        overflowX: "auto",
    },
    toolbarLink: {
        padding: theme.spacing(1),
        flexShrink: 0,
    },
    wrapIcon: {
        verticalAlign: "middle",
        display: "inline-flex",
    },
    button: {
        textTransform: "none",
        padding: "0 0.75rem",
        height: '2rem',
        fontWeight: 500,
        fontSize: '0.75rem',
        lineHeight: '1rem',
        letterSpacing: '0.01em',
        color: headerButtonBorderColor,
        borderRadius: '0.375rem',

        '&:not(:first-child)': {
            marginLeft: '0.5rem',
        },
    },

    logo: {
        minWidth: '10.9375rem',
    },

}));

interface HeaderProps {
    login: () => void;
    logout: () => void;
    onExperimentCreation: (id: string) => void;
    user: {
        username: string;
        avatarUrl: string | null;
    } | null;
}

/**
 * Header component for the application.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.login - Function to handle user login.
 * @param {Function} props.logout - Function to handle user logout.
 * @param {Function} props.onExperimentCreation - Function to handle experiment action.
 * @param {Object} props.user - The user object.
 */
export const Header = ({
    login,
    logout,
    onExperimentCreation,
    user,
}: HeaderProps) => {
    const classes = useStyles();
    const api = workspaceService.getApi();
    const match = useRouteMatch<RouteParams>(EXPERIMENTS_ROUTE);
    const experimentId = match ? match.params.id : null;

    const [modalKey, setModalKey] = React.useState(0)
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [experimentDialogOpen, setExperimentDialogOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(undefined);
    const [fetchedExperiment, setFetchedExperiment] = React.useState<Experiment>(null);
    const menuAnchorRef = React.useRef(null);


    const fetchExperiment = async () => {
        const response = await api.retrieveExperiment(experimentId)
        setFetchedExperiment(response.data)
    }

    /**
     * Toggles the experiment dialog open or closed.
     */
    const handleExperimentDialogToggle = () => {
        setExperimentDialogOpen((prevOpen) => !prevOpen);
    };


    /**
     * Toggles the user account dialog open or closed.
     */
    const handleDialogToggle = () => {
        setDialogOpen((prevOpen) => !prevOpen);
    };

    /**
     * Handles user login action.
     */
    const handleUserLogin = () => {
        login();
    };

    /**
     * Handles user logout action.
     */
    const handleUserLogout = () => {
        logout();
    };


    /**
     * Handles experiment creation effects.
     */
    const handleAction = (id: string) => {
        setModalKey(modalKey + 1)
        if (!experimentId) {
            onExperimentCreation(id)
        }
    }

    /**
     * Handle errors.
     */
    const handleErrors = (error: any) => {
        let message = error.response.data.detail;
        if (message === undefined) {
            message = "Something went wrong";
        }
        setErrorMessage(message);
    };

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setErrorMessage(undefined);
    };

    React.useEffect(() => {
        if (experimentId){
            fetchExperiment().catch(console.error);
        }
    }, [experimentId])

    const headerText =
        user === null ? (
            <Button onClick={handleUserLogin} className={classes.button}>
                Sign in
            </Button>
        ) : (
            <Box alignItems="center" display="flex">
                {!experimentId ? (
                    <>
                        <Button
                            size="large"
                            className={classes.button}
                            variant="contained"
                            disableElevation={true}
                            aria-controls={experimentDialogOpen && "user-menu"}
                            aria-haspopup="true"
                            onClick={handleExperimentDialogToggle}
                        >
                            Create a new experiment
                        </Button>

                        <Button
                            size="large"
                            ref={menuAnchorRef}
                            aria-controls={dialogOpen && "user-menu"}
                            aria-haspopup="true"
                            onClick={handleDialogToggle}
                            className={classes.button}
                            variant="outlined"
                        >
                            My account
                        </Button>

                        <Avatar alt={user.username} title={user.username} src={user.avatarUrl ? user.avatarUrl : USER} />
                    </>
                ) : (
                    <>
                        <Button
                            size="large"
                            className={classes.button}
                            variant="contained"
                            disableElevation={true}
                            aria-controls={experimentDialogOpen && "user-menu"}
                            aria-haspopup="true"
                            onClick={handleExperimentDialogToggle}
                        >
                            Add to experiment
                        </Button>

                        <Button
                            size="large"
                            className={classes.button}
                            variant="outlined"
                            disabled={true}
                        >
                            Share
                        </Button>
                    </>
                )}
            </Box>
        );

    return (
        <>
            <Toolbar className={classes.toolbar}>
                <Box display="flex" className={classes.logo}>
                    <a href="/">
                        <img
                            src={LOGO}
                            alt={HEADER_TITLE}
                            title={HEADER_TITLE}
                        />
                    </a>
                </Box>
                <Box>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" href="/">
                            My experiments
                        </Link>
                        <Typography color="textPrimary">{fetchedExperiment?.name}</Typography>
                    </Breadcrumbs>
                </Box>
                <Box>
                    {headerText}
                </Box>
            </Toolbar>

            <UserAccountDialog open={dialogOpen} handleClose={handleDialogToggle} user={user} />
            <CreateUpdateExperimentDialog
                key={modalKey}
                open={experimentDialogOpen}
                handleClose={handleExperimentDialogToggle}
                user={user}
                onExperimentAction={(id) => handleAction(id)}
                onError={(error) => handleErrors(error)}
                experimentId={experimentId}
            />
            <Snackbar open={errorMessage !== undefined} autoHideDuration={SNACKBAR_TIMEOUT} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error">
                    {errorMessage}
                </Alert>
            </Snackbar>
        </>
    );
};
