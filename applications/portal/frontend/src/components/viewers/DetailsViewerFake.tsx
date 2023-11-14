import React, { SyntheticEvent } from 'react';
import { makeStyles, styled } from "@material-ui/core/styles";
import { canvasBg } from "../../theme";
import { Typography, Box, IconButton, Button, Tabs, Tab, Menu, MenuItem, Tooltip, TextField, Divider } from "@material-ui/core";
import { Pagination, PaginationItem } from '@material-ui/lab';
import INFO_ICON from "../../assets/images/icons/info.svg";
import DOWN_ICON from "../../assets/images/icons/chevron_down.svg";

const useStyles = makeStyles({
    container: {
        background: canvasBg,
        height: "100%"
    },
    titleBox: {
        padding: '0.75rem',
        '& .MuiButton-root': {
            padding: '0.5rem 0.75rem'
        }
    },
    title: {
        fontSize: '0.75rem',
        fontWeight: 600,
        lineHeight: '1rem',
        color: 'rgba(255, 255, 255, 0.80)'
    },
    tabPanelActions: {
        padding: '0.75rem 0.75rem 0 0.25rem'
    },
    tabPanelActionMenuBtn: {
        '&:hover': {
            background: 'transparent'
        }
    },
    ellipsisText: {
        display: 'block',
        width: '350px',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
    },
    img: {
        maxHeight: "600px",
        objectFit: "contain"
    },
    tabs: {
        padding: '0.875rem 1rem',
        height: 'auto',
        '& .MuiTab-root': {
            minHeight: 'auto',
            color: 'rgba(255, 255, 255, 0.60)'
        }
    },
    deleteBtn: {
        backgroundColor: 'rgba(242, 72, 34, 0.10)',
        color: '#F24822',
        padding: '0.5rem 0.75rem',
        boxShadow: 'none',
        '&:hover': {
            background: 'rgba(242, 72, 34, 0.10)',
            boxShadow: 'none'
        }
    },
    customMenu: {
        '& .MuiPaper-root': {
            maxWidth: '500px',
            padding: '0.5rem 0'
        },
        '& .MuiMenuItem-root': {
            padding: '0.5rem 1rem',
            color: 'rgba(255, 255, 255, 0.80)',
            '&:hover': {
                background: 'transparent'
            }
        },
        '& .MuiDivider-root': {
            backgroundColor: '#3C3E40',
            marginTop: '0.5rem',
            marginBottom: '0.5rem'
        }
    },
    searchField: {
        '& .MuiInputBase-root': {
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.40)'
        },
        '& .MuiInputBase-input': {
            padding: '0.25rem 1rem'
        },
        '& .MuiInput-underline:before': {
            borderBottom: "none"
        },
        '& .MuiInput-underline:after': {
            borderBottom: "none"
        },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottom: "none"
        }
    },
    customTooltip: {
        '& .MuiTooltip-tooltip': {
            padding: '5.5px 8.25px',
            fontWeight: 400
        }
    },
    pagination: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '& .MuiTypography-root': {
            fontSize: '0.75rem',
            fontWeight: 600,
            lineHeight: '1rem',
            color: 'rgba(255, 255, 255, 0.60)'
        },
        '& .MuiPagination-ul li:not(:first-child, :last-child)': {
            display: 'none'
        },
        padding: '0.75rem 1.5rem 1rem 1.5rem'
    }
});

const data = [
    {
        tab: 'Electrophysiology',
        files: [
            {
                title: 'Electrophysiology A1',
                pages: [
                    "A11", "A12", "A13"
                ]
            },
            {
                title: 'Electrophysiology A2',
                pages: [
                    "A21", "A22"
                ]
            }
        ]
    },
    {
        tab: 'Behaviour',
        files: [
            {
                title: 'Behaviour B1',
                pages: [
                    "B11", "B12", "B13"
                ]
            },
            {
                title: 'Behaviour B2',
                pages: [
                    "B21", "B22"
                ]
            }
        ]
    },
    {
        tab: 'I/O Mapping',
        files: [
            {
                title: 'I/O Mapping C1',
                pages: [
                    "C11", "C12", "C13"
                ]
            },
            {
                title: 'I/O Mapping C2',
                pages: [
                    "C21", "C22"
                ]
            }
        ]
    }
]

const DetailsViewerFake = (props: {
    populationName: string | null
}) => {
    const { populationName } = props

    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    let [page, setPage] = React.useState(1);

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handlePageChange = (e: any, p: number) => {
        setPage(p)
    }
    console.log("props: ", props)

    return populationName !== null ? (<div className={classes.container}>
        <Box display="flex" justifyContent="space-between" alignItems="center" className={classes.titleBox}>
            <Box display="flex" alignItems="center">
                <IconButton>
                </IconButton>
                <Typography className={classes.title}>{populationName}</Typography>
            </Box>
            <Button variant='outlined'>Upload PDF</Button>
        </Box>
        <Box>
            <Box sx={{ bgcolor: 'transparent' }}>
                <Tabs value={value} onChange={handleChange} className={classes.tabs}>
                    {
                        data.map((option, index) => (
                            <Tab key={index} label={option.tab} />
                        ))
                    }
                </Tabs>
                <Box>
                    <Box display="flex" alignItems="center" justifyContent="space-between" className={classes.tabPanelActions}>
                        <Button
                            id="detailsViewer-customized-button"
                            className={classes.tabPanelActionMenuBtn}
                            aria-controls={open ? 'detailsViewer-customized-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            variant="text"
                            disableElevation
                            onClick={handleClick}
                            endIcon={<img src={DOWN_ICON} alt='' />}
                        >
                            <span className={classes.ellipsisText}>Electrophysiological properties of V2a interneurons in the lumbar spinal cord</span>
                        </Button>
                        <Menu
                            id="detailsViewer-customized-menu"
                            MenuListProps={{
                                'aria-labelledby': 'demo-customized-button',
                            }}
                            className={classes.customMenu}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            <TextField
                                placeholder='Search for a file'
                                className={classes.searchField}
                            />
                            <Divider />
                            <MenuItem disableRipple>
                                Edit
                            </MenuItem>
                            <MenuItem disableRipple>
                                Duplicate
                            </MenuItem>
                        </Menu>
                        <Box>
                            <Tooltip title="info icon" open={true} className={classes.customTooltip}>
                                <IconButton>
                                    <img src={INFO_ICON} alt="" />
                                </IconButton>
                            </Tooltip>
                            <Button variant='contained' className={classes.deleteBtn}>Delete file</Button>
                        </Box>
                    </Box>
                    <Box className={classes.pagination}>
                        <Typography>
                            Page {page} of 10
                        </Typography>
                        <Pagination
                            count={10}
                            size="large"
                            page={page}
                            variant="outlined"
                            shape="rounded"
                            onChange={handlePageChange}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>

    </div>) : (
        <div className={classes.container}>
            <p className={classes.title}>No population selected</p>
        </div>)
};

export default DetailsViewerFake