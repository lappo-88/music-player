import {Routing} from "@/common/routing/Routing.tsx";
import {Header} from "@/common/components/Header/Header.tsx";
import s from "./App.module.css"
import {ToastContainer} from "react-toastify";
import {useGlobalLoading} from "@/common/hooks";
import {LinearProgress} from "@/common/components";


export const App = () => {

    const isGlobalLoading = useGlobalLoading()

    return (
        <>
            <Header />
            {isGlobalLoading && <LinearProgress />}
            <div className={s.layout}>
                <Routing />
            </div>
            <ToastContainer />

        </>
    )
}
