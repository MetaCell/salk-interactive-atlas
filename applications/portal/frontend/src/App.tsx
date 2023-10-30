import React, {useEffect, useState} from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline, makeStyles } from "@material-ui/core";
import '@metacell/geppetto-meta-ui/flex-layout/style/dark.scss'
import HomePage from "./pages/HomePage";
import theme from "./theme";
import { Header, ProtectedRoute, } from "./components";
import ExperimentsPage from "./pages/ExperimentsPage";
import {EXPERIMENTS_ROUTE} from "./utilities/constants";
import workspaceService from "./service/WorkspaceService";
import {Population} from "./apiclient/workspaces";
import {getCells} from "./helpers/CellsHelper";
// @ts-ignore
import Loader from "@metacell/geppetto-meta-ui/loader/Loader";

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
  const [loading, setLoading] = useState(true);
  const [residentialPopulations, setResidentialPopulations] = useState({});

  const api = workspaceService.getApi()

  useEffect(() => {
    // Fetch residential populations when component mounts
    api.residentialPopulation().then(res => {
      const populationsPromises = res.data.map((population: Population) => {
        // Fetch the cells for each residential population
        return getCells(api, population).then(cells => {
          // Return an object with both the population data and the cells
          return { ...population, cells };
        });
      });

      // Use Promise.all to wait for all the promises to resolve
      Promise.all(populationsPromises).then(populationsWithCells => {
        const residentialPopulationsObject = populationsWithCells.reduce((obj: any, population) => {
          obj[population.id] = population;
          return obj;
        }, {});
        setResidentialPopulations(residentialPopulationsObject);
        setLoading(false);
      });
    });
  }, []);

  const onExperimentCreation = (id: string) => {
    setLatestExperimentId(id)
  }

  // todo: Filter residentialPopulations by selected atlas

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {!props.error &&
          <Router>
            <div className={classes.mainContainer}>
              <Header onExperimentCreation={(id: string) => onExperimentCreation(id)}/>
              <Switch>
                {loading ? <Loader/> : (
                    <>
                      <ProtectedRoute exact={true} path="/">
                        <HomePage latestExperimentId={latestExperimentId} onExperimentChange={(id: string) => setLatestExperimentId(id)}/>
                      </ProtectedRoute>
                      <ProtectedRoute exact={true} path={EXPERIMENTS_ROUTE}>
                        <ExperimentsPage residentialPopulations={residentialPopulations} />
                      </ProtectedRoute>
                    </>
                )}
              </Switch>

            </div>
          </Router>
        }
      </ThemeProvider>
  );
};
