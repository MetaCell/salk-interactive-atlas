import * as React from "react";
import {useHistory} from "react-router-dom"
import { makeStyles } from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import { headerBg, headerBorderColor, headerButtonBorderColor, defaultChipBg, secondaryChipBg, primaryChipBg, chipTextColor, cardTextColor } from "../../theme";
import USER from "../../assets/images/icons/user.svg";
import POPULAR from "../../assets/images/icons/popular.svg";
import CLONE from "../../assets/images/icons/clone.svg";
import PLACEHOLDER from "../../assets/images/placeholder.png";


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

}));

const ExperimentCard = ({experiment, type}) => {
  const classes = useStyles();
  const history = useHistory()
  const handleClick = () => {
    history.push(`/experiments/${experiment.id}`)
  }
  return (
    <Grid item xs={12} md={3} key={`${experiment.name}experiment_${experiment.id}`} onClick={handleClick}>
      <Card className={classes.card} elevation={0}>
        <CardActionArea>
          {type === COMMUNITY_HASH && <img src={POPULAR} alt="POPULAR" />}
          <CardMedia
            component="img"
            alt={experiment.name}
            image={PLACEHOLDER}
            title={experiment.name}
          />
          <CardContent>
            <Box>
               {type != COMMUNITY_HASH && 
                <Box>
                  {
                    experiment.tags?.map((tag, i) => <Chip key={`${experiment.name}_${i}_${tag.name}`} label={tag.name} color={i== 1 ? 'primary' : i === 2 ? 'secondary': 'default'}/>)
                  }
              </Box>}
              <Typography component="h3">
                {experiment.name || 'fff'}
              </Typography>
              <Typography component="p">
                { type === COMMUNITY_HASH && <img src={CLONE} alt="clone" /> }
                {type === EXPERIMENTS_HASH ? experiment.date_created : `Shared on ${experiment.date_created}` }
              </Typography>
            </Box>
            <Avatar src={USER} alt={experiment.description} />
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default ExperimentCard;