import {Routing} from "@/common/routing/Routing.tsx";
import {Header} from "@/common/components/Header/Header.tsx";
import s from "./App.module.css"


export const App = () => {
    return (
        <>
            <Header />
            <div className={s.layout}>
                <Routing />
            </div>
        </>
    )
}
