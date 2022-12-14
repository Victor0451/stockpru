import React, { useEffect, useState } from 'react'
import jsCookie from 'js-cookie';
import ListadoStock from '../../components/Stock/ListadoStock';
import axios from 'axios';
import toastr from 'toastr';
import Layout from '../../components/Layouts/Layout';
import moment from 'moment';
import Router from 'next/router'
import { registrarHistoria } from '../../utils/funciones'
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Button
} from '@chakra-ui/react'
import Link from 'next/link';
import { ip } from '../../config/config'


const Listado = () => {

    let categoriaRef = React.createRef()
    let cateCodRef = React.createRef()
    let proveedorRef = React.createRef()
    let marcaRef = React.createRef()
    let productoRef = React.createRef()
    let stockRef = React.createRef()
    let precioListaRef = React.createRef()
    let precioVentaRef = React.createRef()
    let codigoRef = React.createRef()
    let descripcionRef = React.createRef()
    let precioMayoristaRef = React.createRef()
    let fechaVencimientoRef = React.createRef()

    const [usuario, guardarUsuario] = useState(null)
    const [listado, guardarListado] = useState(null)
    const [errores, guardarErrores] = useState(null)
    const [imagen, guardarImagen] = useState(null);
    const [cate, guardarCate] = useState(null)
    const [provee, guardarProvee] = useState(null)
    const [idCate, guardarIdCate] = useState(null)
    const [show, guardarShow] = useState(false)


    const traerStock = async () => {


        await axios.get(`/api/stock/productos`, {
            params: {
                f: "todo"
            }
        })
            .then(res => {

                if (res.data.msg === "Productos Encontrados") {

                    toastr.success("Generando stock", "ATENCION")
                    guardarListado(res.data.body)

                } else if (res.data.msg === "No Hay Productos") {

                    toastr.warning("No hay productos registrados", "ATENCION")

                }

            })
            .catch(error => {
                console.log(error)

                toastr.danger("Ocurrio un error al registrar el producto", "ATENCION")
            })
    }

    const traerStock2 = async () => {

        if (cateCodRef.current.value !== "") {

            guardarShow(true)

        } else {

            guardarShow(false)
        }

        guardarIdCate(cateCodRef.current.value)

        if (cateCodRef.current.value === "todo") {

            await axios.get(`/api/stock/productos`, {
                params: {
                    f: "todo"
                }
            })
                .then(res => {

                    if (res.data.msg === "Productos Encontrados") {

                        toastr.success("Generando stock", "ATENCION")
                        guardarListado(res.data.body)

                    } else if (res.data.msg === "No Hay Productos") {

                        toastr.warning("No hay productos registrados", "ATENCION")


                    }

                })
                .catch(error => {
                    console.log(error)

                    toastr.danger("Ocurrio un error al registrar el producto", "ATENCION")
                })
        } else {

            await axios.get(`/api/stock/productos`, {
                params: {
                    f: "cate",
                    id: cateCodRef.current.value
                }
            })
                .then(res => {

                    if (res.data.msg === "Productos Encontrados") {

                        toastr.success("Generando stock", "ATENCION")
                        guardarListado(res.data.body)
                        console.log(res.data.body)


                    } else if (res.data === "No hay productos") {

                        toastr.warning("No hay productos registrados bajo esa categoria", "ATENCION")

                        guardarListado([])


                    }

                })
                .catch(error => {
                    console.log(error)

                    toastr.danger("Ocurrio un error al registrar el producto", "ATENCION")
                })
        }

    }

    const editarProducto = async (row) => {

        guardarErrores(null)

        let prod = {
            id: row.idproducto,
            categoria: categoriaRef.current.value,
            proveedor: proveedorRef.current.value,
            marca: marcaRef.current.value,
            producto: productoRef.current.value,
            precio_lista: precioListaRef.current.value,
            precio_venta: precioVentaRef.current.value,
            precio_mayorista: precioMayoristaRef.current.value,
            descripcion: descripcionRef.current.value,
            fecha_vencimiento: moment(fechaVencimientoRef.current.value).format('YYYY-MM-DD'),
            f: 'edicion'
        }

        if (prod.categoria === "") {
            guardarErrores("Debes elegir una categoria")
        } else if (prod.marca === "") {
            guardarErrores("Debes ingresar una marca")
        } else if (prod.producto === "") {
            guardarErrores("Debes ingresar un producto")
        } else if (prod.precio_lista === "") {
            guardarErrores("Debes ingresar el precio se lista")
        } else if (prod.precio_venta === "") {
            guardarErrores("Debes ingresar el precio se venta")
        } else if (prod.precio_lista === "") {
            guardarErrores("Debes ingresar el precio se lista")
        } else {

            await axios.put(`/api/stock/productos`, prod)
                .then(res => {

                    if (res.data.msg === "Producto Editado") {

                        toastr.success("El producto se registro correctamente", "ATENCION")

                        let accion = `Se edito el producto id: ${row.idproducto} con un stock actual de: ${row.stock}, precio de lista nuevo: ${prod.precio_lista} (precio de lista viejo ${row.precio_lista}) y precio de venta nuevo: ${prod.precio_venta} (precio de venta viejo ${row.precio_venta})`

                        let id = `PD - ${row.idproducto}`

                        registrarHistoria(accion, usuario, id)

                        setTimeout(() => {
                            traerStock()
                        }, 500);

                    }

                })
                .catch(error => {
                    console.log(error)

                    toastr.danger("Ocurrio un error al registrar el producto", "ATENCION")
                })
        }


    }

    const editarStock = async (row) => {

        let act = {
            id: row.idproducto,
            nustock: stockRef.current.value,
            fecha_reposicion: moment().format('YYYY-MM-DD HH:mm:ss'),

        }

        if (act.nustock === "") {

            guardarErrores("Debes ingresar el stock a actualizar")

        } else {
            await axios.put(`/api/stock/stock`, act)
                .then(res => {
                    console.log(res.data.body)
                    if (res.data.msg === "Stock Actualizado") {

                        toastr.success("El producto se actualizo correctamente", "ATENCION")

                        let accion = `Se edito el stock del producto id: ${row.idproducto} con un stock actual de: ${parseInt(act.nustock) + parseInt(row.stock)}. Stock anterior ${row.stock}`

                        let id = `PD - ${row.idproducto}`

                        registrarHistoria(accion, usuario, id)

                        setTimeout(() => {
                            traerStock()
                        }, 500);


                    }

                })
                .catch(error => {
                    console.log(error)

                    toastr.danger("Ocurrio un error al editar el stock", "ATENCION")
                })
        }

    }

    const bajaProducto = async (row) => {

        let prod = {
            id: row.idproducto,
            estado: 0,
            fecha_baja: moment().format('YYYY-MM-DD HH:mm:ss'),
            f: 'baja'
        }

        await axios.put(`/api/stock/productos`, prod)

            .then(res => {

                if (res.data.msg === "Producto Baja") {

                    toastr.success("El producto se dio de baja correctamente", "ATENCION")

                    let accion = `Se dio de baja al producto id: ${row.idproducto} con un stock de: ${row.stock}.`

                    let id = `PD - ${row.idproducto}`

                    registrarHistoria(accion, usuario, id)

                    setTimeout(() => {
                        traerStock()
                    }, 500);

                }

            })
            .catch(error => {
                console.log(error)

                toastr.danger("Ocurrio un error al dar de baja al stock", "ATENCION")
            })

    }

    const eliminarImagen = async (row) => {

        let file = row.imagen

        await axios
            .delete(`${ip}api/archivos/stock/eliminararchivos/${file}`)

            .then(res => {

                if (res.status === 200) {

                    toastr.success("El archivo se elimino", "ATENCION");

                    toastr.success("Se elimino la imagen del producto", "ATENCION")

                    let accion = `Se elimino la imagen del producto id: ${row.idproducto}.`

                    let id = `PD - ${row.idproducto}`

                    registrarHistoria(accion, usuario, id)

                    let b = {
                        id: row.idproducto,
                        f: 'imagennull'
                    }

                    axios.put('/api/stock/productos', b)

                    setTimeout(() => {

                        traerStock()

                    }, 500);

                } else if (res.data.msg === "Archivo Eliminado") {
                    toastr.success("Ocurrio un error", "ATENCION")
                    console.log(res.data.error)

                }

            })
            .catch(error => {
                console.log(error)

                toastr.danger("Ocurrio un error al dar de baja al stock", "ATENCION")
            })

    }

    const handlerArchivos = (event) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0];

            guardarImagen(i);
            setCreateObjectURL(URL.createObjectURL(i));
        }
    };

    const subirImagen = async (row) => {

        const body = new FormData();

        body.append("file", imagen);

        await axios
            .post(
                `${ip}api/archivos/stock/uploadimagen`,
                body
            )

            .then(res => {
                if (res.status === 200) {

                    let prod = {
                        id: row.idproducto,
                        imagen: `${imagen.name}`,
                        f: 'imagen'
                    }

                    axios.put('/api/stock/productos', prod)
                        .then(res => {
                            if (res.data.msg === "Imagen Subida") {

                                toastr.success("Se subio la imagen con exito", "ATENCION")

                                let accion = `Se subio una nueva imagen al producto id: ${row.idproducto}.`

                                let id = `PD - ${row.idproducto}`

                                registrarHistoria(accion, usuario, id)

                                setTimeout(() => {

                                    traerStock()

                                }, 500);

                            }
                        }).catch(error => {
                            console.log(error)
                        })
                }
            })
            .catch(error => {
                console.log(error)

                toastr.danger("Ocurrio un error al registrar el producto", "ATENCION")
            })

    };

    const traerCategorias = async () => {

        await axios.get(`/api/categorias/categoria`)

            .then(res => {

                if (res.data.msg === "Categorias Encontradas") {

                    guardarCate(res.data.body)

                } else if (res.data.msg === "No hay Categorias") {

                    toastr.warning("No hay categorias registradas", "ATENCION")

                }

            })
            .catch(error => {
                console.log(error)

                toastr.danger("Ocurrio un error al registrar el producto", "ATENCION")
            })


    }

    const traerProveedores = async () => {

        await axios.get(`/api/proveedores/proveedor`)

            .then(res => {

                if (res.data.msg === "Proveedores Encontrados") {

                    guardarProvee(res.data.body)

                } else if (res.data.msg === "No hay Proveedores") {

                    toastr.warning("No hay categorias registradas", "ATENCION")

                }

            })
            .catch(error => {
                console.log(error)

                toastr.danger("Ocurrio un error al registrar el producto", "ATENCION")
            })


    }

    const imprimir = (div) => {

        let contenido = document.getElementById(`${div}`).innerHTML;

        let contenidoOrg = document.body.innerHTML;

        document.body.innerHTML = contenido;

        window.print();

        document.body.innerHTML = contenidoOrg;

        Router.reload()

    };


    let token = jsCookie.get("token")

    useEffect(() => {
        if (!token) {
            Router.push("/redirect");
        } else {
            let usuario = jsCookie.get("usuario")
            guardarUsuario(usuario)

        }

        traerStock()
        traerCategorias()
        traerProveedores()

    }, []);




    return (
        <Layout>
            {listado ? (
                <ListadoStock
                    listado={listado}
                    categoriaRef={categoriaRef}
                    cateCodRef={cateCodRef}
                    proveedorRef={proveedorRef}
                    marcaRef={marcaRef}
                    productoRef={productoRef}
                    stockRef={stockRef}
                    precioListaRef={precioListaRef}
                    precioVentaRef={precioVentaRef}
                    codigoRef={codigoRef}
                    descripcionRef={descripcionRef}
                    precioMayoristaRef={precioMayoristaRef}
                    fechaVencimientoRef={fechaVencimientoRef}
                    editarProducto={editarProducto}
                    editarStock={editarStock}
                    bajaProducto={bajaProducto}
                    eliminarImagen={eliminarImagen}
                    handlerArchivos={handlerArchivos}
                    subirImagen={subirImagen}
                    errores={errores}
                    cate={cate}
                    provee={provee}
                    imprimir={imprimir}
                    traerStock2={traerStock2}
                    idCate={idCate}
                    show={show}
                />

            ) : (

                <Alert
                    mt="10"
                    mb="10"
                    status='info'
                    variant='subtle'
                    flexDirection='column'
                    alignItems='center'
                    justifyContent='center'
                    textAlign='center'
                    height='200px'
                >
                    <AlertIcon boxSize='40px' mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize='lg'>
                        ATENCION!
                    </AlertTitle>
                    <AlertDescription maxWidth='sm'>
                        Actualmente no se encuentra ningun producto registrado en la base de datos.
                        <Link href={'/stock/nuevo'}>
                            <Button colorScheme={"blue"} mt={4}>
                                Registrar Producto
                            </Button>
                        </Link>
                    </AlertDescription>
                </Alert>
            )}



        </Layout>

    )
}

export default Listado