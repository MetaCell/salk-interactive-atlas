import React, { SyntheticEvent } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import {
    canvasBg, populationTitleColor, populationSubTitleColor,
    headerBorderColor, secondaryColor, sidebarTextColor, deleteBtnTextColor, deleteBtnBgColor
} from "../../theme";
import { Typography, Box, IconButton, Button, Tabs, Tab, Menu, MenuItem, Tooltip, TextField, Divider, ListItemIcon } from "@material-ui/core";
import { Pagination } from '@material-ui/lab';

//icons
import INFO_ICON from "../../assets/images/icons/info.svg";
import DOWN_ICON from "../../assets/images/icons/chevron_down.svg";
import CHECK from "../../assets/images/icons/check.svg";
import pageImg from "../../assets/images/pdf.png";

const useStyles = makeStyles({
    container: {
        background: canvasBg,
        height: "100%",
        '& .MuiButton-root': {
            padding: '0.5rem 0.75rem',
        }
    },
    titleBox: {
        padding: '0.75rem'
    },
    title: {
        fontSize: '0.75rem',
        fontWeight: 600,
        lineHeight: '1rem',
        color: populationTitleColor
    },
    tabPanelActions: {
        padding: '0.75rem 0.75rem 0 0.25rem'
    },
    tabPanelActionsMenuBtn: {
        '&:hover': {
            background: 'transparent'
        }
    },
    ellipsisText: {
        display: 'block',
        width: '21.875rem',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textAlign: 'left'
    },
    img: {
        maxHeight: "600px",
        objectFit: "contain"
    },
    tabs: {
        padding: '0.875rem 1rem',
        height: 'auto',
        borderTop: `1px solid ${headerBorderColor}`,
        borderBottom: `1px solid ${headerBorderColor}`,
        '& .MuiTab-root': {
            minHeight: 'auto',
            color: populationSubTitleColor,
            '&.Mui-selected': {
                color: secondaryColor
            }
        }
    },
    deleteBtn: {
        backgroundColor: deleteBtnBgColor,
        color: deleteBtnTextColor,
        boxShadow: 'none',
        '&:hover': {
            background: deleteBtnBgColor,
            boxShadow: 'none'
        }
    },
    customMenu: {
        '& .MuiPaper-root': {
            maxWidth: '31.25rem',
            padding: '0.5rem 0'
        },
        '& .menuItemBox': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.5rem 1rem'
        },
        '& .MuiMenuItem-root': {
            padding: 0,
            color: populationTitleColor,
            '&:hover': {
                background: 'transparent'
            },
            '&.Mui-selected': {
                backgroundColor: 'transparent'
            }
        },
        '& .MuiListItemIcon-root': {
            minWidth: 'auto'
        },
        '& .MuiDivider-root': {
            backgroundColor: headerBorderColor,
            marginTop: '0.5rem',
            marginBottom: '0.5rem'
        }
    },
    searchField: {
        '& .MuiInputBase-root': {
            fontSize: '0.75rem',
            fontWeight: 500,
            color: sidebarTextColor
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
            fontWeight: 400
        },
        '&.MuiIconButton-root': {
            padding: '0.5rem',
            borderRadius: '0.375rem',
            marginRight: '0.5rem'
        }
    },
    textBlock: {
        display: 'flex',
        flexDirection: 'column',
        fontSize: '0.75rem',
        fontWeight: 400,
        gap: '0.25rem'
    },
    pagination: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '& .MuiTypography-root': {
            fontSize: '0.75rem',
            fontWeight: 600,
            lineHeight: '1rem',
            color: populationSubTitleColor
        },
        '& .MuiPagination-ul li:not(:first-child, :last-child)': {
            display: 'none'
        },
        padding: '0.75rem 1.5rem 1rem 1.5rem'
    }
});

const DetailsViewerFake = (props: {
    populationName: string | null
}) => {
    const { populationName } = props

    const classes = useStyles();
    const [tabIdx, setTabIdx] = React.useState(0);
    const [anchorElMenu, setAnchorElMenu] = React.useState<null | HTMLElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    let [page, setPage] = React.useState(1);

    const handleTabChange = (event: React.SyntheticEvent, newTabIdx: number) => {
        setTabIdx(newTabIdx);
    };

    const openMenu = Boolean(anchorElMenu);
    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElMenu(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorElMenu(null);
    };
    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLElement>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setAnchorElMenu(null);
    };

    const handlePageChange = (event: any, page: number) => {
        setPage(page)
    }

    return populationName !== null ? (
        <div className={classes.container}>
            <Box display="flex" justifyContent="space-between" alignItems="center" className={classes.titleBox}>
                <Box display="flex" alignItems="center">
                    <IconButton>
                    </IconButton>
                    <Typography className={classes.title}>{populationName}</Typography>
                </Box>
                <Button variant='outlined'>Upload PDF</Button>
            </Box>
            <Box sx={{ bgcolor: 'transparent' }}>
                <Tabs value={tabIdx} onChange={handleTabChange} className={classes.tabs}>
                    {
                        data.map((option, index) => (
                            <Tab key={index} disableRipple label={option.tab} />
                        ))
                    }
                </Tabs>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" className={classes.tabPanelActions}>
                <Button
                    id="detailsViewer-customized-button"
                    className={classes.tabPanelActionsMenuBtn}
                    aria-controls={openMenu ? 'detailsViewer-customized-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? 'true' : undefined}
                    variant="text"
                    disableElevation
                    onClick={handleMenuClick}
                    endIcon={<img src={DOWN_ICON} alt='' />}
                >
                    <span className={classes.ellipsisText}>{data[tabIdx].files[selectedIndex].title}</span>
                </Button>
                <Menu
                    id="detailsViewer-customized-menu"
                    MenuListProps={{
                        'aria-labelledby': 'demo-customized-button',
                    }}
                    className={classes.customMenu}
                    anchorEl={anchorElMenu}
                    open={openMenu}
                    onClose={handleMenuClose}
                >
                    <TextField
                        placeholder='Search for a file'
                        className={classes.searchField}
                    />
                    <Divider />
                    {
                        data[tabIdx].files.map((file: any, index) => (
                            <div className='menuItemBox' key={index}>
                                <MenuItem
                                    disableGutters
                                    selected={index === selectedIndex}
                                    onClick={(event) => handleMenuItemClick(event, index)}
                                >
                                    {file.title}
                                </MenuItem>
                                {
                                    selectedIndex === index && <ListItemIcon>
                                        <img src={CHECK} alt='' />
                                    </ListItemIcon>
                                }
                            </div>
                        ))
                    }
                </Menu>
                <Box>
                    <Tooltip
                        arrow
                        title={<div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
                            <div className={classes.textBlock} style={{ color: sidebarTextColor }}>
                                <span>Uploaded on</span>
                                <span>Uploaded by</span>
                            </div>
                            <div className={classes.textBlock} style={{ alignItems: 'flex-end' }}>
                                <span>06 Nov 2023, 11.58am</span>
                                <span>Quinn Silverman</span>
                            </div>
                        </div>}
                        placement='bottom-start'
                        className={classes.customTooltip}
                    >
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
        </div>
    ) : (
        <div className={classes.container}>
            <p className={classes.title}>Select a population to start viewing details</p>
        </div>)
};

export default DetailsViewerFake

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