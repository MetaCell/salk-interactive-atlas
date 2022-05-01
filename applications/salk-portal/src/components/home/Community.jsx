import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import { headerBg, headerBorderColor, headerButtonBorderColor, defaultChipBg, secondaryChipBg, primaryChipBg, chipTextColor, cardTextColor } from "../../theme";
import USER from "../../assets/images/icons/user.svg";
import ExperimentCard from "./ExperimentCard";
import { COMMUNITY_HASH } from "../../utilities/constants";

const useStyles = makeStyles(() => ({
  card: {
    background: headerBg,
    border: `0.03125rem solid ${headerBorderColor}`,
    borderRadius: '0.375rem',

    '&.secondary': {
      background: 'transparent',
    },

    '& .MuiCardHeader-root': {
      alignItems: 'flex-start',
      '& .MuiAvatar-root': {
        width: '2.25rem',
        height: '2.25rem',
      },

      '& .MuiTypography-root': {
        fontSize: '0.75rem',
        lineHeight: '0.9375rem',
        color: cardTextColor,
        '&.MuiCardHeader-title': {
          fontWeight: '600',
          marginBottom: '0.25rem',
          color: headerButtonBorderColor,
        },
      },
    },

    '& .MuiCardActionArea-root > img:not(.MuiCardMedia-root)': {
      position: 'absolute',
      left: '0.25rem',
      top: '0.25rem',
    },

    '& .MuiCardMedia-root': {
      height: '10.3125rem',
    },

    '& .MuiCardContent-root': {
      boxShadow: `inset 0 0.03125rem 0 ${headerBorderColor}`,
      display: 'flex',
      alignItems: 'flex-end',
      '& > .MuiBox-root': {
        paddingRight: '0.75rem',
        flexGrow: 1,
      },

      '& .MuiChip-root': {
        margin: 0,
        height: '1.0625rem',
        background: defaultChipBg,
        marginBottom: '0.5rem',
        borderRadius: '0.25rem',

        '&:not(:last-child)': {
          marginRight: '0.25rem',
        },

        '&.MuiChip-colorPrimary': {background: primaryChipBg,},
        '&.MuiChip-colorSecondary': {background: secondaryChipBg,},

        '& .MuiChip-label': {
          padding: '0 0.375rem',
          fontWeight: '600',
          fontSize: '0.625rem',
          lineHeight: '0.75rem',
          color: chipTextColor,
        },
      },

      '& .MuiAvatar-root': {
        width: '1.5rem',
        height: '1.5rem',
      },

      '& h3': {
        fontWeight: '600',
        fontSize: '0.75rem',
        lineHeight: '0.9375rem',
        color: headerButtonBorderColor,
        marginBottom: '0.5rem',
      },
      '& p': {
        fontSize: '0.75rem',
        lineHeight: '0.9375rem',
        color: cardTextColor,
        display: 'flex',
        alignItems: 'center',

        '& img': {marginRight: '0.5rem'},
      },
    },
  },

  wrapper: {
    '&:not(:last-child)': {
      marginBottom: '2rem',
    },
    '& h2': {
      fontWeight: '600',
      fontSize: '0.75rem',
      lineHeight: '1rem',
      marginBottom: '1rem',
      letterSpacing: '0.005em',
      color: headerButtonBorderColor,
    }
  },

  banner: {
    padding: '2.75rem',
    textAlign: 'center',
    backgroundColor: headerBg,
    borderRadius: '0.375rem',
    marginBottom: '2.75rem',

    '& .MuiTypography-root': {
      maxWidth: '20.3125rem',
      margin: '0 auto',
    },

    '& h4': {
      fontWeight: '500',
      fontSize: '1.5rem',
      lineHeight: '2rem',
      color: headerButtonBorderColor,
      '&.MuiTypography-root': {marginBottom: '1.5rem',},
    },

    '& p': {
      fontSize: '0.75rem',
      lineHeight: '1.125rem',
      color: cardTextColor,
    },
  },

}));


const Community = (props) => {
  const classes = useStyles();
  const dummyExperiment = {
    id: "id",
    name: "Exploration of the Spinal Cord",
    is_private: true,
    description: "Description Experiment",
    date_created: "2022-03-14",
    last_modified: "2022-03-15",
    owner: {
        id: 1,
        username: "afonso",
        first_name: "",
        last_name: "",
        email: "afonso@metacell.us",
        groups: []
    },
    teams: [],
    collaborators: [],
    populations: [
        {
            id: 1,
            name: "Test Population",
            color: "#FFFF00",
            atlas: "salk_cord_10um",
            cells: {
  
            }
        }
    ],
    tags: [
        {
            id: 1,
            name: "Test Tag"
        },
    ]
  }

  return (
    <>
      <Box className={classes.banner}>
        <Typography component="h4">Welcome to the Community!</Typography>
        <Typography>
          Community files are free, open resources developed by the world's best researchers. You can clone the different experiments and download atlases for exploring them. Have a good discovery!
        </Typography>
      </Box>

      <Box className={classes.wrapper}>
        <Typography component="h2">Popular experiments</Typography>
        <Grid container item spacing={3}>
          {[1, 2, 3, 4].map( i => (
            <ExperimentCard experiment={dummyExperiment} type={COMMUNITY_HASH} handleDialogToggle={props?.handleDialogToggle} handleExplorationDialogToggle={props?.handleExplorationDialogToggle} handleShareDialogToggle={props?.handleShareDialogToggle} handleShareMultipleDialogToggle={props?.handleShareMultipleDialogToggle} />
          ))}
        </Grid>
      </Box>

      <Box className={classes.wrapper}>
        <Typography component="h2">Popular Atlases</Typography>
        <Grid container item spacing={3}>
          {[1, 2, 3, 4].map((item, i) => (
            <Grid item xs={12} md={3} key={i}>
              <Card className={`${classes.card} secondary`} elevation={0}>
                <CardActionArea>
                  <CardHeader
                    avatar={
                      <Avatar src={USER} />
                    }
                    title="Atlas of neuronal populations"
                    subheader="Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam"
                  />
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box className={classes.wrapper}>
        <Typography component="h2">Last Published</Typography>
        <Grid container item spacing={3}>
          {[1, 2, 3, 4].map(i => (
            <ExperimentCard experiment={dummyExperiment} type={COMMUNITY_HASH} handleDialogToggle={props?.handleDialogToggle} handleExplorationDialogToggle={props?.handleExplorationDialogToggle} handleShareDialogToggle={props?.handleShareDialogToggle} handleShareMultipleDialogToggle={props?.handleShareMultipleDialogToggle} />
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default Community;