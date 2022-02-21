import { useEffect } from 'react';
import { useDataset } from '../../Shared/createDataset';
import { userObject } from '../../Shared/userObject';

const Template = ({children}) => {
    const [userData] = useDataset(userObject);

    useEffect(() => [
        console.log(userData)
    ], [userData])

    return (
        <div className='container-fliud'>
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
                            {userData.email}
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