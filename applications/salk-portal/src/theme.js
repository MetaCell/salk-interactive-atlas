
import createMuiTheme from '@material-ui/core/styles/createTheme';
import lessToJs from 'less-vars-to-js';

import './css/mui.less';
import './css/main.less';
import './css/flexLayout.less';

// Read the less file in as string: using the raw-loader to override the default loader
const lessFile = require('!!raw-loader!./css/variables.less').default;
export const vars = lessToJs(lessFile, { resolveVariables: true, stripPrefix: true });

vars.gutter = vars.gutter.replace('px', '') * 1;

export const {
  primaryColor, secondaryColor, font, fontColor, linkColor, teal, purple, bgLightest, paragraph, bgLightestShade,
  bgLight, bgRegular, bgDark, bgDarker, bgDarkest, bgInputs, gutter, radius, checkBoxColor, bgLighter, textColor, canvasBg, headerBorderColor,headerButtonBorderColor, bodyBgColor, headerBg, switchActiveColor, canvasIconColor, breadcrumbTextColor, sidebarBadgeBg, sidebarTextColor, defaultChipBg, primaryChipBg, secondaryChipBg, chipTextColor, cardTextColor,
} = vars;

const verticalFill = {
  height: 'calc(100%)',
  overflow: 'hidden'
}

const spacing = [0, gutter / 2, gutter * 2 / 3, gutter, 24, 40, 50, 100, 150, 200, 300];

