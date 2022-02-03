import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline, makeStyles } from "@material-ui/core";
import '@metacell/geppetto-meta-ui/flex-layout/style/dark.scss'
import HomePage from "./pages/HomePage";
import theme from "./theme";
import { Header, ErrorDialog, ProtectedRoute, } from "./components";
import ExperimentsPage from "./pages/ExperimentsPage";
// tslint:disable-next-line:no-var-requires
const Manager = require('@metacell/geppetto-meta-client/common/Manager').default;

const GEPPETTO = {};
// @ts-ignore
window.GEPPETTO = GEPPETTO;
// @ts-ignore
// tslint:disable-next-line:no-var-requires
GEPPETTO.Resources = require('@metacell/geppetto-meta-core/Resources').default;

// @ts-ignore
GEPPETTO.Manager = new Manager();
// @ts-ignore
window.Instances = [];

const useStyles = makeStyles(() => ({
  mainContainer: {
    overflow: "auto",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      height: "100vh",
      overflow: "hidden",
    }
  },
}));


export const App = (props: any) => {
  const classes = useStyles();

  return (
    // <SentryErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorDialog />
        {!props.error &&
          <Router>
            <div className={classes.mainContainer}>
              <Header />

              <Switch>
                <ProtectedRoute exact={true} path="/">
                  <HomePage />
                </ProtectedRoute>
                <ProtectedRoute exact={true} path="/experiments">
                  <ExperimentsPage />
                </ProtectedRoute>
              </Switch>

            </div>
          </Router>
        }
      </ThemeProvider>
    // </SentryErrorBoundary>
  );
};
