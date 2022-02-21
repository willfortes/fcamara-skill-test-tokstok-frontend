import { useRouter } from 'next/router'
import { useEffect, useLayoutEffect, useState } from 'react'
import api from '../Api/api'
import Template from '../Components/Template'
import { Eye, Edit3, Trash2, X, Plus } from 'react-feather';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import checkUserAuth from '../helpers/checkUserAuth';

import { Modal } from "react-bootstrap"

import styles from '../styles/Providers.module.css'

const Providers = () => {
  const router = useRouter()

  useLayoutEffect(() => {
    const email_user = localStorage.getItem('email_user')
    const token = localStorage.getItem('token')
    const isLogged = checkUserAuth(token, email_user)
    if (!isLogged) {
      router.push('/')
    }
  })

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

  const requestAllProvider = () => {
    api.get('/providers/all')
    .then((providers) => {
        setProviders(providers.data)
    })
  }

  const [modalDelShow, setModalDelShow] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [modalEditShow, setModalEditShow] = useState(false)
  const [modalCreateShow, setModalCreateShow] = useState(false)

  const [providerSelected, setProviderSelected] = useState({})
  const [providers, setProviders] = useState([])

  const handleShow = (providerSelected) => {
    setProviderSelected(providerSelected)
    setModalShow(true)
  }

  const modelEditOpen = (providerSelected) => {
    setProviderSelected(providerSelected)
    setModalEditShow(true)
  }

  const openModalDelete = (providerSelected) => {
    setProviderSelected(providerSelected)
    setModalDelShow(true)
  }

  const handleUpdate =  (event) => {
    event.preventDefault()

    const updateProvider = {
      id: event.target[0].value,
      cnpj: event.target[1].value,
      name: event.target[2].value,
      corporate_name: event.target[3].value,
      segment: event.target[4].value,
      address: event.target[5].value,
      telephone: event.target[6].value,
      email: event.target[7].value
    }

    console.log(updateProvider)

    api.patch('/providers/update', updateProvider)
          .then(() => {
            setModalEditShow(!modalEditShow)
            notifySuccess("Atualizado com sucesso!");
            requestAllProvider()
          }).catch(() => {
            notifyError("Não atualizado, tente novamente.");
          })
  }
  
  const handleCreate =  (event) => {
    event.preventDefault()

    const createProvider = {
      cnpj: event.target[0].value,
      name: event.target[1].value,
      corporate_name: event.target[2].value,
      segment: event.target[3].value,
      address: event.target[4].value,
      telephone: event.target[5].value,
      email: event.target[6].value
    }

    api.post('/providers/create', createProvider)
          .then(() => {
            setModalCreateShow(!modalCreateShow)
            notifySuccess("Cadastrado com sucesso!");
            requestAllProvider()
          }).catch(() => {
            notifyError("Não cadastrado, tente novamente!");
          })
  }

  const handleDelete = (id) => {
    api.delete(`/providers/delete/${id}`)
          .then(() => {
            setModalDelShow(!modalDelShow)
            setProviderSelected({})
            notifySuccess("Deletado com sucesso!");
            requestAllProvider()
          }).catch(() => {
            notifyError("Não deletado, tente novamente!");
          })
  }

  useEffect(() => {
    requestAllProvider()
  }, [])

  return (
      <Template>
          <ToastContainer />
          <div className="d-flex justify-content-between mb-3">
            <h2>Fornecedores</h2>
            <button className="btn btn-primary" type="button" onClick={() => setModalCreateShow(true)}><Plus /></button>
          </div>
          <table className="table table-success table-striped">
              <thead>
                  <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Nome</th>
                      <th scope="col">CNPJ</th>
                      <th scope="col">Seguimento</th>
                      <th scope="col"></th>
                  </tr>
              </thead>
              <tbody>
                { providers &&
                  providers.map((provider) => (
                    <tr>
                      <th scope="row">{provider.id}</th>
                      <td>{provider.name}</td>
                      <td>{provider.cnpj}</td>
                      <td>{provider.segment}</td>
                      <td>
                        <ul className="list-inline">
                          <li className="list-inline-item">
                            <span className={styles.iconButton} onClick={() => handleShow(provider)}>
                              <Eye />
                            </span>
                          </li>
                          <li className="list-inline-item">
                            <span className={styles.iconButton} onClick={() => modelEditOpen(provider)}>
                              <Edit3 />
                            </span>
                          </li>
                          <li className="list-inline-item">
                            <span className={styles.iconButton} onClick={() => openModalDelete(provider)}>
                              <Trash2 />
                            </span>
                          </li>
                        </ul>
                      </td>
                  </tr>
                  ))
                }
              </tbody>
          </table>

          { /* Modal Delete */ }
          <Modal show={modalDelShow} centered >
            <Modal.Header>Excluir? <X className={styles.iconButton} onClick={() => setModalDelShow(!modalDelShow)}/></Modal.Header>
            <Modal.Body>
              <ul>
                <li><b>CNPJ:</b> {providerSelected.cnpj}</li>
                <li><b>Nome:</b> {providerSelected.name}</li>
              </ul>
            </Modal.Body>
            <Modal.Footer>
              <div className="d-flex gap-2 w-100">
                <button className="btn btn-primary w-100" type="button" onClick={() => handleDelete(providerSelected.id)}>Sim</button>
                <button className="btn btn-danger w-100" type="button" onClick={() => setModalDelShow(!modalDelShow)}>Não</button>
              </div>
            </Modal.Footer>
          </Modal>

          { /* Modal View */ }
          <Modal show={modalShow} centered >
            <Modal.Header>Visualizar <X className={styles.iconButton} onClick={() => setModalShow(!modalShow)}/></Modal.Header>
            <Modal.Body>
              <ul>
                <li><b>CNPJ:</b> {providerSelected.cnpj}</li>
                <li><b>Nome:</b> {providerSelected.name}</li>
                <li><b>Razão social:</b> {providerSelected.corporate_name}</li>
                <li><b>Seguimento:</b> {providerSelected.segment}</li>
                <hr/>
                <li><b>Endereço:</b> {providerSelected.address}</li>
                <hr/>
                <li><b>E-mail:</b> {providerSelected.email}</li>
                <li><b>Fone:</b> {providerSelected.telephone}</li>
              </ul>
            </Modal.Body>
          </Modal>
          
          { /* Modal Edit */ }
          <Modal show={modalEditShow} centered >
            <Modal.Header>Editar <X className={styles.iconButton} onClick={() => setModalEditShow(!modalEditShow)}/></Modal.Header>
            <Modal.Body>
              <form onSubmit={handleUpdate}>
                <input type="hidden" name="id" value={providerSelected.id}/>
                <div className="mb-3">
                  <label for="cnpj" className="form-label">CNPJ</label>
                  <input type="text" className="form-control" id="cnpj" onChange={(e) => setProviderSelected({...providerSelected, cnpj: e.target.value})} name="cnpj" value={providerSelected.cnpj}/>
                </div>
                <div className="mb-3">
                  <label for="name" ClassName="form-label">Nome</label>
                  <input type="text" className="form-control" id="name" onChange={(e) => setProviderSelected({...providerSelected, name: e.target.value})} name="name" value={providerSelected.name}/>
                </div>
                <div className="mb-3">
                  <label for="corporate_name" className="form-label">Razão social</label>
                  <input type="text" className="form-control" id="corporate_name" onChange={(e) => setProviderSelected({...providerSelected, corporate_name: e.target.value})} name="corporate_name" value={providerSelected.corporate_name}/>
                </div>
                <div className="mb-3">
                  <label for="segment" className="form-label">Seguimento</label>
                  <input type="text" className="form-control" id="segment" name="segment" onChange={(e) => setProviderSelected({...providerSelected, segment: e.target.value})} value={providerSelected.segment}/>
                </div>
                <div className="mb-3">
                  <label for="address" className="form-label">Endereço</label>
                  <input type="text" className="form-control" id="address" name="address" onChange={(e) => setProviderSelected({...providerSelected, address: e.target.value})} value={providerSelected.address}/>
                </div>
                <div className="mb-3">
                  <label for="telephone" className="form-label">Telefone</label>
                  <input type="text" className="form-control" id="telephone" name="telephone" onChange={(e) => setProviderSelected({...providerSelected, telephone: e.target.value})} value={providerSelected.telephone}/>
                </div>
                <div className="mb-3">
                  <label for="email" className="form-label">E-mail</label>
                  <input type="email" className="form-control" id="email" name="email" onChange={(e) => setProviderSelected({...providerSelected, email: e.target.value})} value={providerSelected.email}/>
                </div>
                <div className="d-flex gap-2 w-100">
                  <button className="btn btn-primary w-100" type="submit">Salvar</button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
          
          { /* Modal Create */ }
          <Modal show={modalCreateShow} centered >
            <Modal.Header>Cadastrar <X className={styles.iconButton} onClick={() => setModalCreateShow(!modalCreateShow)}/></Modal.Header>
            <Modal.Body>
              <form onSubmit={handleCreate}>
                <div className="mb-3">
                  <label for="cnpj" className="form-label">CNPJ</label>
                  <input type="text" className="form-control" id="cnpj" name="cnpj"/>
                </div>
                <div className="mb-3">
                  <label for="name" className="form-label">Nome</label>
                  <input type="text" className="form-control" id="name" name="name"/>
                </div>
                <div className="mb-3">
                  <label for="corporate_name" className="form-label">Razão social</label>
                  <input type="text" className="form-control" id="corporate_name" name="corporate_name"/>
                </div>
                <div className="mb-3">
                  <label for="segment" className="form-label">Seguimento</label>
                  <input type="text" className="form-control" id="segment" name="segment"/>
                </div>
                <div className="mb-3">
                  <label for="address" className="form-label">Endereço</label>
                  <input type="text" className="form-control" id="address" name="address"/>
                </div>
                <div className="mb-3">
                  <label for="telephone" className="form-label">Telefone</label>
                  <input type="text" className="form-control" id="telephone" name="telephone"/>
                </div>
                <div className="mb-3">
                  <label for="email" className="form-label">E-mail</label>
                  <input type="email" className="form-control" id="email" name="email"/>
                </div>
                <div className="d-flex gap-2 w-100">
                  <button className="btn btn-primary w-100" type="submit">Salvar</button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
      </Template>
  )
}

export default Providers