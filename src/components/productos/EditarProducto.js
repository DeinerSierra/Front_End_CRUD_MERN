import React, {useEffect, useState, Fragment} from 'react'
import {Link, useNavigate,useParams} from 'react-router-dom' //Para hacer las redirecciones
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import Spinner from '../layout/Spinner'

const EditarProducto = () => {
  let navegate = useNavigate()
  //Obtener el id del producto a editar
  const { id } = useParams();

  const [producto, setProducto]= useState({
    nombre: '',
    precio: '',
    imagen: ''
  })
  const [archivo, setArchivo] = useState('');
  //Consultar la api para traer el producto a editar
  const consultarApi = async () => {
    const query = await clienteAxios.get(`/productos/${id}`);
    //pasamos la consulta al state de producto.
    setProducto(query.data)
  }
  //Aqui usamos useEffect cuando cargue el componente mandar hacer la consulta.
  useEffect(() => {
    consultarApi();

  }, []);

  //leer los datos del formulario
  const leerFomulario = e => {
    setProducto({
      //Obtener una copia del state
      ...producto,
      [e.target.name]: e.target.value
    })
  }
  //Leer la imagen y colocarla en el state
  const leerArchivo = e => {
    //Para leer el arhcivo usamos e.target.files y lo pasamos al state
    setArchivo(e.target.files[0])
  }
  //Extraer los valores del state.
  const {nombre, precio, imagen} = producto
  const actualizarProducto =async e => {
    e.preventDefault();
    //Crear formdata para poder enviar la imagen 
    const formData = new FormData();
    formData.append('nombre', producto.nombre);
    formData.append('precio', producto.precio);
    formData.append('imagen', archivo);
    //Ahora lo enviamos para que se almacene
    try {
        const res = await clienteAxios.put(`/productos/${id}`, formData,{
          headers: {'Content-Type': 'multipart/form-data'},
        });
        //Lanzar alerta success
        if (res.status === 200) {
          Swal.fire(
            'Actualizado correctamente',
            res.data.mensaje,
            'success'
          )
        }
        //Redireccionar al cliente a productos
        //Si salio bien y se envio el cliente hacemos la redireccion
        navegate('/productos')


    } catch (error) {
        console.log(error);
        //Lanzar alerta
        Swal.fire({
          type: 'error',
          title: 'Error',
          text: 'Vuelve a intentarlo'
        })

    }
  }
  return (
    <>
      <h2>Editar Producto</h2>
      { !nombre && (
        <Spinner/>
      )}

      <form onSubmit={actualizarProducto}>
          <legend>Llena todos los campos</legend>

          <div className="campo">
              <label>Nombre:</label>
              <input type="text" 
                      placeholder="Nombre Producto" 
                      name="nombre"
                      defaultValue={nombre}
                      onChange={leerFomulario}
              />
          </div>

          <div className="campo">
              <label>Precio:</label>
              <input type="number" 
                      name="precio" min="0.00" 
                      step="0.01" placeholder="Precio" 
                      defaultValue={precio}
                      onChange={leerFomulario}
              />
          </div>

          <div className="campo">
              <label>Imagen:</label>
              {imagen ? (
                <img src={`http://localhost:5000/${imagen}`} alt="imagen" width="300"/>
              ): null}
              <input type="file"  
                      name="imagen" 
                      onChange={leerArchivo}
              />
          </div>

          <div className="enviar">
                  <input type="submit" className="btn btn-azul" value="Guardar Cambios"/>
          </div>
      </form>
    </>
  )
}

export default EditarProducto