import React,{Fragment, useState, useContext} from 'react'
import Swal from 'sweetalert2'//Para alertas
import { useNavigate } from 'react-router-dom'; //Para hacer las redirecciones
import clienteAxios from '../../config/axios'

// import el Context
import { CRMContext } from '../context/CRMContext';


const NuevoCliente = () => {
    
    let navegate = useNavigate()
    // utilizar valores del context
    const [auth, guardarAuth ] = useContext( CRMContext );
    const [cliente, setCliente] = useState({
        nombre: '',
        apellido: '',
        empresa: '',
        email: '',
        telefono: '',
    })
    //leer los datos del formulario
    const actualizarState = e => {
        //Almacenar los que se escribe en el state.
        setCliente({
            //Obtener una copia del state actual
            ...cliente,
            [e.target.name] : e.target.value
        })
    }
    //Validar el formulario.
    const validarCliente =() => {
        //Destructuring
        const {nombre, apellido, email, empresa, telefono}=cliente;
        //Revisar que las propiedades del objeto cliente no esten vacias
        let valido = !nombre.length || !apellido.length || !email.length || !empresa.length || !telefono;
        return valido
    }
    //Añadir un cliente nuevo a la resapi manejo del submit
    const agregarCliente = e => {
        e.preventDefault();
        //enviar la peticion con el objeto cliente
        clienteAxios.post('/clientes', cliente).then(res => {
            //Validar si hay errores de mongo
            if(res.data.code === 11000){
                console.log('Error dato duplicado')
                Swal.fire({
                    type: 'error',
                    title: 'Hubo un error!',
                    text: 'Ese cliente ya existe', //leemos el mensaje enviado por backend
                    
                })
            } else {
                console.log(res.data)
                Swal.fire(
                    'Cliente agregado!',
                    res.data.mensaje, //leemos el mensaje enviado por backend
                    'success'
                )
            }
            //Si salio bien y se envio el cliente hacemos la redireccion
            navegate('/')
            

        })


    }

    // verificar si el usuario esta autenticado o no
    if(!auth.auth && (localStorage.getItem('token') === auth.token ) ) {
        navegate('/iniciar-sesion');
    }
  return (
    <Fragment>
        <h2>Nuevo Cliente</h2>
        <form onSubmit={agregarCliente}>
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input type="text"
                        placeholder="Nombre Cliente" 
                        name="nombre"
                        onChange={actualizarState}
                    />
                </div>

                <div className="campo">
                    <label>Apellido:</label>
                    <input type="text" 
                        placeholder="Apellido Cliente" 
                        name="apellido"
                        onChange={actualizarState}
                    />
                </div>
            
                <div className="campo">
                    <label>Empresa:</label>
                    <input type="text" 
                        placeholder="Empresa Cliente" 
                        name="empresa"
                        onChange={actualizarState}
                    />
                </div>

                <div className="campo">
                    <label>Email:</label>
                    <input type="email" 
                        placeholder="Email Cliente" 
                        name="email"
                        onChange={actualizarState}
                    />
                </div>

                <div className="campo">
                    <label>Teléfono:</label>
                    <input type="tel" 
                        placeholder="Teléfono Cliente" 
                        name="telefono"
                        onChange={actualizarState}
                    />
                </div>

                <div className="enviar">
                        <input type="submit" 
                            className="btn btn-azul" 
                            value="Agregar Cliente"
                            disabled={validarCliente()}
                        />
                </div>

        </form>
    </Fragment>
    
  )
}
//HOC es una funcion que toma un componente y retorna un nuevo componente
export default NuevoCliente