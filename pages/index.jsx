import { useRouter } from 'next/router'
import api from '../Api/api'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export default function Home() {
  const router = useRouter()
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

  const handleAuth = (event) => {
    event.preventDefault()

    const authUser = {
      email: event.target[0].value,
      password: event.target[1].value,
    }

    api.post('/users/auth', authUser)
      .then((data) => {
        localStorage.setItem('email_user', authUser.email)
        localStorage.setItem('token', data.data.token)
        api.defaults.headers.common = {'Authorization': `bearer ${data.data.token}`}
        notifySuccess("Autenticado com sucesso!");
        router.push('/providers')
      }).catch(() => {
        notifyError("Não autenticado, tente novamente.");
      })
  }

  return (
    <div className="w-100 mt-5 d-flex justify-content-center align-content-center">
      <ToastContainer />
      
      <form className="w-50" onSubmit={handleAuth}>
        <h2 className="mb-5">Faça seu login.</h2>

        <div className="mb-3">
          <label for="email" className="form-label">Seu e-mail</label>
          <input type="text" className="form-control" id="email" name="email"/>
        </div>
        <div className="mb-3">
          <label for="password" className="form-label">Senha</label>
          <input type="text" className="form-control" id="password" name="password"/>
        </div>
        <div className="d-flex gap-2 w-100">
          <button className="btn btn-primary w-100" type="submit">Entrar</button>
        </div>
      </form>
    </div>
  )
}
