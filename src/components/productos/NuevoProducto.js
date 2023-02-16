import React,{Fragment, useState} from 'react'
import { useNavigate } from 'react-router-dom'; //Para hacer las redirecciones
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";

const NuevoProducto = () => {
  let navegate = useNavigate()
  const [producto, setProducto] = useState({
    nombre: '',
    precio: '',

  });
  const [archivo, setArchivo] = useState('');
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
  //Funcion para agregar el nuevo producto es async porque envia la peticion
  const agregarProducto =async e => {
    e.preventDefault();
    //Crear formdata para poder enviar la imagen 
    const formData = new FormData();
    formData.append('nombre', producto.nombre);
    formData.append('precio', producto.precio);
    formData.append('imagen', archivo);
    //Ahora lo enviamos para que se almacene
    try {
        const res = await clienteAxios.post('/productos', formData,{
          headers: {'Content-Type': 'multipart/form-data'},
        });
        //Lanzar alerta success
        if (res.status === 200) {
          Swal.fire(
            'Agregado correctamente',
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
      <h2>Nuevo Producto</h2>

      <form onSubmit={agregarProducto}>
          <legend>Llena todos los campos</legend>

          <div className="campo">
              <label>Nombre:</label>
              <input type="text" 
                      placeholder="Nombre Producto" 
                      name="nombre"
                      onChange={leerFomulario}
              />
          </div>

          <div className="campo">
              <label>Precio:</label>
              <input type="number" 
                      name="precio" min="0.00" 
                      step="0.01" placeholder="Precio" 
                      onChange={leerFomulario}
              />
          </div>

          <div className="campo">
              <label>Imagen:</label>
              <input type="file"  
                      name="imagen" 
                      onChange={leerArchivo}
              />
          </div>

          <div className="enviar">
                  <input type="submit" className="btn btn-azul" value="Agregar Producto"/>
          </div>
      </form>
    </>
  )
}

export default NuevoProducto