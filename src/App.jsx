import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from './Components/Navigation';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import View from './Components/View';
import Edit from './Components/Edit';

function App() {

  return (
    <>
      <Navigation />
      <Router>
        <Routes>
          <Route element={<View />} path="/" />
          <Route element={<Edit />} path="/edit" />
        </Routes>
      </Router>
    </>
  )
}

export default App
