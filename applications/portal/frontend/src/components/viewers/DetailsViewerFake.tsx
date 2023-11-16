import React, { SyntheticEvent } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import {
    canvasBg, populationTitleColor, populationSubTitleColor,
    headerBorderColor, secondaryColor, sidebarTextColor, deleteBtnTextColor, deleteBtnBgColor, switchActiveColor
} from "../../theme";
import {
    Typography, Box, IconButton, Button, Tabs, Tab, Menu, MenuItem,
    Tooltip, TextField, Divider, ListItemIcon, Select, OutlinedInput, FormControl
} from "@material-ui/core";
import { Pagination, usePagination } from '@material-ui/lab';
import DeleteDialog from '../common/ExperimentDialogs/DeleteModal';
import Modal from '../common/BaseDialog';
import { PdfFileDrop } from '../common/PdfFileDrop';
import { AddPdfFileDrop } from '../common/AddPdfFileDrop';

//icons
import INFO_ICON from "../../assets/images/icons/info.svg";
import DOWN_ICON from "../../assets/images/icons/chevron_down.svg";
import CHECK from "../../assets/images/icons/check.svg";
import pageImg from "../../assets/images/pdf.png";
import { KeyboardArrowDown } from '@material-ui/icons';
import { ArrowBack, ArrowForward } from '@material-ui/icons';

const PDF_FILE = "pdfFile"

