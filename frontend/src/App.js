//import logo from './logo.svg';
import { Route, Switch} from "react-router-dom";
import './App.css';
import VideoGrid from "./components/VideoGrid";
import VideoDetails from "./components/VideoDetails";

export const config = {
  endpoint: "https://5f9f12bd-1b22-4b58-aaf4-94d34e110e0e.mock.pstmn.io/v1",
}

function App() {

  return (
    <div className="App">
      <Switch>
    
        <Route exact path="/" component={VideoGrid} />
        <Route exact path="/video/:id" component={VideoDetails} /> 

      </Switch>
      
    </div>
  );
}

export default App;
