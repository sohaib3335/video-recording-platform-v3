import logo from "./logo.svg";
import "./App.css";
import VideoRecorder from "./component/VideoRecorder";
import AdminDashboard from "./component/AdminDashboard";
import AppStreamCam from "./component/CameraStream";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router basename="/front-end/">
      <div className="App">
        <header className="App-header">
          <h1>Video Recording Platform - V3 </h1>
        </header>
        <nav>
          <ul className="NavItems">
            <li >
              <Link to="/">
                Home <hr />
              </Link>
            </li>
            <li >
              <Link to="/admin-dasboard">
                Admin Dashboard <hr />
              </Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/admin-dasboard">
            <AdminDashboard />
          </Route>
          <Route exact path="/">
            <VideoRecorder />
          </Route>
          <Route path="*">404 Not Found</Route>
        </Switch>


        
      </div>
    </Router>
  );
}

export default App;
