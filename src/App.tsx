import './App.css'
import {BrowserRouter as Router} from 'react-router-dom';
import Sidebar from "./components/Sidebar.tsx";
import MyRoutes from "./components/MyRoutes.tsx";

function App() {

    return (
        <div className="text-center text-4xl bg-black text-white h-screen w-screen">
            <Router>
                <Sidebar/>
                <MyRoutes/>
            </Router>
        </div>
    )
}

export default App