const useStyles = makeStyles({
    container: {
        background: canvasBg,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
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
    noContentTitle: {
        margin: 0,
        fontSize: '0.875rem',
        color: populationTitleColor,
        fontWeight: 500
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
        maxHeight: '600px',
        objectFit: 'contain'
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
    categoryBox: {
        '& label': {
            fontWeight: 600,
            fontSize: '0.75rem',
            lineHeight: '1rem',
            letterSpacing: '0.005em',
            color: populationTitleColor,
            width: '8rem',
            flexShrink: 0
        },
    },
    categorySelect: {
        '& .MuiSelect-selectMenu': {
            color: populationSubTitleColor
        }
    },
    addAnotherFileBox: {
        padding: '1rem',
        borderTop: `1px solid ${headerBorderColor}`,
        '& .MuiButton-root': {
            color: switchActiveColor,
            fontWeight: 500,
            fontSize: '0.75rem',
            padding: 0,
            '&:hover': {
                backgroundColor: 'transparent'
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
    deleteModalBox: {
        '& .MuiTypography-root': {
            fontSize: '0.75rem',
            color: populationTitleColor
        }
    },
    customMenu: {
        '& .MuiPaper-root': {
            maxWidth: '31.25rem',
            padding: '0.5rem 0'
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
        '& .MuiDivider-root': {
            backgroundColor: headerBorderColor,
            marginTop: '0.5rem',
            marginBottom: '0.5rem'
        }
    },
    menuItemBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 1rem',
        '& .MuiMenuItem-root': {
            padding: 0,
            '&:hover': {
                backgroundColor: 'transparent'
            },
            '&.Mui-selected': { backgroundColor: 'transparent' }
        },
        '& .MuiListItemIcon-root': {
            minWidth: 'auto'
        },
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
            borderBottom: 'none'
        },
        '& .MuiInput-underline:after': {
            borderBottom: 'none'
        },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottom: 'none'
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
    ul: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex'
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
    const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(null);
    const [category, setCategory] = React.useState(undefined);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openUploadDialog, setOpenUploadDialog] = React.useState(false);
    const [validationErrors, setValidationErrors] = React.useState(new Set([]));
    const { items } = usePagination({
        count: 10,
    });
    let [page, setPage] = React.useState(1);
    // const [files, setFiles] = React.useState<any>({
    //     [PDF_FILE]: [null],
    // });
    const [files, setFiles] = React.useState([])

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
    const handleCategoryClick = (
        event: React.MouseEvent<HTMLElement>,
        index: number,
    ) => {
        setSelectedCategoryIndex(index)
    }

    const handleCategoryChange = (e: any) => {
        const {
            target: { value },
        } = e;
        setCategory(value)
    }

    const handleAddFile = (type: string, value: any) => {
        setFiles([...files, value])
        validationErrors.delete(type)
        setValidationErrors(validationErrors)
    }

    const handlePageChange = (event: any, page: number) => {
        setPage(page)
    }
    console.log("files: ", files)
    console.log("page: ", page)
    return populationName !== null ? (
        <div className={classes.container} style={{ justifyContent: "space-between" }}>
            <div>
                <Box display="flex" justifyContent="space-between" alignItems="center" className={classes.titleBox}>
                    <Box display="flex" alignItems="center">
                        <IconButton>
                        </IconButton>
                        <Typography className={classes.title}>{populationName}</Typography>
                    </Box>
                    <Button variant="outlined" onClick={() => setOpenUploadDialog(true)}>Upload PDF</Button>
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
                            placeholder="Search for a file"
                            className={classes.searchField}
                        />
                        <Divider />
                        {
                            data[tabIdx].files.map((file: any, index) => (
                                <div className={classes.menuItemBox} key={index}>
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
                            placement="bottom-end"
                            className={classes.customTooltip}
                        >
                            <IconButton>
                                <img src={INFO_ICON} alt="" />
                            </IconButton>
                        </Tooltip>
                        <Button variant="contained" className={classes.deleteBtn} onClick={() => setOpenDeleteDialog(true)}>Delete file</Button>
                    </Box>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="center" py={4}>
                    <img src={pageImg} alt='' style={{ maxWidth: 500, maxHeight: 400 }} />
                </Box>
            </div>
            <Box className={classes.pagination}>
                <Typography>
                    Page {page} of 10
                </Typography>
                <ul className={classes.ul}>
                    {items.map(({ page, type, selected, ...item }, index) => {
                        let children = null;

                        if (type === "previous" || type === "next") {
                            children = (
                                <Button
                                    variant="outlined"
                                    style={{ marginRight: type === "previous" ? "0.5rem" : 0 }}
                                    {...item}
                                >
                                    {type === "previous" ? "Previous" : "Next"}
                                </Button>
                            );
                        }
                        return <li key={index} onClick={(e) => handlePageChange(e, page)}>{children}</li>;
                    })}
                </ul>
            </Box>
            <Modal
                open={openUploadDialog}
                dialogActions={true}
                actionText="Upload"
                disableGutter={true}
                handleClose={() => setOpenUploadDialog(false)}
                handleAction={() => { }}
                title={`Upload PDF to Population ${populationName}`}
            >
                <Box display="flex" alignItems="center" justifyContent="center" p={2}>
                    <PdfFileDrop
                        file={files[0]}
                        setFile={(value: any) => handleAddFile(PDF_FILE, value)}
                        hasErrors={validationErrors.has(PDF_FILE)}
                    />
                </Box>
                <Box display="flex" alignItems="center" justifyContent="space-between" p={2} className={classes.categoryBox}>
                    <Typography component="label">Category</Typography>
                    <FormControl fullWidth>
                        <Select
                            variant="outlined"
                            input={<OutlinedInput />}
                            displayEmpty
                            value={category}
                            onChange={handleCategoryChange}
                            className={classes.categorySelect}
                            renderValue={(selected) => {
                                if (!selected) {
                                    return <p>Select a category</p>;
                                }
                                return selected;
                            }}
                            IconComponent={() => <img src={DOWN_ICON} alt='' style={{ marginRight: '0.75rem' }} />}
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                            {
                                options.map((option: string, index) => (
                                    <div className={classes.menuItemBox} key={index}>
                                        <MenuItem
                                            value={option}
                                            disableGutters
                                            selected={index === selectedCategoryIndex}
                                            onClick={(event) => handleCategoryClick(event, index)}
                                        >
                                            {option}
                                        </MenuItem>
                                        {
                                            selectedCategoryIndex === index && <ListItemIcon>
                                                <img src={CHECK} alt='' />
                                            </ListItemIcon>
                                        }
                                    </div>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>
                {
                    files[0] !== undefined && <Box className={classes.addAnotherFileBox}>
                        <AddPdfFileDrop
                            file={files[1]}
                            setFile={(value: any) => handleAddFile(PDF_FILE, value)}
                            hasErrors={validationErrors.has(PDF_FILE)}
                        />
                    </Box>
                }
            </Modal>
            <DeleteDialog
                open={openDeleteDialog}
                handleClose={() => setOpenDeleteDialog(false)}
                actionText="Delete"
                title="Delete this file?"
                dialogActions={true}
                handleAction={() => { }}
            >
                <Box className={classes.deleteModalBox}>
                    <Typography>This action cannot be undone. Are you sure you want to delete “Electrophysiological properties of V2a
                        interneurons in the lumbar spinal cord.pdf”?</Typography>
                </Box>
            </DeleteDialog>
        </div>
    ) : (
        <div className={classes.container} style={{ alignItems: 'center', justifyContent: 'center' }}>
            <p className={classes.noContentTitle}>Select a population to start viewing details</p>
        </div>)
};

export default DetailsViewerFake

const options = ['Electrophysiology', 'Behaviour', 'I/O Mapping']
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