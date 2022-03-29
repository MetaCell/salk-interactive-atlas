import * as React from "react";
import {
  Box,
  makeStyles,
  Grid,
  Typography,
  Link,
  Avatar
} from "@material-ui/core";
import { switchActiveColor, headerBorderColor } from "../theme";
import LOGO from "../assets/images/logo_icon.svg"
import Modal from "./common/BaseDialog";

const useStyles = makeStyles(() => ({
    details: {
      flexGrow: 1,
      '& .detail-block + .detail-block': {
        marginTop: '1.5rem',
      },
  
      '& .MuiTypography-root': {
        fontSize: '0.75rem',
        lineHeight: '0.9375rem',
        fontWeight: 600,
        marginBottom: '0.5rem',
      },

      '& .MuiLink-root': {
        color:switchActiveColor,
        fontWeight: 400,
      },

      '& p': {
        '&.MuiTypography-root': {
          fontWeight: 400,
        },
      },
    },

    avatar: {
      '& .MuiAvatar-root':{
        borderColor:headerBorderColor,
        border: "0.063rem solid",
        width: "5rem",
        height: "5rem",
        borderRadius: "50%",
        padding:"1rem"
      }
      
    }
}));





const AboutCoordAtlasDialog = (props: any) => {
  const classes = useStyles();
  const { open, handleClose} = props;
  return (
    <Modal open={Boolean(open)} handleClose={handleClose} title="About Mouse Coord Atlas">
        <Grid container direction="row" className={classes.details} spacing={2}>
          <Grid item className={classes.avatar}> 
           <Avatar alt="About Mouse Coord Atlas logo" src={LOGO}/>
          </Grid>
          <Grid item container>
            <Box className="detail-block">
              <Typography component="h3">About Mouse Cord Atlas</Typography>
              <Typography>Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est.</Typography>
            </Box>
            <Box className="detail-block">
              <Typography component="h3">Instigator</Typography>
              <Typography>Salk Mouse Cord Atlas has been instigated by the Gouding Lab at Salk Institute in La Jolla (San Diego, CA)</Typography>
              <Link>Learn more about the Goudling Lab</Link>
            </Box>
            <Box className="detail-block">
              <Typography component="h3">Funder</Typography>
              <Typography>Salk Mouse Cord Atlas has been instigated by the Gouding Lab at Salk Institute in La Jolla (San Diego, CA)</Typography>
              <Link>Learn more about NIH</Link>
            </Box>
            <Box className="detail-block">
              <Typography component="h3">Development</Typography>
              <Typography>Salk Mouse Cord Atlas has been built by MetaCell.</Typography>
              <Link>Learn more about MetaCell</Link>
            </Box>
          </Grid>
        </Grid>

    </Modal>
  );
};

export default AboutCoordAtlasDialog
