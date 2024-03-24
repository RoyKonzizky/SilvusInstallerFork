import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Sidebar from "./components/Sidebar.tsx";
import {Topology} from "./components/Pages/Topology/Topology.tsx";
import {Settings} from "./components/Pages/Settings/Settings.tsx";
import {Paths} from "./components/Paths.ts";
import {Provider} from "react-redux";
import store from "./redux/store.ts";

const router = createBrowserRouter([
    {
        path: Paths.Main,
        element: <><Sidebar/><Settings/></>,
    },
    {
        path: Paths.Topology,
        element: <><Sidebar/><Topology/></>,
    },
    {
        path: Paths.Photo,
        element: <><Sidebar/>PHOTO</>,
    },
    {
        path: Paths.Video,
        element: <><Sidebar/>VIDEO</>,
    },
    {
        path: Paths.Gallery,
        element: <><Sidebar/>GALLERY</>,
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <div className="text-center text-4xl bg-black text-white h-screen w-screen">
                <RouterProvider router={router}/>
            </div>
        </Provider>
    </React.StrictMode>,
)
