import React,{Fragment, useState, useEffect} from 'react'
import Swal from 'sweetalert2'//Para alertas
import { useNavigate,useParams } from 'react-router-dom'; //Para hacer las redirecciones
import clienteAxios from "../../config/axios";
import FormBuscarProducto from './FormBuscarProducto';
import FormCantidadProducto from './FormCantidadProductos';

const NuevoPedido = () => {
    let navegate = useNavigate()
    //Obtener el id del cliente
    const { id } = useParams();
    //State cliente
    const [cliente, setCliente] = useState({});
    const [busqueda, setBusqueda] = useState('');
    const [productos, setProductos] = useState([]);
    const [total, guardarTotal] = useState(0);

    useEffect(() => {
        //Obtener el cliente
        const consultarApi = async () => {
            //Obtener el cliente actual.
            const clientequery = await clienteAxios.get(`/clientes/${id}`)
            //Guardar el cliente en el state
            setCliente(clientequery.data)
        } 
        consultarApi();
        //Acualizar el total a pagar
        actualizarTotal();

    }, [productos]);

    const buscarProducto =async e => {
        e.preventDefault();
        //Obtener los datos de la busqueda.
        const result = await clienteAxios.post(`/productos/busqueda/${busqueda}`);
        //si no hay resultados una alerta sino agregamos el resultado al state
        if(result.data[0]){
            let productoResultado = result.data[0];
            //agregar la llave producto
            productoResultado.producto = result.data[0]._id;
            productoResultado.cantidad = 0
            //Coloacarlo en el state
            setProductos([...productos, productoResultado]);

        }else {
            //No hay resultados
            Swal.fire({
                type: 'error',
                title: 'Error',
                text:'No hay resultados'
            })
        }
    }
    const leerDatosBusqueda = e => {
        setBusqueda(e.target.value);
    }
    // actualizar la cantidad de productos
    const restarProductos = i => {
        // copiar el arreglo original de productos
        const todosProductos = [...productos];

        // validar si esta en 0 no puede ir mas alla
        if(todosProductos[i].cantidad === 0) return;

        // decremento
        todosProductos[i].cantidad--;

        // almacenarlo en el state
        setProductos(todosProductos);

        

    }

    const aumentarProductos = i => {
       // copiar el arreglo para no mutar el original
       const todosProductos = [...productos];

       // incremento
       todosProductos[i].cantidad++;

       // almacenarlo en el state
       setProductos(todosProductos);

       
    }

    // Elimina Un producto del state 
    const eliminarProductoPedido = id => {
        const todosProductos = productos.filter(producto => producto.producto !== id );

        setProductos(todosProductos)
    }

    // Actualizar el total a pagar
    const actualizarTotal = () => {
        // si el arreglo de productos es igual 0: el total es 0
        if(productos.length === 0) {
            guardarTotal(0);
            return;
        }

        // calcular el nuevo total
        let nuevoTotal = 0;

        // recorrer todos los productos, sus cantidades y precios
        productos.map(producto => nuevoTotal += (producto.cantidad * producto.precio)  );

        // almacenar el Total
        guardarTotal(nuevoTotal);
    }

    // Almacena el pedido en la BD
    const realizarPedido = async e => {
        e.preventDefault();


        // construir el objeto
        const pedido = {
            "cliente" : id, 
            "pedido" : productos, 
            "total" : total
        }

        // almacenarlo en la BD
        const resultado = await clienteAxios.post(`/pedidos/nuevo/${id}`, pedido);

        // leer resultado
        if(resultado.status === 200) {
            // alerta de todo bien
            Swal.fire({
                type: 'success',
                title: 'Correcto',
                text: resultado.data.mensaje
            })
        } else {
            // alerta de error
            Swal.fire({
                type: 'error',
                title: 'Hubo un Error',
                text: 'Vuelva a intentarlo'
            })
        }

        // redireccionar
        navegate('/pedidos');

    }
    return(
        <Fragment>
            <h2>Nuevo Pedido</h2>

                <div className="ficha-cliente">
                    <h3>Datos de Cliente</h3>
                    <p>Nombre: {cliente.nombre} {cliente.apellido}</p>
                    <p>Teléfono: {cliente.telefono}</p>
                </div>

                <FormBuscarProducto 
                    buscarProducto={buscarProducto}
                    leerDatosBusqueda={leerDatosBusqueda}
                />

                <ul className="resumen">
                    {productos.map((producto, index) => (
                        <FormCantidadProducto 
                            key={producto.producto}
                            producto={producto}
                            restarProductos={restarProductos}
                            aumentarProductos={aumentarProductos}
                            eliminarProductoPedido={eliminarProductoPedido}
                            index={index}
                        />
                    ))}

                </ul>

                
                <p className="total">Total a Pagar: <span>$ {total}</span> </p>


                { total > 0 ? (
                    <form
                        onSubmit={realizarPedido}
                    >
                        <input type="submit"
                              className="btn btn-verde btn-block"
                              value="Realizar Pedido" />
                    </form>
                ) : null }
        </Fragment>
    )
}

export default NuevoPedido