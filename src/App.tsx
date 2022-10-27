import React from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { AnimalItemEdit, AnimalItemList } from "./todo";
import { AnimalItemProvider } from "./todo/AnimalItemProvider";

const App: React.FC = () => (
  <IonApp>
    <AnimalItemProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/animal" component={AnimalItemList} exact={true} />
          <Route path="/animals" component={AnimalItemEdit} exact={true} />
          <Route path="/animals/:id" component={AnimalItemEdit} exact={true} />
          <Route exact path="/" render={() => <Redirect to="/animal" />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </AnimalItemProvider>
  </IonApp>
);

export default App;
