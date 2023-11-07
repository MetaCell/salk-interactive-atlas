
import createMuiTheme from '@material-ui/core/styles/createTheme';
import lessToJs from 'less-vars-to-js';

import './css/mui.less';
import './css/flexLayout.less';

// Read the less file in as string: using the raw-loader to override the default loader
const lessFile = require('!!raw-loader!./css/variables.less').default;
export const vars = lessToJs(lessFile, { resolveVariables: true, stripPrefix: true });

vars.gutter = vars.gutter.replace('px', '') * 1;

export const {
  primaryColor, secondaryColor, font, fontColor, linkColor, teal, purple, brown, skyBlue, bgLightest, paragraph, bgLightestShade,
  bgLight, bgRegular, bgDark, bgDarker, bgDarkest, bgInputs, gutter, radius, checkBoxColor, bgLighter, textColor, canvasBg, headerBorderColor,headerButtonBorderColor, bodyBgColor, headerBg, switchActiveColor, canvasIconColor, breadcrumbTextColor, sidebarBadgeBg, sidebarTextColor, defaultChipBg, primaryChipBg, secondaryChipBg, chipTextColor, cardTextColor, inputFocusShadow, backdropBg, logoHoverbg, textDisabled, chipDeleteIcon, filesBg, indicatorLabelColor
} = vars;

const verticalFill = {
  height: 'calc(100%)',
  overflow: 'hidden'
}

const spacing = [0, gutter / 2, gutter * 2 / 3, gutter, 24, 40, 50, 100, 150, 200, 300];

const Charcoal = {
  backgroundColor: '#344054',
  color: '#F2F4F7'
}
const Iris = {
  backgroundColor: '#6941C6',
  color: '#F9F5FF'
}
const Carnelian = {
  backgroundColor: '#B42318',
  color: '#FEF3F2'
}
const Rust = {
  backgroundColor: '#B54708',
  color: '#FFFAEB'
}
const Green = {
  backgroundColor: '#027A48',
  color: '#ECFDF3'
}
const Blue = {
  backgroundColor: '#363F72',
  color: '#F8F9FC'
}
const PersianBlue = {
  backgroundColor: '#026AA2',
  color: '#F0F9FF'
}
const CelticBlue = {
  backgroundColor: '#175CD3',
  color: '#EFF8FF'
}
const PalatinateBlue = {
  backgroundColor: '#3538CD',
  color: '#EEF4FF'
}
const HanPurple = {
  backgroundColor: '#5925DC',
  color: '#F4F3FF'
}
const Magenta = {
  backgroundColor: '#C11574',
  color: '#FDF2FA'
}
const Carmine = {
  backgroundColor: '#C01048',
  color: '#FFF1F3'
}
const RustDark = {
  backgroundColor: '#B93815',
  color: '#FEF6EE'
}
const AntiFlashWhite  = {
  backgroundColor: '#F2F4F7',
  color: '#344054'
}

export const tagsColorOptions = [Charcoal, Iris, Carnelian, Rust, Green, Blue, PersianBlue, HanPurple, Magenta, Carmine, RustDark, AntiFlashWhite];

