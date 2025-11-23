import {Link, NavLink } from 'react-router'
import { Path } from '@/common/routing/Routing'
import s from './Header.module.css'
import {useGetMeQuery, useLogoutMutation} from "@/features/auth/api/authApi.ts";
import {Login} from "@/features/auth/ui/Login/Login.tsx";



export const Header = () => {

    const { data } = useGetMeQuery()
    const [logout] = useLogoutMutation()
    const logoutHandler = ()=> logout()

    const navItems = [
        { to: Path.Main, label: 'Main' },
        { to: Path.Playlists, label: 'Playlists' },
        { to: Path.Tracks, label: 'Tracks' },
    ]



    return (
        <header className={s.container}>
            <nav>
                <ul className={s.list}>
                    {navItems.map(item => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) => `link ${isActive ? s.activeLink : ''}`}
                            >
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            {data && (
                <div className={s.loginContainer}>
                    <Link to={Path.Profile}> </Link>
                    <button onClick={logoutHandler}>logout</button>
                </div>
            )}
            {!data && <Login />}
        </header>
    )
}