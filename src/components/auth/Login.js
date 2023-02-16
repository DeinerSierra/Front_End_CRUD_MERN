import React,{useState, useContext} from 'react'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'; //Para hacer las redirecciones
import clienteAxios from "../../config/axios";
import { CRMContext } from '../context/CRMContext'
const Login = () => {
    //auth y token
    const [auth, guardarAuth] = useContext(CRMContext)
    let navegate = useNavigate()
    const [credenciales, setCredenciales] = useState({
        email: '',
        password: '',
    })
    const leerDatos = (e) => {
        setCredenciales({
            ...credenciales,
            [e.target.name] : e.target.value
        })
    }
    const iniciarSesion = async (e) => {
        e.preventDefault();
        try {
            const respuesta = await clienteAxios.post('/iniciar-sesion',credenciales)
            //extraer el token y colocarlo en localstorage
            const {token} = respuesta.data;
            localStorage.setItem('token',token);
            guardarAuth({
                token: token,
                auth: true
            })
            //lanzar una alerta success
            Swal.fire(
                'Login Correcto',
                'Has iniciado sesión',
                'success'
            )
            //Redireccionar
            navegate('/')
        } catch (error) {
            if(error.response){
                Swal.fire({
                    type: 'error',
                    title: 'Error',
                    text: error.response.data.mensaje
                })
            }else {
                Swal.fire({
                    type: 'error',
                    title: 'Error',
                    text: 'Hubo un error'
                })
            }           
        }
    }
  return (
    <div className='login'>
        <h2>Iniciar Sesión</h2>
        <div className='contenedor-formulario'>
            <form onSubmit={iniciarSesion}>
                <div className='campo'>
                    <label>Email:</label>
                    <input type='email' name='email' placeholder='Email de registro'
                            required onChange={leerDatos}/>
                </div>
                <div className='campo'>
                    <label>Password:</label>
                    <input type='password' name='password' placeholder='Password'
                            required onChange={leerDatos}/>
                </div>
                <input type='submit' value='Login' className='btn btn-verde btn-block'/>
            </form>
        </div>
    </div>
  )
}

export default Login