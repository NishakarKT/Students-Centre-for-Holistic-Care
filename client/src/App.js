import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// constants
import { HOME_ROUTE, SIGN_IN_ROUTE, SIGN_UP_ROUTE, PASS_RESET_ROUTE } from "./constants/routes";
// components
import Loader from "./components/loader/Loader";
// pages
const Home = lazy(() => import("./pages/home/Home"));
const SignIn = lazy(() => import("./pages/signIn/SignIn"));
const SignUp = lazy(() => import("./pages/signUp/SignUp"));
const PassReset = lazy(() => import("./pages/passReset/PassReset"));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route exact path={SIGN_IN_ROUTE} component={SignIn} />
          <Route exact path={SIGN_UP_ROUTE} component={SignUp} />
          <Route exact path={PASS_RESET_ROUTE} component={PassReset} />
          <Route path={HOME_ROUTE} component={Home} />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
