import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import {
    canvasBg, populationTitleColor, populationSubTitleColor,
    headerBorderColor, secondaryColor, sidebarTextColor, deleteBtnTextColor, deleteBtnBgColor, switchActiveColor
} from "../../../theme";
import {
    Typography, Box, IconButton, Button, Tabs, Tab, Menu, MenuItem,
    Tooltip, TextField, Divider, ListItemIcon
} from "@material-ui/core";
import { Pagination } from '@material-ui/lab';
import { DropzoneArea } from "material-ui-dropzone";
import DeleteDialog from '../../common/ExperimentDialogs/DeleteModal';
import Modal from '../../common/BaseDialog';
import { PdfFileDrop } from '../../common/PdfFileDrop';
import { CategorySelect } from './CategorySelect';
import { getRGBAFromHexAlpha, getRGBAString } from '../../../utilities/functions';

// icons
import INFO_ICON from "../../../assets/images/icons/info.svg";
import DOWN_ICON from "../../../assets/images/icons/chevron_down.svg";
import CHECK from "../../../assets/images/icons/check.svg";
import pageImg from "../../../assets/images/pdf.png";
import { UploadIcon, common } from '../../header/ExperimentDialog/Common';

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
    populationColor: {
        display: 'flex',
        alignItems: 'center',
        lineHeight: '0.938rem',
        fontWeight: 400,
        fontSize: '0.75rem',
        paddingRight: '0.5rem',
    },

    square: {
        width: '0.75rem',
        height: '0.75rem',
        borderRadius: '0.1rem',
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

const DetailsViewer = (props: {
    populationName: string | null,
    populationColor: "#44C9C9"
}) => {
    const { populationName, populationColor } = props

    const classes = useStyles();
    const commonClasses = common();
    const [tabIdx, setTabIdx] = React.useState(0);
    const [anchorElMenu, setAnchorElMenu] = React.useState<null | HTMLElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [category, setCategory] = React.useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openUploadDialog, setOpenUploadDialog] = React.useState(false);
    const [initialPdf, setInitiaPdf] = React.useState(null);
    const [file, setFile] = React.useState(null);
    const [files, setFiles] = React.useState([]);
    const [page, setPage] = React.useState(1);

    const handleTabChange = (event: React.SyntheticEvent, newTabIdx: number) => {
        setTabIdx(newTabIdx);
    };

    const getRGBAColor = () => {
        return getRGBAFromHexAlpha(populationColor, 0)
    }

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

    const handleFileUpload = (files: any) => {
        if (files.length > 0) {
            setInitiaPdf(files[0])
        }
    };

    const handleFileChange = (event: any) => {
        setFile(event.target.files[0]);
    }

    const handleCategoryChange = (e: any) => {
        setCategory(e.target.value)
    };

    const handlePageChange = (event: any, value: number) => {
        setPage(value)
    };

    React.useEffect(() => {
        setFiles([...files, initialPdf]);
    }, [initialPdf])

    React.useEffect(() => {
        setFiles([...files, file]);
    },[file])

    console.log("files: ", files);

    return populationName !== null ? (
        <div className={classes.container} style={{ justifyContent: "space-between" }}>
            <div>
                <Box display="flex" justifyContent="space-between" alignItems="center" className={classes.titleBox}>
                    <Box display="flex" alignItems="center">
                        <span className={classes.populationColor}>
                            <Box style={{ backgroundColor: getRGBAString(getRGBAColor()) }}
                                component="span"
                                className={classes.square} />
                        </span>
                        <Typography className={classes.title}>{populationName}</Typography>
                    </Box>
                    <Button variant="outlined" onClick={() => setOpenUploadDialog(true)}>Upload PDF</Button>
                </Box>
                <Box sx={{ bgcolor: 'transparent' }}>
                    <Tabs value={tabIdx} onChange={handleTabChange} className={classes.tabs}>
                        {
                            data.map((option, index) => (
                                <Tab key={index} disableRipple={true} label={option.tab} />
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
                        disableElevation={true}
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
                                        disableGutters={true}
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
                            arrow={true}
                            title={<div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
                                <div className={classes.textBlock} style={{ color: sidebarTextColor }}>
                                    <span>Uploaded on</span>
                                    <span>Uploaded by</span>
                                </div>
                                <div className={classes.textBlock} style={{ alignItems: 'flex-end' }}>
                                    <span>{data[tabIdx].files[selectedIndex].createdAt}</span>
                                    <span>{data[tabIdx].files[selectedIndex].createdBy}</span>
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
                    Page {page} of {data[tabIdx].files[selectedIndex].pages.length}
                </Typography>
                <Pagination
                    count={data[tabIdx].files[selectedIndex].pages.length}
                    size="large"
                    page={page}
                    variant="outlined"
                    shape="rounded"
                    onChange={handlePageChange}
                />
            </Box>
            <Modal
                open={openUploadDialog}
                dialogActions={true}
                actionText="Upload"
                disableGutter={true}
                handleClose={() => setOpenUploadDialog(false)}
                handleAction={() => { console.log("Uploaded") }}
                title={`Upload PDF to Population ${populationName}`}
            >
                <Box display="flex" alignItems="center" justifyContent="center" p={2}>
                    <PdfFileDrop
                        file={initialPdf}
                        setFile={setInitiaPdf}
                    >
                        <Typography className={commonClasses.fileLabel}>PDF</Typography>
                        <DropzoneArea
                            dropzoneText="Select your PDF or drop it here"
                            Icon={UploadIcon}
                            showPreviews={false}
                            showPreviewsInDropzone={false}
                            onChange={(files: any) => handleFileUpload(files)}
                            filesLimit={1}
                            showAlerts={['error']}
                            classes={{ icon: "MuiButton-outlined primary" }}
                        />
                    </PdfFileDrop>
                </Box>
                <CategorySelect category={category} handleCategoryChange={handleCategoryChange} />
                {
                    files.map((file, index) => {
                        if (file) {
                            return <Box key={index} className={classes.addAnotherFileBox}>
                                <PdfFileDrop
                                    file={files[index+1]}
                                    setFile={()=>{}}
                                >
                                    <Button component="label"><input
                                        type="file"
                                        accept=".pdf"
                                        hidden={true}
                                        onChange={handleFileChange}
                                    />
                                        + Add another file
                                    </Button>

                                </PdfFileDrop>
                            </Box>
                        }
                    })
                }

            </Modal>
            <DeleteDialog
                open={openDeleteDialog}
                handleClose={() => setOpenDeleteDialog(false)}
                actionText="Delete"
                title="Delete this file?"
                dialogActions={true}
                handleAction={() => { console.log("Deleted") }}
            >
                <Box className={classes.deleteModalBox}>
                    <Typography>This action cannot be undone. Are you sure you want to delete "{data[tabIdx].files[selectedIndex].title}"?</Typography>
                </Box>
            </DeleteDialog>
        </div>
    ) : (
        <div className={classes.container} style={{ alignItems: 'center', justifyContent: 'center' }}>
            <p className={classes.noContentTitle}>Select a population to start viewing details</p>
        </div>)
};

export default DetailsViewer

const data = [
    {
        tab: 'Electrophysiology',
        files: [
            {
                title: 'Electrophysiology A1',
                createdAt: '06 Nov 2023, 11.58am',
                createdBy: 'Quinn Silverman',
                pages: [
                    "A11", "A12", "A13"
                ]
            },
            {
                title: 'Electrophysiology A2',
                createdAt: '06 Nov 2023, 11.58am',
                createdBy: 'Quinn Silverman',
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
                createdAt: '06 Nov 2023, 12.00am',
                createdBy: 'Quinn Silver',
                pages: [
                    "B11", "B12", "B13"
                ]
            },
            {
                title: 'Behaviour B2',
                createdAt: '06 Nov 2023, 12.00am',
                createdBy: 'Quinn Silver',
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
                createdAt: '06 Nov 2023, 12.58am',
                createdBy: 'Quinn Silverman',
                pages: [
                    "C11", "C12", "C13"
                ]
            },
            {
                title: 'I/O Mapping C2',
                createdAt: '06 Nov 2023, 12.58am',
                createdBy: 'Quinn Silverman',
                pages: [
                    "C21", "C22"
                ]
            }
        ]
    }
]