import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Sidebar } from "./components/Sidebar/Sidebar.tsx";
import { Topology } from "./components/Pages/Topology/Topology.tsx";
import { Settings } from "./components/Pages/Settings/Settings.tsx";
import { Paths } from "./constants/Paths.ts";
import { Provider } from "react-redux";
import { Camera } from "./components/Pages/Camera/Camera.tsx";
import store from "./redux/store.ts";
import { Dashboard } from "./components/Pages/Dashboard/Dashboard.tsx";
import { Login } from "./components/Pages/Login/Login.tsx";
import './index.css';
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter([
    {
        path: Paths.Main,
        element: <><Sidebar /><Login /></>,
    },
    {
        path: Paths.Settings,
        element: <><Sidebar /><Settings isSmaller={false} /></>,
    },
    {
        path: Paths.Topology,
        element: <><Sidebar /><Topology isSmaller={false} /></>,
    },
    {
        path: Paths.Camera,
        element: <><Sidebar /><Camera /></>,
    },
    {
        path: Paths.Video,
        element: <><Sidebar />VIDEO</>,
    },
    {
        path: Paths.Gallery,
        element: <><Sidebar />GALLERY</>,
    },
    {
        path: Paths.Dashboard,
        element: <><Sidebar /><Dashboard /></>,
    }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <div className="text-center text-3xl bg-black text-white h-screen w-screen">
                <RouterProvider router={router} />
            </div>
            <ToastContainer
                position={"bottom-center"}
                autoClose={4000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick={false}
                rtl={true}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover={false}
                theme={"colored"}
                transition={Flip}
            />
        </Provider>
    </React.StrictMode>,
)
