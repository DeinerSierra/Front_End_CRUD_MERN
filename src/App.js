import React,{Fragment, useContext} from "react";
import { BrowserRouter,Routes,Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Navegacion from "./components/layout/Navegacion";

import Clientes from "./components/clientes/Clientes";
import NuevoCliente from "./components/clientes/NuevoCliente";
import EditarCliente from "./components/clientes/EditarCliente";

import Pedidos from "./components/pedidos/Pedidos";
import NuevoPedido from "./components/pedidos/NuevoPedido";

import Productos from "./components/productos/Productos";
import NuevoProducto from "./components/productos/NuevoProducto";
import EditarProducto from "./components/productos/EditarProducto";

import Login from "./components/auth/Login";

import { CRMContext, CRMProvider } from "./components/context/CRMContext";



function App() {
  //Utilizar context en el componente
  const [auth, guardarAuth] = useContext(CRMContext);
  return (
    <BrowserRouter>
      <Fragment>
        <CRMProvider value={[auth, guardarAuth]}>
          <Header/>
          <div className="grid contenedor contenido-principal">
            <Navegacion/>
            <main className="caja-contenido col-9">
              {/*Routing a los diferentes componentes*/}
              
                <Routes>
                  <Route path="/" element={<Clientes/>} />
                  <Route path="/clientes/nuevo" element={<NuevoCliente/>}/>
                  <Route path="/cliente/editar/:id" element={<EditarCliente/>}/>

                  <Route path="/productos" element={<Productos/>} />
                  <Route path="/productos/nuevo" element={<NuevoProducto/>} />
                  <Route path="/productos/editar/:id" element={<EditarProducto/>} />

                  <Route path="/pedidos" element={<Pedidos/>} />
                  <Route path="/pedidos/nuevo/:id" element={<NuevoPedido/>} />

                  <Route path="/iniciar-sesion" element={<Login/>}/>
                </Routes>
                
              
            </main>
          </div>
        </CRMProvider>
      </Fragment>
    </BrowserRouter>
  );
    
}

export default App;
