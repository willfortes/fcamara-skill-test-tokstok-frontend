import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { LogOut } from 'react-feather';
import styles from '../../styles/Template.module.css'
import { ToastContainer, toast } from 'react-toastify';
import api from '../../Api/api';

const Template = ({children}) => {
    const toastConfig = {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
      
    const notifySuccess = (msg) => toast(msg, toastConfig);
    const notifyError = (msg) => toast.error(msg, toastConfig);

    const [emailUser, setEmailUser] = useState("")

    const router = useRouter()

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("email_user")
        api.post('/users/auth/logout')
            .then((data) => {
                if (data.data.revoked) {
                    notifySuccess("Deslogado com sucesso!")
                    router.push('/')
                }
            }).catch(() => {
                notifyError("Não deslogado, tente novamente.");
              })
    }

    useEffect(() => {
        if (typeof localStorage !== 'undefined') {
            setEmailUser(localStorage.getItem("email_user"))
        }
    })

    return (
        <div className='container-fliud'>
            <ToastContainer />
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">FCamara - Tok&Stok</a>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link" aria-current="page" href="/providers">Fornecedores</a>
                            </li>
                        </ul>
                        <div className="d-flex">
                            {emailUser} <LogOut onClick={logout} className={styles.iconButton}/>
                        </div>
                    </div>
                </div>
                </nav>

            <div className='container pt-5'>
                {children}
            </div>
        </div>
    )
}

export default Template