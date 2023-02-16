import React, {useEffect, useState, Fragment, useContext} from 'react'
import { useNavigate } from 'react-router-dom'; //Para hacer las redirecciones
import { Link } from 'react-router-dom'
import clienteAxios from '../../config/axios'
import Spinner from '../layout/Spinner'

import Producto from './Producto'
// import el Context
import { CRMContext } from '../context/CRMContext';

const Productos = () => {
  let navegate = useNavigate()
  const [productos, setProductos] = useState([])
  // utilizar valores del context
  const [auth, guardarAuth ] = useContext( CRMContext );

  

  //useEffect para la consulta de la api
  useEffect(() => {
    if(auth.token !== '') {
      // Query a la API
      const consultarAPI = async () => {
          try {
              const productosConsulta = await clienteAxios.get('/productos', {
                  headers: {
                      Authorization : `Bearer ${auth.token}`
                  }
              });
              setProductos(productosConsulta.data);
          } catch (error) {
              // Error con authorizacion
              if(error.response.status = 500) {
                  navegate('/iniciar-sesion');
              }
          }
      }
      // llamado a la api
      consultarAPI();

  } else {
      navegate('/iniciar-sesion');
  }
  },[productos])//El useEffect esta pendiente si cambia productos para volver a hacer la consulta a la api
  //Si el state esta como false
  if(!auth.auth){
    navegate('/iniciar-sesion')
  }
  return (
    <Fragment>
      <h2>Productos</h2>
      <Link to={"/productos/nuevo"} className="btn btn-verde nvo-cliente"> <i className="fas fa-plus-circle"></i>
                Nuevo Producto
      </Link>
      
      { !productos.length && (
        <Spinner/>
      )}
    

            <ul className="listado-productos">
                {productos.map(producto => (
                  <Producto key={producto._id} producto={producto}/>
                ))}
            </ul>
      

    </Fragment>
    
  )
}

export default Productos