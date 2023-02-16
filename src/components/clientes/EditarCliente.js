import React,{Fragment, useState, useEffect} from 'react'
import Swal from 'sweetalert2'//Para alertas
import { useNavigate,useParams } from 'react-router-dom'; //Para hacer las redirecciones
import clienteAxios from '../../config/axios'


const EditarCliente = (props) => {
    
    let navegate = useNavigate()
    //Obtener el id
    const { id } = useParams();
    
    const [cliente, setCliente] = useState({
        nombre: '',
        apellido: '',
        empresa: '',
        email: '',
        telefono: '',
    })
    //Query a la api
    const consultarApi =async () => {
        const query = await clienteAxios.get(`/clientes/${id}`)
        //colocar los datos en el state
        setCliente(query.data);
    }

    //UseEffect cuando cargue el componente
    useEffect(() => {
        consultarApi();
    }, []);
    
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
    const actualizarCliente = e => {
        e.preventDefault();
        clienteAxios.put(`/clientes/${cliente._id}`, cliente).then((res) => {
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
                    'Correcto',
                    'Actualizado correctamente', //leemos el mensaje enviado por backend
                    'success'
                )
            }
            //Si salio bien y se envio el cliente hacemos la redireccion
            navegate('/')
            

        })

    }
    
  return (
    <Fragment>
        <h2>Editar Cliente</h2>
        <form onSubmit={actualizarCliente}>
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input type="text"
                        placeholder="Nombre Cliente" 
                        name="nombre"
                        onChange={actualizarState}
                        value={cliente.nombre}
                    />
                </div>

                <div className="campo">
                    <label>Apellido:</label>
                    <input type="text" 
                        placeholder="Apellido Cliente" 
                        name="apellido"
                        onChange={actualizarState}
                        value={cliente.apellido}
                    />
                </div>
            
                <div className="campo">
                    <label>Empresa:</label>
                    <input type="text" 
                        placeholder="Empresa Cliente" 
                        name="empresa"
                        onChange={actualizarState}
                        value={cliente.empresa}
                    />
                </div>

                <div className="campo">
                    <label>Email:</label>
                    <input type="email" 
                        placeholder="Email Cliente" 
                        name="email"
                        onChange={actualizarState}
                        value={cliente.email}
                    />
                </div>

                <div className="campo">
                    <label>Teléfono:</label>
                    <input type="tel" 
                        placeholder="Teléfono Cliente" 
                        name="telefono"
                        onChange={actualizarState}
                        value={cliente.telefono}
                    />
                </div>

                <div className="enviar">
                        <input type="submit" 
                            className="btn btn-azul" 
                            value="Guardar Cambios"
                            disabled={validarCliente()}
                        />
                </div>

        </form>
    </Fragment>
    
  )
}
//HOC es una funcion que toma un componente y retorna un nuevo componente
export default EditarCliente