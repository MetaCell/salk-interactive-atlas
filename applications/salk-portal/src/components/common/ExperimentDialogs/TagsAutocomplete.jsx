import * as React from "react";
import {
  Box,
  makeStyles,
  TextField,
  Chip,
} from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { tagsColorOptions, secondaryChipBg } from "../../../theme";
import CHECK from "../../../assets/images/icons/check.svg";

const useStyles = makeStyles(() => ({
  icon: {
    width: '0.75rem',
    height: '0.75rem',
    marginRight: '0.5rem',
    borderRadius: '0.1875rem',
  },

  mlAuto: {
    marginLeft: 'auto',
  },

}));

export const TagsAutocomplete = (props) => {
  const classes = useStyles();
  const { tags, onChange } = props;

  return (
    <Autocomplete
      multiple
      closeIcon={false}
      popupIcon={false}
      fullWidth
      id="tags-filled"
      options={tags}
      defaultValue={[tags[2]]}
      getOptionLabel={option => option.name}
      freeSolo
      limitTags={3}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip key={index} style={{...tagsColorOptions[index]}} onDelete={() => console.log(option)} label={option.name} {...getTagProps({ index })} />
        ))
      }
      renderOption={(option, { selected }) => (
        <>
          <Box className={classes.icon} style={{backgroundColor: secondaryChipBg}}/>
          {option.name}
          {selected && <img src={CHECK} className={classes.mlAuto} alt="check" />}
        </>
      )}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" placeholder="Search or Create a new tag" />
      )}
      onChange={onChange}
    />

  );
};