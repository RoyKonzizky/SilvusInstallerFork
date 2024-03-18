import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import App from "./App.tsx";
import Settings from "./components/Settings/Settings.tsx";
import Sidebar from "./components/Sidebar/Sidebar.tsx";
import store from "./redux/store";
import {Provider} from "react-redux";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
    },
    {
        path: "/settings",
        element: <><Settings/></>,
    },
    {
        path: "/topology",
        element: <>TOPOLOGY</>,
    },
    {
        path: "/camera",
        element: <>CAMERA</>,
    },
    {
        path: "/filmmaker",
        element: <>FILMMAKER</>,
    },
    {
        path: "/gallery",
        element: <>GALLERY</>,
    },
]);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <div className="text-center text-4xl bg-black text-white h-screen w-screen relative">
            <Provider store={store}>
                <Sidebar/>
                <RouterProvider router={router}/>
            </Provider>
        </div>
    </React.StrictMode>,
)
