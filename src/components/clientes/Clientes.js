import React, {useEffect, useState, Fragment, useContext} from 'react'
import { useNavigate } from 'react-router-dom'; //Para hacer las redirecciones
import { Link } from 'react-router-dom'
import clienteAxios from '../../config/axios'
import Cliente from './Cliente'
import Spinner from '../layout/Spinner'
//Importar el context
import { CRMContext } from '../context/CRMContext'
const Clientes = () => {
  let navegate = useNavigate()
  const [clientes, setClientes] = useState([])
  //Utilizar el valor del context
  const [auth, guardarAuth] = useContext(CRMContext)
  //Funcion para consultar la api
  const consultarApi = async() => {
    
    try {
      const clientesConsulta = await clienteAxios.get('/clientes',{
        headers: {
          Authorization: 'Bearer ' + auth.token
        }
      })
      //Colocar el resultado en el state
      setClientes(clientesConsulta.data)
    } catch (error) {
      //Error con autenticacion
      if(error.response.status === 500){
        navegate('/iniciar-sesion')

      }
    }
    
  }
  //useEffect verifica los cambios en la app para llamar la funcion consultar api
  useEffect(() => {
    if(!auth.token !== ''){
      consultarApi();
    }else {
      navegate('/iniciar-sesion')
    }

    
  }, [clientes])//Cuando clientes cambie se vuelve hacer el llamado a la api

  //Si el state esta como false
  if(!auth.auth){
    navegate('/iniciar-sesion')
  }
  //Spinner de carga
  if (!clientes.length) {
    return <Spinner/>
  }
  
  return (
    <Fragment>
      <h2>Clientes</h2>
      <Link to={"/clientes/nuevo"} className="btn btn-verde nvo-cliente"> <i className="fas fa-plus-circle"></i>
                Nuevo Cliente
      </Link>
      <ul className="listado-clientes">
        {/*/Recorremos el state que contiene el listado clientes*/}
        {clientes.map(cliente => 
          <Cliente key={cliente._id} cliente={cliente}/>
        )}
      </ul>
    </Fragment>
  )
}

export default Clientes