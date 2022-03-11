import * as React from "react";

import { Grid, Paper, Avatar, Chip, CardHeader } from "@material-ui/core";
import Box from "@material-ui/core/Box";

import { makeStyles } from "@material-ui/core/styles";
import { Latest } from "../components/home/Latest";
import MainMenu from "../components/menu/MainMenu";

import {
  Banner, ProtectedRoute,
} from "../components";
import Sidebar from "../components/ExplorerSidebar";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import USER from "../assets/images/icons/user.svg";
import PLACEHOLDER from "../assets/images/placeholder.png";
import UP_ICON from "../assets/images/icons/up.svg";
import FILTER from "../assets/images/icons/filters.svg";
import CLONE from "../assets/images/icons/clone.svg";
import POPULAR from "../assets/images/icons/popular.svg";
import { bodyBgColor, headerBg, headerBorderColor, headerButtonBorderColor, defaultChipBg, secondaryChipBg, primaryChipBg, chipTextColor, cardTextColor } from "../theme";

const useStyles = makeStyles((theme) => ({
  paper: {
    overflow: "hidden",
  },

  layoutContainer: {
    width: 'calc(100% - 15rem)',
    overflow: 'auto',
    height: 'calc(100vh - 3rem)',
    backgroundColor: bodyBgColor,
    // flexGrow: 1,
    // padding: '0.5rem',
  },

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

  subHeader: {
    minHeight: '3rem',
    boxShadow: `inset 0 -0.0625rem 0 ${headerBorderColor}`,
    padding: '0 1.875rem',
    backgroundColor: bodyBgColor,
    position: 'sticky',
    top: 0,
    left: 0,
    zIndex: 1,

    '& .MuiButton-root': {
      padding: '0.5rem',
      fontWeight: '600',
      fontSize: '0.75rem',
      lineHeight: '1rem',
      letterSpacing: '0.005em',
      color: headerButtonBorderColor,
      textTransform: 'none',
      '& img': {
        marginLeft: '0.25rem',
      },
    },

    '& .MuiBreadcrumbs-root': {
      flexGrow: 1,
      '& .MuiBreadcrumbs-ol': {
        justifyContent: 'center',
      },
      '& .MuiTypography-root': {
        fontWeight: '600',
        fontSize: '0.75rem',
        lineHeight: '1rem',
        color: headerButtonBorderColor,
        '&.MuiTypography-colorTextPrimary': {
          color: cardTextColor,
        },
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


export default (props: any) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const myRef = React.useRef(null);
  const [selectedRef, setSelectedRef] =  React.useState(myRef);
  const handleClick = (event: { currentTarget: any; }) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  
  const shared = React.useRef(null);
  const salkteam = React.useRef(null);
  const acmeteam = React.useRef(null);
  const executeScroll = (selRef: string) => {
    if(selRef === 'experiments') {
      setSelectedRef(myRef);
    } else if(selRef === 'shared') {
      setSelectedRef(shared);
    } else if(selRef === 'salkteam') {
      setSelectedRef(salkteam);
    } else if(selRef === 'acmeteam') {
      setSelectedRef(acmeteam);
    }
    selectedRef.current.scrollIntoView();
  }
  return (
    <Box display="flex">
      <Sidebar executeScroll={(r: string) => executeScroll(r)} />
      <Box className={classes.layoutContainer}>
          <div ref={myRef} id="experiments">
          <Box className={classes.subHeader} display="flex" alignItems="center">
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
              Filter
              <img src={FILTER} alt="arrow" />
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>

            <Breadcrumbs separator="·" aria-label="breadcrumb">
              <Link color="inherit" href="/">
                My experiments
              </Link>
              <Typography color="textPrimary">7 experiments</Typography>
            </Breadcrumbs>

            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
              Sort
              <img src={UP_ICON} alt="arrow" />
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </Box>
          <Box p={5}>
            <Grid container item spacing={3}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, i) => (
                  <Grid item xs={12} md={3} key={i}>
                    <Card className={classes.card} elevation={0}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          alt="Exploration of the spinal cord"
                          image={PLACEHOLDER}
                          title="Exploration of the spinal cord"
                        />
                        <CardContent>
                          <Box>
                            <Box>
                              <Chip label="Project A" />
                              <Chip label="Tag X" color="primary" />
                              <Chip label="Label 1" color="secondary" />
                            </Box>
                            <Typography component="h3">
                              Exploration of the spinal cord
                            </Typography>
                            <Typography component="p">
                            Shared on Sept 2nd, 2021
                            </Typography>
                          </Box>
                          <Avatar src={USER} />
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Box>
          </div>
          <div ref={shared} id="shared">
          <Box className={classes.subHeader} display="flex" alignItems="center">
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
              Filter
              <img src={FILTER} alt="arrow" />
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>

            <Breadcrumbs separator="·" aria-label="breadcrumb">
              <Link color="inherit" href="/">
                Shared with me
              </Link>
              <Typography color="textPrimary">28 experiments</Typography>
            </Breadcrumbs>

            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
              Sort
              <img src={UP_ICON} alt="arrow" />
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </Box>
          <Box p={5}>
            <Grid container item spacing={3}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, i) => (
                  <Grid item xs={12} md={3} key={i}>
                    <Card className={classes.card} elevation={0}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          alt="Exploration of the spinal cord"
                          image={PLACEHOLDER}
                          title="Exploration of the spinal cord"
                        />
                        <CardContent>
                          <Box>
                            <Box>
                              <Chip label="Project A" />
                              <Chip label="Tag X" color="primary" />
                              <Chip label="Label 1" color="secondary" />
                            </Box>
                            <Typography component="h3">
                              Exploration of the spinal cord
                            </Typography>
                            <Typography component="p">
                            Shared on Sept 2nd, 2021
                            </Typography>
                          </Box>
                          <Avatar src={USER} />
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Box>
          </div>
          <div ref={salkteam} id="salkteam">
          <Box className={classes.subHeader} display="flex" alignItems="center">
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
              Filter
              <img src={FILTER} alt="arrow" />
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>

            <Breadcrumbs separator="·" aria-label="breadcrumb">
              <Link color="inherit" href="/">
                Salk Institute Team
              </Link>
              <Typography color="textPrimary">19 experiments</Typography>
            </Breadcrumbs>

            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
              Sort
              <img src={UP_ICON} alt="arrow" />
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </Box>
          <Box p={5}>
            <Grid container item spacing={3}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, i) => (
                  <Grid item xs={12} md={3} key={i}>
                    <Card className={classes.card} elevation={0}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          alt="Exploration of the spinal cord"
                          image={PLACEHOLDER}
                          title="Exploration of the spinal cord"
                        />
                        <CardContent>
                          <Box>
                            <Typography component="h3">
                              Exploration of the spinal cord
                            </Typography>
                            <Typography component="p">
                            Shared on Sept 2nd, 2021
                            </Typography>
                          </Box>
                          <Avatar src={USER} />
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Box>
          </div>
          <div ref={acmeteam} id="acmeteam">
          <Box className={classes.subHeader} display="flex" alignItems="center">
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
              Filter
              <img src={FILTER} alt="arrow" />
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>

            <Breadcrumbs separator="·" aria-label="breadcrumb">
              <Link color="inherit" href="/">
                Acme Team
              </Link>
              <Typography color="textPrimary">19 experiments</Typography>
            </Breadcrumbs>

            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
              Sort
              <img src={UP_ICON} alt="arrow" />
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </Box>
          <Box p={5}>
            <Grid container item spacing={3}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, i) => (
                  <Grid item xs={12} md={3} key={i}>
                    <Card className={classes.card} elevation={0}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          alt="Exploration of the spinal cord"
                          image={PLACEHOLDER}
                          title="Exploration of the spinal cord"
                        />
                        <CardContent>
                          <Box>
                            <Typography component="h3">
                              Exploration of the spinal cord
                            </Typography>
                            <Typography component="p">
                            Shared on Sept 2nd, 2021
                            </Typography>
                          </Box>
                          <Avatar src={USER} />
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Box>
          </div>

          <Box p={5}>
            <Box className={classes.banner}>
              <Typography component="h4">Welcome to the Community!</Typography>
              <Typography>
                Community files are free, open resources developed by the world's best researchers. You can clone the different experiments and download atlases for exploring them. Have a good discovery!
              </Typography>
            </Box>

            <Box className={classes.wrapper}>
              <Typography component="h2">Popular experiments</Typography>
              <Grid container item spacing={3}>
                {[1, 2, 3, 4].map((item, i) => (
                  <Grid item xs={12} md={3} key={i}>
                    <Card className={classes.card} elevation={0}>
                      <CardActionArea>
                        <img src={POPULAR} alt="POPULAR" />
                        <CardMedia
                          component="img"
                          alt="Exploration of the spinal cord"
                          image={PLACEHOLDER}
                          title="Exploration of the spinal cord"
                        />
                        <CardContent>
                          <Box>
                            <Typography component="h3">
                              Exploration of the spinal cord
                            </Typography>
                            <Typography component="p">
                              <img src={CLONE} alt="clone" />
                              223 clones
                            </Typography>
                          </Box>
                          <Avatar src={USER} />
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
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
                {[1, 2, 3, 4].map((item, i) => (
                  <Grid item xs={12} md={3} key={i}>
                    <Card className={classes.card} elevation={0}>
                      <CardActionArea>
                        <img src={POPULAR} alt="POPULAR" />
                        <CardMedia
                          component="img"
                          alt="Exploration of the spinal cord"
                          image={PLACEHOLDER}
                          title="Exploration of the spinal cord"
                        />
                        <CardContent>
                          <Box>
                            <Typography component="h3">
                              Exploration of the spinal cord
                            </Typography>
                            <Typography component="p">
                              <img src={CLONE} alt="clone" />
                              223 clones
                            </Typography>
                          </Box>
                          <Avatar src={USER} />
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>

      </Box>
    </Box>
  )
};
