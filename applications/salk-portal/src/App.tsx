import React, {useState} from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline, makeStyles } from "@material-ui/core";
import '@metacell/geppetto-meta-ui/flex-layout/style/dark.scss'
import HomePage from "./pages/HomePage";
import theme from "./theme";
import { Header, ProtectedRoute, } from "./components";
import ExperimentsPage from "./pages/ExperimentsPage";

const GEPPETTO = {};
// @ts-ignore
window.GEPPETTO = GEPPETTO;
// @ts-ignore
// tslint:disable-next-line:no-var-requires
GEPPETTO.Resources = require('@metacell/geppetto-meta-core/Resources').default;

// @ts-ignore
// tslint:disable-next-line:no-var-requires
GEPPETTO.Manager = require('@metacell/geppetto-meta-client/common/GeppettoManager').default;
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
  const [latestExperimentId, setLatestExperimentId] = useState(null)

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {!props.error &&
          <Router>
            <div className={classes.mainContainer}>
              <Header onExperimentCreation={setLatestExperimentId}/>

              <Switch>
                <ProtectedRoute exact={true} path="/">
                  <HomePage latestExperimentId={latestExperimentId} />
                </ProtectedRoute>
                <ProtectedRoute exact={true} path="/experiments/:id">
                  <ExperimentsPage />
                </ProtectedRoute>
              </Switch>

            </div>
          </Router>
        }
      </ThemeProvider>
  );
};
