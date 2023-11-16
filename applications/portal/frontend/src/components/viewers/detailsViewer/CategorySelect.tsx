import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import {
    populationTitleColor, populationSubTitleColor
} from "../../../theme";
import {
    Typography, Box, MenuItem, ListItemIcon, Select, OutlinedInput, FormControl
} from "@material-ui/core";

import DOWN_ICON from "../../../assets/images/icons/chevron_down.svg";
import CHECK from "../../../assets/images/icons/check.svg";

const useStyles = makeStyles({
    categoryBox: {
        '& label': {
            fontWeight: 600,
            fontSize: '0.75rem',
            lineHeight: '1rem',
            letterSpacing: '0.005em',
            color: populationTitleColor,
            width: '8rem',
            flexShrink: 0
        }
    },
    categorySelect: {
        '& .MuiSelect-selectMenu': {
            color: populationSubTitleColor
        }
    },
    categorySelectMenuItem: {
        padding: '0.5rem 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '&:hover': {
            background: 'transparent'
        },
        '&.Mui-selected': {
            background: 'transparent'
        },
        '& .MuiListItemIcon-root': {
            minWidth: 'auto'
        },
    }
});

export const CategorySelect = (props: {
    category: string,
    handleCategoryChange: any
}) => {
    const classes = useStyles();
    const { category, handleCategoryChange } = props

    return (
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
                            <MenuItem
                                key={index}
                                value={option}
                                disableGutters
                                className={classes.categorySelectMenuItem}
                            >
                                {option}
                                {
                                    category === option && <ListItemIcon>
                                        <img src={CHECK} alt='' />
                                    </ListItemIcon>
                                }
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
        </Box>
    )
};

const options = ['Electrophysiology', 'Behaviour', 'I/O Mapping']