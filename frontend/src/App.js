import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import HomeSpotsPage from "./components/HomeAllSpots";
import SpotForm from "./components/SpotForm";
import SpotEditing from "./components/EditSpot";
import SingleSpotDetails from "./components/ASpotDetailPage";
import ReviewForm from "./components/CreateReview";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <HomeSpotsPage />
          </Route>
          <Route exact path="/spots/new">
            <SpotForm />
          </Route>
          <Route exact path="/spots/:spotId/edit">
            <SpotEditing />
          </Route>
          <Route exact path="/spots/:spotId">
            <SingleSpotDetails />
          </Route>
          <Route exact path="/spots/:spotId/review">
            <ReviewForm />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