const theme = {
  darkMode: true,
  spacing,
  palette: {
    type: 'dark',
    primary: {
      main: primaryColor,
      dark: secondaryColor,
      contrastText: '#ffffff'
    },
    secondary: {
      main: secondaryColor,
      dark: primaryColor,

    },
    background: {
      default: bgDarker,
      paper: bgRegular
    },
    button: { main: primaryColor },
  },
  typography: {
    fontFamily: font,
    h1: {
      fontSize: '1.9rem',
      fontWeight: 400,
      flex: 1
    },

    h2: {
      fontSize: '1.1rem',
      fontWeight: 700,
      marginBottom: spacing[3],
      lineHeight: "1.25rem",
      paddingBottom: spacing[2],
      borderBottom: `0.1875rem solid ${bgInputs}`
    },
    h3: {
      fontSize: '1rem',
      fontWeight: 700,
      flex: 1,
    },
    h4: {
      fontSize: '1.3rem',
      fontWeight: 400,
      flex: 1
    },
    h5: {
      fontSize: '1.2rem',
      flex: 1,
      fontWeight: 400,
    },
    h6: {
      fontSize: '1rem',
      lineHeight: 1,
      fontWeight: 400,
    },
    subtitle1: {
      fontWeight: 400,
      lineHeight: 1,
      fontSize: '1rem'
    },
    subtitle2: {
      fontWeight: 400,
      lineHeight: 1,
    }
  },
  overrides: {
    MuiChip: {
      root: {
        marginRight: spacing[0.5],
        marginLeft: spacing[1],
        color: fontColor,
        label: {
          fontSize: '0.8rem',
        },


          "& .MuiChip-avatar": {
            width: ".63rem",
            height: ".63rem",
            "&.MuiSvgIcon-colorPrimary": {
              color: teal,
            },
            "&.MuiSvgIcon-colorSecondary": {
              color: purple,
            },
          },

      },
      outlined: {
        backgroundColor: bgDarker,
        border: 'none',
      },
      deleteIcon: {
        color: '#a6a6a6',
      },
    },
    MuiInput: {
      input: {
        outline: 'none !important',
        border: 'none !important',
        boxShadow: 'none !important',
      },
      root: { color: fontColor }

    },
    MuiSelect: {
      root: {
        outline: 'none !important',
        border: 'none !important',
        boxShadow: 'none !important'
      },
      select: { "&:focus": { background: "none" } },
    },
    MuiGrid: {
      root: {
        display: 'flex'
      },
      container: {
        flex: 1
      }
    },
    MuiCard: { root: { flex: 1 } },
    MuiBottomNavigation: { root: { backgroundColor: bgRegular, marginBottom: 8, borderRadius: 4 } },
    MuiPaper: {
      root: {
        color: 'inherit', backgroundColor: bgRegular, flex: 1
      },
      rounded: {
        borderRadius: '0.3125rem'
      },
    },
    MuiBottomNavigationAction: {
      root: { color: fontColor, textTransform: 'uppercase' },
      label: { fontSize: "0.65rem", "&.Mui-selected": { fontSize: "0.65rem" } },
    },
    MuiFormControl: { root: { overflow: 'visible' } },
    MuiFab: {
    },
    MuiButton: {
      root: {

      },
      outlined: {
        marginRight: gutter / 2,
        border: `0.0625rem solid ${headerButtonBorderColor}`,
        '&:last-child': {
          marginRight: 0
        }
      },
      contained: {
        backgroundColor: switchActiveColor,
        color: secondaryColor,
        "&:hover": {
          backgroundColor: primaryColor,
        },
      },
      text: {
        padding: gutter / 2
      },
      containedPrimary: {
          '&:hover': {
            backgroundColor: primaryColor,
          },
      },
    },
    MuiMenuItem: {
      root: {
        fontSize: '1em',
        paddingTop: gutter / 2,
      },
      gutters: {
        paddingLeft: gutter * 2,
        paddingRight: gutter * 2
      }

    },
    MuiDialogTitle: { root: { fontWeight: 600, fontSize: '1rem' } },
    MuiDialogContent: { root: { paddingBottom: gutter } },
    MuiCollapse: {
      root: { borderTop: `0.0625rem solid ${headerBorderColor}`},
      wrapper: { padding: "0 !important" }
    },
    MuiIcon: { fontSizeLarge: { fontSize: '1.75rem' } },
    MuiAccordionSummary: {
      root: {
        padding: '0 .5rem 0 1rem !important', margin: 0, minHeight: '3rem !important', display: "flex",
      },
      content: {
        margin: '0 !important',

        '& p': {
          display: 'flex',
          alignItems: 'center',
          fontWeight: '600',
          fontSize: '0.75rem',
          lineHeight: '1rem',
          letterSpacing: '0.005em',
          color: canvasIconColor,

          '& img': {
            marginRight: '0.875rem',
          },
        },
      },
      expandIcon: { marginRight: 0 }
    },
    MuiAccordionDetails: { root: { padding: '1rem 1rem 1rem 3rem', margin: 0, minHeight: 'unset!important', flexDirection: 'column', } },
    MuiAccordion: {
      root: {
        padding: 0, margin: '0 !important', minHeight: 'unset', background: 'transparent',

        '&:before': {
          backgroundColor: headerBorderColor,
          display: 'block !important',
          opacity: '1 !important',
          content: '""',
        },
      }
    },
    MuiCardContent: {
      root: {
        '&:last-child': {
          paddingBottom: 16
        }
      }
    },
    MuiDrawer: {
      root: {
        ...verticalFill

      },
      paper: {
        ...verticalFill,
        'div:only-child': {
          ...verticalFill,
        }
      }
    },
    MuiTabs: {
      root: {
        minHeight: '1.25rem',
        height: '1.25rem',
      },
      indicator: {
        backgroundColor: 'transparent',
      }
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        fontSize: '1.1rem',
        fontWeight: 400,
        padding: '0 0.5rem 0 0',
        textDecoration: 'none',
        border: 0,
        minHeight: '1.25rem',
        height: '1.25rem',
        minWidth: '9.375rem !important',
        textAlign: 'left',
        '&:first-child': {
          borderRight: `0.0625rem solid ${secondaryColor}`,
        },
        '&:last-child': {
          padding: '0 0 0 0.5rem',
        }
      }
    },
    MuiToolbar: {
      root: {
        minHeight: 15
      }
    },
    MuiAutocomplete: {
      root: {
        border: `0.125rem solid ${bgLight}`,
        paddingTop: '0.625rem',
        paddingBottom: '0.625rem',
        borderRadius: '0.125rem',
        '& div:first-child': {
            paddingBottom: '0',
        },
        '& .MuiInputBase-root': {
          paddingTop: '0 !important',
          backgroundColor: 'transparent',
          '& .MuiAutocomplete-endAdornment': {
            display: 'none',
          },
        },
        '& .MuiFilledInput-underline::before': {
          borderBottom: 'none',
        },
        '& .MuiFilledInput-underline::after': {
          borderBottom: 'none',
        },
      },
    },

    MuiFormControlLabel: {
      labelPlacementStart: {
        marginLeft: 0,
        marginRight: 0,
      },

      label: {
        fontSize: '0.75rem',
        lineHeight: '0.9375rem',
        color: canvasIconColor,
        flexGrow: 1,
        userSelect: 'none',
      },
    },

    MuiSwitch: {
      root: {
        width: '2rem',
        height: '1rem',
        padding: 0,
      },
      track: {
        opacity: '0.2',
        borderRadius: '3.125rem',
      },

      input: {
        width: 'auto',
      },

      switchBase: {
        padding: 0,
        background: canvasIconColor,
        boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.3)',
        borderRadius: '0.3125rem',
        top: '0.1875rem',
        left: '0.1875rem',

        '&.Mui-checked': {
          transform: 'translateX(1rem)',
        },
      },

      thumb: {
        width: '0.625rem',
        height: '0.625rem',
      },

      colorSecondary: {
        '&.Mui-checked': {
          color: secondaryColor,

          '& + .MuiSwitch-track': {
            backgroundColor: switchActiveColor,
          },
        },
      },
    },

    MuiRadio: {
      root: {
        padding: 0,
        color: breadcrumbTextColor,

        '& .MuiSvgIcon-root': {
          width: '0.875rem',
          height: '0.875rem',
        },
      },

      colorSecondary: {
        '&.Mui-checked': {
          color: switchActiveColor,
        },
      },
    },

    MuiBreadcrumbs: {
      root: {
        letterSpacing: '-0.01em',
        fontSize: '0.75rem',
        lineHeight: '1.25rem',

        '&.MuiTypography-colorTextSecondary': {
          color: breadcrumbTextColor,
        },
      },

      li: {
        '& .MuiTypography-root': {
          letterSpacing: '-0.01em',
          fontSize: '0.75rem',
          lineHeight: '1.25rem',
        },
      },

      separator: {
        marginLeft: '0.3125rem',
        marginRight: '0.3125rem',
      },
    },

    MuiAvatar: {
      colorDefault: {
        backgroundColor: secondaryColor,
        color: headerBg,
      },
    },
  },
}

export default createMuiTheme(theme);
