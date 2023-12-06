import React, { useEffect, useState } from 'react';
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
import workspaceService from "../../../service/WorkspaceService";

// icons
// @ts-ignore
import INFO_ICON from "../../../assets/images/icons/info.svg";
// @ts-ignore
import DOWN_ICON from "../../../assets/images/icons/chevron_down.svg";
// @ts-ignore
import CHECK from "../../../assets/images/icons/check.svg";
import { UploadIcon, common } from '../../header/ExperimentDialog/Common';
import PdfToPage from './PdfToPage';
import { PdfCategoryEnum, Population } from '../../../apiclient/workspaces';
import { formatDateTime, pdfNameOnFile } from '../../../utils';
import { useParams } from "react-router";

const PdfCategoryLabels = {
    [PdfCategoryEnum.Electrophysiology]: 'Electrophysiology',
    [PdfCategoryEnum.Behaviour]: 'Behaviour',
    [PdfCategoryEnum.IoMapping]: 'Input/Output'
};
const MAX_FILES = 1;

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
        padding: '0.75rem',
        minHeight: '3.5rem'
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
        width: '100%',
        position: 'absolute',
        backgroundColor: '#27292B',
        bottom: 0,
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
    populationId: number
    hasEditPermission: boolean
}) => {
    const populationId = props.populationId ? props.populationId.toString() : null
    const { hasEditPermission } = props
    const [population, setPopulation] = useState(null);
    const [pdfFiles, setPdfFiles] = useState<any[]>([]);
    const params = useParams<{ id: string }>();
    const classes = useStyles();
    const commonClasses = common();
    const [tabIdx, setTabIdx] = useState<number>(0);
    const [anchorElMenu, setAnchorElMenu] = useState<null | HTMLElement>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openUploadDialog, setOpenUploadDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [searchMenuData, setSearchMenuData] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const [numPages, setNumPages] = useState<number>();
    const [currentPage, setCurrentPage] = useState(1);

    const api = workspaceService.getApi();

    const handleTabChange = (event: React.SyntheticEvent, newTabIdx: number) => {
        setTabIdx(newTabIdx);
        setSearchQuery("");
    };

    const getRGBAColor = () => {
        const {color, opacity} = population
        return getRGBAFromHexAlpha(color, opacity)
    }

    const openMenu = Boolean(anchorElMenu);
    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElMenu(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorElMenu(null);
        setSearchMenuData(filteredData);
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLElement>,
        file: any
    ) => {
        setSelectedFile(file)
        setAnchorElMenu(null)
        setSearchQuery('')
    };

    const handleUploadPDF = async () => {
        try {
            const promises: any = []
            uploadedFiles.map((file) => {
                promises.push(
                    api.createPdf(file.selectedCategory, file.file, +params.id, +populationId)
                )
            })
            const newFiles = await Promise.all(promises)
            setPdfFiles([...pdfFiles, ...newFiles.map((file) => file.data)]);
        } catch (err) {
            console.error(err)
        }
        setOpenUploadDialog(false);
        setUploadedFiles([]);
    };

    const handleDeletePDF = async () => {
        try {
            await api.destroyPdf(selectedFile.id);
            const tempPdfFiles = pdfFiles.filter((item: any) => item.id !== selectedFile.id)
            setPdfFiles(tempPdfFiles);
        } catch (err) {
            console.error(err)
        }
        setOpenDeleteDialog(false);
    }

    const onFilterData = (query: string, filesData: any) => {
        if (!filesData) {
            return filesData
        }
        
        const categorySelected = Object.keys(PdfCategoryEnum)[tabIdx];
        const filterByCategory = filesData.filter((d: any) => d.category === categorySelected);
        if (!query) {
            return filterByCategory;
        } else {
            const Filteredfiles = filterByCategory?.filter((d: any) => d.name.toLowerCase().includes(query.toLowerCase()));
            return Filteredfiles
        }
    };

    const handleFileUpload = (files: any) => {
        const initialPdf = {
            id: 0,
            file: files[0],
            selectedCategory: ""
        }
        if (files.length > 0) {
            setUploadedFiles([initialPdf])
        }
    };

    const handleFileChange = (event: any, index: number) => {
        const newFile = {
            id: uploadedFiles[index].id + 1,
            file: event.target.files[0],
            selectedCategory: ""
        }
        setUploadedFiles([...uploadedFiles, newFile])
    };

    const handleCategoryChange = (newCategory: any, index: number) => {
        const tempUploadedFiles = [...uploadedFiles];
        tempUploadedFiles[index].selectedCategory = newCategory;
        setUploadedFiles(tempUploadedFiles);
    };

    const handleFileRemove = (index: number) => {
        const tempUploadedFiles = uploadedFiles.filter(item => item.id !== index)
        setUploadedFiles(tempUploadedFiles)
    }

    const handlePageChange = (event: any, value: number) => {
        setCurrentPage(value);
    };


    useEffect(() => {
        const categorySelected = Object.keys(PdfCategoryEnum)[tabIdx];
        const newDataFiltered = onFilterData('', pdfFiles.filter(pdf => pdf.category === categorySelected));

        setFilteredData(newDataFiltered)
        setSearchMenuData(newDataFiltered);

        // Set selectedFile to the first file in newDataFiltered
        setSelectedFile(newDataFiltered.length > 0 ? newDataFiltered[0] : null);
    }, [pdfFiles, tabIdx])


    useEffect(() => {
        const newDataFiltered = onFilterData(searchQuery, pdfFiles);
        setSearchMenuData(newDataFiltered);
    }, [searchQuery])

    useEffect(() => {
        const fetchPopulationData = async () => {
            try {
                const response = await api.retrievePopulation(populationId, +params.id);
                const populationData: Population = response.data;
                setPopulation(populationData);
                // @ts-ignore
                setPdfFiles(populationData?.pdfs || []);
            } catch (error) {
                console.error('Error fetching population data:', error);
                // Handle error appropriately
            }
        };

        if (populationId) {
            fetchPopulationData();
        }
    }, [populationId, params.id]);

    useEffect(() => {
        if (population) {
            setPdfFiles(population.pdfs || []);
        }
    }, [population])

    return (!population) ? (
        <ShowEmptyMessage message="Select a population to start viewing details" />
    ) : (
        <div className={classes.container} style={{ justifyContent: "space-between" }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" className={classes.titleBox}>
                    <Box display="flex" alignItems="center">
                        <span className={classes.populationColor}>
                            <Box style={{ backgroundColor: getRGBAString(getRGBAColor()) }}
                                component="span"
                                className={classes.square} />
                        </span>
                        <Typography className={classes.title}>{population?.name}</Typography>
                    </Box>
                    {hasEditPermission && <Button variant="outlined" onClick={() => setOpenUploadDialog(true)}>Upload PDF</Button>}
                </Box>
                <Box sx={{ bgcolor: 'transparent' }}>
                    <Tabs value={tabIdx} onChange={handleTabChange} className={classes.tabs}>
                        {Object.values(PdfCategoryEnum).map((categoryValue, index) => (
                          <Tab key={index} disableRipple={true} label={PdfCategoryLabels[categoryValue]} />
                        ))}
                    </Tabs>
                </Box>
                {
                    (filteredData.length === 0) ? (
                        <ShowEmptyMessage message="No PDFs uploaded yet" />
                    ) :
                        (filteredData && selectedFile) && (
                            <Box display="flex" alignItems="center" justifyContent="space-between"
                                className={classes.tabPanelActions}>
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
                                    <span className={classes.ellipsisText}>
                                        {pdfNameOnFile(selectedFile?.name)}
                                    </span>
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
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                        }}
                                    />
                                    <Divider />
                                    {
                                        searchMenuData.map((file: any, index) => (
                                            <div className={classes.menuItemBox} key={index}>
                                                <MenuItem
                                                    disableGutters={true}
                                                    selected={file===selectedFile}
                                                    onClick={(event) => handleMenuItemClick(event, file)}
                                                >
                                                    {pdfNameOnFile(file.name)}
                                                </MenuItem>
                                                {
                                                    selectedFile === file && <ListItemIcon>
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
                                                <span>{formatDateTime(selectedFile.created_at)}</span>
                                                <span>{selectedFile.created_by}</span>
                                            </div>
                                        </div>}
                                        placement="bottom-end"
                                        className={classes.customTooltip}
                                    >
                                        <IconButton>
                                            <img src={INFO_ICON} alt="" />
                                        </IconButton>
                                    </Tooltip>
                                    {hasEditPermission && <Button variant="contained" className={classes.deleteBtn} onClick={() => setOpenDeleteDialog(true)}>Delete file</Button>}
                                </Box>
                            </Box>
                        )
                }
                {
                    (filteredData && selectedFile) && (
                        <Box display="flex" className="scrollbar" style={{ flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>

                            <Box display="flex" alignItems="center" justifyContent="center" py={4} style={{
                                width: '100%',
                            }}>
                                <PdfToPage
                                    filepath={filteredData && selectedFile.file}
                                    setNumPages={setNumPages}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                />
                            </Box>
                            <Box className={classes.pagination}>
                                <Typography>
                                    Page {currentPage} of {numPages}
                                </Typography>
                                <Pagination
                                    count={numPages}
                                    size="large"
                                    page={currentPage}
                                    variant="outlined"
                                    shape="rounded"
                                    onChange={handlePageChange}
                                />
                            </Box>
                        </Box>

                    )
                }
            </div>
            {
                filteredData && selectedFile && (
                    <DeleteDialog
                        open={openDeleteDialog}
                        handleClose={() => setOpenDeleteDialog(false)}
                        actionText="Delete"
                        title="Delete this file?"
                        dialogActions={true}
                        handleAction={() => handleDeletePDF()}
                    >
                        <Box className={classes.deleteModalBox}>
                            <Typography>This action cannot be undone. Are you sure you want to delete
                                "{filteredData.length > 0 && selectedFile.name}"?</Typography>
                        </Box>
                    </DeleteDialog>
                )
            }
            <Modal
                open={openUploadDialog}
                dialogActions={true}
                actionText="Upload"
                disableGutter={true}
                handleClose={() => setOpenUploadDialog(false)}
                handleAction={handleUploadPDF}
                title={`Upload PDF to Population ${population?.name}`}
            >
                <Box display="flex" alignItems="center" justifyContent="center" p={2}>
                    <PdfFileDrop
                        file={uploadedFiles[0]?.file}
                        removeFile={() => handleFileRemove(0)}
                    >
                        <Typography className={commonClasses.fileLabel}>PDF</Typography>
                        <DropzoneArea
                            dropzoneText="Select your PDF or drop it here"
                            Icon={UploadIcon}
                            showPreviews={false}
                            showPreviewsInDropzone={false}
                            onChange={(files: any) => handleFileUpload(files)}
                            filesLimit={MAX_FILES}
                            acceptedFiles={['.pdf']}
                            showAlerts={['error']}
                            classes={{ icon: "MuiButton-outlined primary" }}
                        />
                    </PdfFileDrop>
                </Box>
                <CategorySelect
                    category={uploadedFiles[0]?.category}
                    handleCategoryChange={(event: any) => {
                        handleCategoryChange(event.target.value, 0)
                    }}
                />
                {
                    uploadedFiles.map((file, index) => {
                        if (file) {
                            return (
                                <Box key={index}>
                                    <Box className={classes.addAnotherFileBox}>
                                        <PdfFileDrop
                                            file={uploadedFiles[index + 1]?.file}
                                            removeFile={() => handleFileRemove(index + 1)}
                                        >
                                            <Button component="label"><input
                                                type="file"
                                                accept=".pdf"
                                                hidden={true}
                                                onChange={(e) => handleFileChange(e, index)}
                                            />
                                                + Add another file
                                            </Button>

                                        </PdfFileDrop>
                                    </Box>
                                    {uploadedFiles[index + 1]?.file &&
                                        <CategorySelect
                                            category={uploadedFiles[index + 1]?.category}
                                            handleCategoryChange={(event: any) =>
                                                handleCategoryChange(event.target.value, index + 1)
                                            }
                                        />
                                    }
                                </Box>
                            )
                        }
                    })
                }

            </Modal>

        </div>
    )
};

export default DetailsViewer


const ShowEmptyMessage = ({ message }: {
    message: string
}) => {
    const classes = useStyles();
    return (
        <div className={classes.container} style={{ alignItems: 'center', justifyContent: 'center' }}>
            <p className={classes.noContentTitle}>{message}</p>
        </div>
    )
}