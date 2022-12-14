import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import jsCookie from 'js-cookie'
import Layout from '../../components/Layouts/Layout'
import axios from 'axios'
import toastr from 'toastr'
import moment from 'moment'
import { registrarHistoria } from '../../utils/funciones'
import { confirmAlert } from 'react-confirm-alert'; // Import
import ListadoClientes from '../../components/clientes/ListadoClientes'
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Button,
} from '@chakra-ui/react'
import Link from 'next/link'


const listado = () => {

    let nombreRef = React.createRef()
    let apellidoRef = React.createRef()
    let dniRef = React.createRef()
    let telefonoRef = React.createRef()
    let direccionRef = React.createRef()
    let detalleRef = React.createRef()
    let pagoRef = React.createRef()

    const [usuario, guardarUsuario] = useState(null)
    const [clientes, guardarClientes] = useState([])
    const [cuentas, guardarCuentas] = useState([])
    const [detalles, guardarDetalles] = useState([])
    const [errores, guardarErrores] = useState(null)
    const [deuda, guardarDeduda] = useState(0)

    let token = jsCookie.get("token")

    useEffect(() => {
        if (!token) {
            Router.push("/redirect");
        } else {
            let usuario = jsCookie.get("usuario")
            guardarUsuario(usuario)

            traerClientes()

        }

    }, []);

    const traerClientes = async () => {

        await axios.get(`/api/clientes/cliente`, {
            params: {
                f: "clientes"
            }
        })
            .then(res => {

                if (res.data.msg === "Clientes Encontrados") {

                    guardarClientes(res.data.body)

                    toastr.success("Generando listado de clientes", "ATENCION")

                } else if (res.data === "No Hay Clientes") {

                    toastr.info("No hay clientes registrados", "ATENCION")

                }
            })
            .catch(error => {
                console.log(error)
            })

    }

    const editarCliente = async (row) => {

        guardarErrores(null)

        let datos = {
            nombre: nombreRef.current.value,
            apellido: apellidoRef.current.value,
            telefono: telefonoRef.current.value,
            direccion: direccionRef.current.value,
            detalle: detalleRef.current.value,
            f: "edicion",
            id: row.idcliente

        }

        if (apellidoRef.current.value === "") {

            guardarErrores("Debes ingresar el apellido")

        } else if (nombreRef.current.value === "") {

            guardarErrores("Debes ingresar el nombre")

        } else {

            await axios.put('/api/clientes/cliente/', datos)
                .then(res => {

                    if (res.data.msg === 'Cliente Editado') {

                        toastr.success("El cliente fue editado con exito", "ATENCION")

                        let accion = `Se edito el cliente id: ${row.idcliente} - ${row.apellido}, ${row.nombre}. DNI ${row.dni}.`

                        let id = `CL - ${row.idcliente}`

                        registrarHistoria(accion, usuario, id)

                        setTimeout(() => {
                            traerClientes()
                        }, 500);

                    }

                })

                .catch(error => {
                    console.log(error)
                    toastr.error("Ocurrio un error al registrar el usuario")

                })
        }
    }

    const activarCliente = async (row) => {

        const datos = {
            f: 'activar',
            reactivacion: moment().format('YYYY-MM-DD HH:mm:ss'),
            estado: 1,
            id: row.idcliente
        }

        await axios.put('/api/clientes/cliente/', datos)
            .then(res => {

                console.log(res.data.body)


                if (res.data.msg === 'Cliente Activado') {

                    toastr.success("El cliente fue activado con exito", "ATENCION")

                    let accion = `Se activo el cliente id: ${row.idcliente} - ${row.apellido}, ${row.nombre}. DNI ${row.dni}.`

                    let id = `CL - ${row.idcliente}`

                    registrarHistoria(accion, usuario, id)

                    setTimeout(() => {
                        traerClientes()
                    }, 500);

                }

            })

            .catch(error => {
                console.log(error)
                toastr.error("Ocurrio un error al registrar el usuario")

            })

    }

    const bajaCliente = async (row) => {

        const datos = {
            f: 'baja',
            estado: 0,
            fecha_baja: moment().format('YYYY-MM-DD HH:mm:ss'),
            id: row.idcliente
        }

        await axios.put('/api/clientes/cliente/', datos)
            .then(res => {

                if (res.data.msg === 'Cliente Baja') {

                    toastr.success("El cliente fue dado de baja con exito", "ATENCION")

                    let accion = `Se dio de baja el cliente id: ${row.idcliente} - ${row.apellido}, ${row.nombre}. DNI ${row.dni}.`


                    let id = `CL - ${row.idcliente}`

                    registrarHistoria(accion, usuario, id)

                    setTimeout(() => {
                        traerClientes()
                    }, 500);

                }

            })

            .catch(error => {
                console.log(error)
                toastr.error("Ocurrio un error al registrar el usuario")

            })

    }

    const traerCuenta = async (row) => {

        await axios.get(`/api/cuentas/cuenta`,
            {
                params: {
                    f: 'cuenta',
                    idcliente: row.idcliente
                }
            })
            .then(res => {

                if (res.data.msg === 'Cuenta Encontrada') {

                    guardarCuentas(res.data.body)

                    toastr.success("Cuentas encontradas, generando listado", "ATENCION")

                } else if (res.data === 'No Hay Cuenta') {

                    guardarCuentas([])

                    toastr.info("El cliente no posee cuentas activas", "ATENCION")

                }

            })
            .catch(error => {
                console.log(error)
            })


    }

    const traerDetallesCuenta = async (row) => {

        await axios.get(`/api/cuentas/cuenta`,
            {
                params: {
                    f: 'detalle cuenta',
                    idventa: row.idventa
                }
            })
            .then(res => {


                if (res.data.msg === 'Detalle Encontrado') {

                    guardarDetalles(res.data.body)



                } else if (res.data === 'No Hay Detalles') {

                    guardarDetalles([])

                }

            })
            .catch(error => {
                console.log(error)
            })

    }

    const calcTotales = (arr, f) => {

        let total = 0

        if (f === 'cant') {

            for (let i = 0; i < arr.length; i++) {

                total += parseInt(arr[i].cantidad)

            }

            return total

        } else if (f === 'imp') {

            for (let i = 0; i < arr.length; i++) {

                total += parseFloat(arr[i].importe)

            }

            return total.toFixed(2)

        }

    }

    const pagoCuenta = async (row) => {

        const pagos = {
            idcuenta: row.idcuenta,
            fecha: moment().format('YYYY-MM-DD'),
            hora: moment().format('HH:mm:ss'),
            importe: pagoRef.current.value,
            estado: 1,
            usuario: usuario,
            f: 'pago cuenta'
        }

        await axios.post('/api/cuentas/cuenta', pagos)
            .then(res => {

                if (res.data.msg === "Pago Registrado") {

                    toastr.success("Se registro el pago de la cuenta correctamente", "ATENCION")

                    let accion = `Se registro el pago a la cuenta id: ${row.idcuenta}, de un importe: $ ${pagos.importe}.`

                    let id = `CT - ${row.idcuenta}`

                    registrarHistoria(accion, usuario, id)

                    actTotales(row)

                }
            })
            .catch(error => {
                console.log(error)
            })

    }

    const actTotales = async (row) => {


        let cuenta = {
            idcuenta: row.idcuenta,
            pagado: pagoRef.current.value,
            deuda: deuda,
            f: "act valores",
            estado: ""
        }

        let importe = row.importe - row.pagado

        let pago = parseFloat(pagoRef.current.value)

        if (pago === importe) {


            cuenta.estado = 0

            await axios.put('/api/cuentas/cuenta', cuenta)
                .then(res => {


                    if (res.data.msg === "Importes Actualizados") {

                        toastr.info("Importes de la cuenta actualizados", "ATENCION")

                        let accion = `Se cancelo la cuenta id: ${row.idcuenta}.`

                        let id = `CT - ${row.idcuenta}`

                        registrarHistoria(accion, usuario, id)

                        traerCuenta(row)

                    }

                })
                .catch(error => {
                    console.log(error)
                })

        } else if (pago < importe) {

            cuenta.estado = 1

            await axios.put('/api/cuentas/cuenta', cuenta)
                .then(res => {


                    if (res.data.msg === "Importes Actualizados") {

                        toastr.info("Importes de la cuenta actualizados", "ATENCION")

                        traerCuenta(row)

                    }

                })
                .catch(error => {
                    console.log(error)
                })
        }



    }

    const calcDeduda = (importe) => {

        let pago = parseFloat(pagoRef.current.value)

        if (pago === 0 || pago === "" || pagoRef.current.value === NaN) {

            guardarDeduda(importe)

        } else {

            if (pago === importe) {

                toastr.info("Con este pago estas cancelando la cuenta", "ATENCION")

            } else if (pago > importe) {

                toastr.warning("Estas registrando un pago mayor al importe de la deuda", "ATENCION")

            }

            let deu = parseFloat(importe) - parseFloat(pago)

            guardarDeduda(deu)


        }

    }

    return (
        <Layout>
            {listado ? (

                <ListadoClientes
                    listado={clientes}
                    nombreRef={nombreRef}
                    apellidoRef={apellidoRef}
                    dniRef={dniRef}
                    telefonoRef={telefonoRef}
                    direccionRef={direccionRef}
                    detalleRef={detalleRef}
                    editarCliente={editarCliente}
                    activarCliente={activarCliente}
                    bajaCliente={bajaCliente}
                    traerCuenta={traerCuenta}
                    cuentas={cuentas}
                    traerDetallesCuenta={traerDetallesCuenta}
                    detalles={detalles}
                    calcTotales={calcTotales}
                    calcDeduda={calcDeduda}
                    deuda={deuda}
                    pagoRef={pagoRef}
                    guardarDeduda={guardarDeduda}
                    pagoCuenta={pagoCuenta}
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
                        Actualmente no se encuentra ningun cliente registrado en la base de datos.
                        <Link href={'/clientes/nuevo'}>
                            <Button colorScheme={"blue"} mt={4}>
                                Registrar Cliente
                            </Button>
                        </Link>
                    </AlertDescription>
                </Alert>
            )}
        </Layout>
    )
}

export default listado