const theme = {
  darkMode: true,
  spacing,
  palette: {
    type: 'dark',
    primary: {
      main: primaryColor,
      dark: secondaryColor,
      contrastText: secondaryColor
    },
    secondary: {
      main: secondaryColor,
      dark: primaryColor,

    },
    background: {
      default: bgDarker,
      paper: bgRegular
    },
    button: { main: primaryColor, danger: '#F24822' },
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
    MuiPopover: {
      paper: {
        '& .picker': {
          '& .chrome-picker ': {
            background:  `${headerBorderColor} !important`,
            '& input': {
              backgroundColor:  `${headerBorderColor} !important`,
              color: 'white !important',
              boxShadow: 'none !important'
            },
          },
        },
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
      selectMenu: {
        height: '2rem',
        alignItems: 'center',
        display: 'flex',
      },
      select: {
        "&:focus": { backgroundColor: "none" }
      },
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
        textTransform: 'none',
        borderRadius: '0.375rem',
        fontWeight: '500',
        fontSize: '0.75rem',
        lineHeight: '1rem',
        letterSpacing: '0.01em',
        padding: '0.5rem',
      },
      outlined: {
        padding: '0.4375rem 0.5rem',
        marginRight: gutter / 2,
        border: `0.0625rem solid ${headerButtonBorderColor}`,
        '&:hover': {
          borderColor: secondaryColor,
          color: secondaryColor,
          backgroundColor: 'transparent',
        },
        '&:last-child': {
          marginRight: 0
        }
      },
      contained: {
        padding: '0.5rem',
        backgroundColor: switchActiveColor,
        color: secondaryColor,
        "&:hover": {
          backgroundColor: switchActiveColor,
        },
      },
      text: {
        padding: gutter / 2
      },
      containedPrimary: {
        backgroundColor: switchActiveColor,
          '&:hover': {
            backgroundColor: switchActiveColor,
          },
      },
      outlinedPrimary: {
        borderColor: secondaryColor,
        color: secondaryColor,
        '&:hover': {
          borderColor: secondaryColor,
          color: secondaryColor,
          backgroundColor: 'transparent',
        },
      },
    },
    MuiMenuItem: {
      root: {
        fontWeight: '500',
        fontSize: '0.75rem',
        lineHeight: '1.0625rem',
        letterSpacing: '0.005em',
        display: 'flex',
        alignItems: 'center',
        color: secondaryColor,
      },
      gutters: {
        padding: '0.5rem 1rem',
      }

    },
    MuiCollapse: {
      root: { borderTop: `0.0625rem solid ${headerBorderColor}`},
      wrapper: { padding: "0 !important" }
    },
    MuiIcon: { fontSizeLarge: { fontSize: '1.75rem' } },
    MuiAccordionSummary: {
      root: {
        padding: '4px', margin: 0, minHeight: 'auto !important', display: "flex"
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
    MuiAccordionDetails: { root: { padding: 0, paddingBottom: '8px', margin: 0, minHeight: 'unset!important', flexDirection: 'column', } },
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
      textColorInherit: {
        opacity: '0.6',
        color: secondaryColor,
      },
      root: {
        fontWeight: 600,
        fontSize: '0.75rem',
        textTransform: 'none',
        lineHeight: '1rem',
        letterSpacing: '0.005em',
        padding: 0,
        minWidth: '0.0625rem !important',

        '&:not(:first-child)': {
          marginLeft: '1rem',
        },
      }
    },
    MuiToolbar: {
      root: {
        minHeight: 15
      }
    },


    MuiFormControlLabel: {
      root: {
        display: 'flex',
        marginRight: 0,
        marginLeft: 0,
      },
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

    MuiTooltip: {
      arrow: {
        color: bodyBgColor,
      },
      tooltip: {
        backgroundColor: bodyBgColor,
        borderRadius: '0.375rem',
        padding: '0.34375rem 0.515625rem',
        '& .MuiTypography-root': {
          fontWeight: '400',
          fontSize: '0.75rem',
          lineHeight: '1.125rem',
        },
        '& p': {
          color: secondaryColor,
          display: 'flex',
          alignItems: 'center',
          '& span': {
            color: sidebarTextColor,
            marginRight: '0.5rem',
          },
        },
      },
    },

    MuiDialog: {
      paper: {
        background: headerBg,
        border: `0.0625rem solid ${headerBorderColor}`,
        boxShadow: '0 0.25rem 2.5rem rgba(0, 0, 0, 0.3), 0 0.5rem 0.5rem -0.25rem rgba(0, 0, 0, 0.1), 0 1.25rem 1.5rem -0.25rem rgba(0, 0, 0, 0.1)',
        borderRadius: '0.375rem',
      },

      paperWidthSm: {
        maxWidth: '30rem',
      },
    },

    MuiDialogActions: {
      root: {
        padding: '0.5rem',
        boxShadow: `inset 0 0.0625rem 0 ${headerBorderColor}`,

        '& .MuiButton-root': {
          width: 'calc((100% - 0.5rem) / 2)',
          margin: 0,
        },
      },
    },

    MuiDialogTitle: {
      root: {
        fontWeight: 600,
        fontSize: '1rem',
        padding: '0.125rem 0.25rem 0.125rem 1rem',
        boxShadow: `inset 0 -0.0625rem 0 ${headerBorderColor}`,

        '& .MuiTypography-root': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 600,
          fontSize: '0.75rem',
          lineHeight: '1rem',
          letterSpacing: '0.005em',
          color: headerButtonBorderColor,
        },
      }
     },
    MuiDialogContent: {
      root: { padding: '1.5rem 1rem' }
    },
    MuiDropzoneArea: {
      root: {
        minHeight: '6.25rem',
        backgroundColor: 'transparent',
        borderRadius: '0.375rem',
        border: `0.0625rem dashed ${sidebarTextColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 3rem'
      },

      textContainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',

        '& img': {marginBottom: '0.75rem',},
      },

      text: {
        marginTop: 0,
        marginBottom: 0,
        fontWeight: 500,
        fontSize: '0.75rem',
        lineHeight: '1rem',
        order: 2,
        letterSpacing: '0.01em',
        color: sidebarTextColor,
      },
    },
    MuiBackdrop: {
      root: {
        backgroundColor: backdropBg,
      },
    },


    MuiDrawer: {
      root: {
        ...verticalFill

      },
      paper: {
        width: '21.5rem',
        boxShadow: `-0.0625rem 0 0 ${headerBorderColor}`,
        backgroundColor: headerBg,
        padding: '1.25rem',
        ...verticalFill,
        'div:only-child': {
          ...verticalFill,
        }
      }
    },

    MuiTextField: {
      root: {
        flexGrow: 1,
      }
    },

    MuiOutlinedInput: {
      root: {
        borderRadius: '0.375rem',

        '& .MuiSelect-customIcon': {
          top: 'auto',
          right: '0.625rem',
        },

        '&.Mui-focused': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: switchActiveColor,
            boxShadow: `0 0 0 0.125rem ${inputFocusShadow}`,
          },
        },
      },

      input: {
        padding: '0 0.75rem',
        height: '2rem',
        fontWeight: '500',
        fontSize: '0.75rem',
        lineHeight: '1rem',
        letterSpacing: '0.01em',
        color: headerButtonBorderColor,
      },

      notchedOutline: {
        borderColor: sidebarTextColor
      },

      multiline: {
        padding: '0.5rem 0.75rem',
      },

      inputMultiline: {
        height: 'auto',
      },
    },

    MuiAutocomplete: {
      inputRoot: {
        '&[class*="MuiOutlinedInput-root"]': {
          padding: '0.1875rem !important',

          '& .MuiAutocomplete-input': {
            padding: '0 0.75rem !important',
            height: '1.75rem',
          },

          '& .MuiAutocomplete-tag': {
            '& + .MuiAutocomplete-input': {
              paddingLeft: '0.5rem !important',
            },
          },
        },
      },

      tag: {
        margin: '0.125rem',
        fontWeight: '600',
        fontSize: '0.625rem',
        lineHeight: '0.75rem',
        letterSpacing: '-0.02em',
        '& .MuiChip-deleteIcon': {
          color: secondaryColor,
          width: '0.875rem',
          height: '0.875rem',
        },
      },

      paper: {
        background: headerBg,
        border: `0.0625rem solid ${headerBorderColor}`,
        boxShadow: '0 0.75rem 2.5rem -0.25rem rgba(0, 0, 0, 0.3), 0 0.25rem 0.375 -0.125rem rgba(0, 0, 0, 0.2)',
        borderRadius: '0.375rem',
        margin: 0,
      },

      listbox: {
        padding: 0,
      },

      option: {
        padding: '0.625rem 1rem',
        fontWeight: 500,
        fontSize: '0.75rem',
        lineHeight: '1.0625rem',
        letterSpacing: '0.005em',
        color: headerButtonBorderColor,
        backgroundColor: 'transparent !important',
      },
    },

    MuiChip: {
      root: {
        height: '1.5rem',
        borderRadius: '0.25rem',
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
        color: chipDeleteIcon,
      },

      label: {
        padding: '0.375rem',
        fontWeight: '600',
        fontSize: '0.625rem',
        lineHeight: '0.75rem',
        letterSpacing: '-0.02em',
      },
    },

    MuiLinearProgress: {
      root: {
        borderRadius: '0.125rem',
      },

      colorPrimary: {
        backgroundColor: sidebarTextColor,
      },

      barColorPrimary: {
        backgroundColor: headerButtonBorderColor,
        borderRadius: '0.125rem',
      },
    },

    MuiMenu: {
      paper: {
        transform: 'translateY(2.25rem) !important',
        boxShadow: '0 0.75rem 2.5rem -0.25rem rgba(0, 0, 0, 0.3), 0 0.25rem 0.375rem -0.125rem rgba(0, 0, 0, 0.2)',
        maxWidth: '10rem',
        width: '100%',
        border: `0.0625rem solid ${headerBorderColor}`,
        background: headerBg,
        borderRadius: '0.375rem',
        padding: '0.75rem 0',
      },
    },

    MuiList: {
      padding: {
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
  },
}

export default createMuiTheme(theme);
