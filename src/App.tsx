import {useTranslation} from "react-i18next";
import {Provider} from "react-redux";
import store from "./redux/store.ts";
import {RouterProvider} from "react-router-dom";
import {Flip, ToastContainer} from "react-toastify";

interface IApp {
    router: any,
}

export function App(props: IApp) {
    const {i18n} = useTranslation();

    return (
        <Provider store={store}>
            <div className="text-center text-3xl bg-black text-white h-screen w-screen">
                <RouterProvider router={props.router}/>
            </div>
            <ToastContainer
                position={"bottom-center"}
                autoClose={4000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick={false}
                rtl={i18n.language === 'he'}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover={false}
                theme={"colored"}
                transition={Flip}
            />
        </Provider>
    );
}