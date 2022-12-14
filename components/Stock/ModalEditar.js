import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Container,
    Box,
    FormControl,
    FormLabel,
    Input,
    Select,
    useColorModeValue,
    Alert,
    Stack,
    Heading,
    Text,
    AlertIcon,
    AlertDescription,
    Image,
    Textarea,
    VisuallyHidden
} from '@chakra-ui/react'

import { EditIcon, AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { ip } from '../../config/config'
import moment from 'moment'
import BarCode2 from './BarCode2'

const ModalEditar = ({
    row,
    errores,
    categoriaRef,
    proveedorRef,
    marcaRef,
    productoRef,
    stockRef,
    precioListaRef,
    precioVentaRef,
    descripcionRef,
    precioMayoristaRef,
    fechaVencimientoRef,
    editarProducto,
    editarStock,
    eliminarImagen,
    handlerArchivos,
    subirImagen,
    cate,
    provee
}) => {

    const OverlayOne = () => (
        <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px) hue-rotate(90deg)'
        />
    )

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [overlay, setOverlay] = React.useState(<OverlayOne />)

    return (
        <>
            <Button
                colorScheme="yellow"
                size='xs'
                ml="1"
                onClick={() => {
                    setOverlay(<OverlayOne />)
                    onOpen()
                }}
            >
                <EditIcon />
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size="3xl" >
                {overlay}
                <ModalContent color={useColorModeValue('black', 'white')}>
                    <ModalHeader>Detalles del Producto ID: {row.idproducto} - {row.producto}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>

                        <Container maxW={'6xl'} mt={5} border='1px' borderColor='gray.500' borderRadius="xl" >

                            <Stack spacing={4} as={Container} maxW={'3xl'} mt="4" textAlign={'center'}>
                                <Heading fontSize={'2xl'}>Actualizar Producto</Heading>
                                <Text fontSize={'md'}>
                                    Edita Toda la informacion del producto.
                                </Text>
                            </Stack>

                            <Box className='row' p="4" alignItems="center" justifyContent="space-between" mt="6">

                                {
                                    !cate ? (
                                        <FormControl isRequired w="xs" >
                                            <Alert className='mt-4' status='info' ariant='left-accent'>
                                                <AlertIcon />
                                                <AlertDescription>No hay categorias registradas.</AlertDescription>
                                                <VisuallyHidden><Input type={"text"} ref={categoriaRef} value="0" /></VisuallyHidden>

                                            </Alert>
                                        </FormControl>
                                    ) : (
                                        <FormControl isRequired w="xs" >
                                            <FormLabel >Categoria</FormLabel>
                                            <Select placeholder='Selecciona una opcion' defaultValue={row.idcategoria} ref={categoriaRef}>
                                                {
                                                    cate.map((c, index) => (
                                                        <option key={index} value={c.idcategoria}>{c.categoria}</option>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                    )
                                }

                                {
                                    !provee ? (
                                        <FormControl isRequired w="xs" >
                                            <Alert className='mt-4' status='info' ariant='left-accent'>
                                                <AlertIcon />
                                                <AlertDescription>No hay proveedores registradas.</AlertDescription>
                                                <VisuallyHidden><Input type={"text"} ref={proveedorRef} value="0" /></VisuallyHidden>
                                            </Alert>
                                        </FormControl>
                                    ) : (
                                        <FormControl isRequired w="xs" >
                                            <FormLabel >Proveedores</FormLabel>
                                            <Select placeholder='Selecciona una opcion' defaultValue={row.idproveedor} ref={proveedorRef}>
                                                {
                                                    provee.map((c, index) => (
                                                        <option key={index} value={c.idproveedor}>{c.proveedor}</option>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                    )
                                }

                                <FormControl isRequired w="xs" mt="6">
                                    <FormLabel >Marca</FormLabel>
                                    <Input type='text' defaultValue={row.marca} ref={marcaRef} />
                                </FormControl>

                                <FormControl isRequired w="xs" mt="6">
                                    <FormLabel >Producto</FormLabel>
                                    <Input type='text' defaultValue={row.producto} ref={productoRef} />
                                </FormControl>

                                <FormControl isRequired w="xs" mt="6">
                                    <FormLabel >Fecha de Vencimiento: {moment(row.fecha_vencimiento).format('DD/MM/YYYY')}</FormLabel>
                                    <Input type='date' ref={fechaVencimientoRef} defaultValue={row.fecha_vencimiento} />
                                </FormControl>

                                <FormControl isRequired w="xs" mt="6">
                                    <FormLabel >Precio Lista</FormLabel>
                                    <Input type='text' defaultValue={row.precio_lista} ref={precioListaRef} />
                                </FormControl>

                                <FormControl isRequired w="xs" mt="6">
                                    <FormLabel >Precio Venta</FormLabel>
                                    <Input type='text' defaultValue={row.precio_venta} ref={precioVentaRef} />
                                </FormControl>

                                <FormControl isRequired w="xs" mt="6">
                                    <FormLabel >Precio Mayorista</FormLabel>
                                    <Input type='text' defaultValue={row.precio_mayorista} ref={precioMayoristaRef} />
                                </FormControl>

                                <FormControl w="3xl" mt="6">
                                    <FormLabel >Descripcion</FormLabel>
                                    <Textarea rows="3" defaultValue={row.descripcion} ref={descripcionRef} />
                                </FormControl>

                                <FormControl w="xs" mt="6">
                                    <FormLabel >Codigo</FormLabel>
                                    <BarCode2 codigo={row.codigo} />
                                </FormControl>


                            </Box>

                            {errores ? (

                                <Alert className='mt-4' status='error' ariant='left-accent'>
                                    <AlertIcon />
                                    <AlertDescription>{errores}.</AlertDescription>
                                </Alert>

                            ) : null}

                            <Box className='row' p="4" justifyContent="end">

                                <Button colorScheme='blue' size='md' onClick={() => editarProducto(row)}>
                                    Editar
                                </Button>

                                <Button colorScheme={"red"} ml="1" onClick={onClose}>Cancelar</Button>

                            </Box>
                        </Container>

                        <Container maxW={'6xl'} mt={10} border='1px' borderColor='gray.500' borderRadius="xl" >

                            <Stack spacing={4} as={Container} maxW={'3xl'} mt="4" textAlign={'center'}>
                                <Heading fontSize={'2xl'}>Actualizar Imagen del producto</Heading>
                                <Text fontSize={'md'}>
                                    Agregar una imagen al producto.
                                </Text>
                            </Stack>

                            <Box className='row' p="4" alignItems="center" justifyContent="space-between">
                                {!row.imagen || row.imagen === ' ' ?
                                    (
                                        <FormControl isRequired w="xs" mt="6">
                                            <FormLabel >Imagen</FormLabel>
                                            <Input type='file' onChange={handlerArchivos} />
                                            <Button mt="4" colorScheme={"blue"} size="sm" onClick={() => { subirImagen(row) }}> <AddIcon /> Agregar</Button>
                                        </FormControl>
                                    ) : (
                                        <FormControl w="xs" mt="6" >
                                            <FormLabel >Imagen del producto</FormLabel>
                                            <Image width={290} height={280} src={`${ip}api/archivos/stock/archivo/${row.imagen}`} alt='imagen producto' />
                                            <Button colorScheme={"red"} size="sm" onClick={() => { eliminarImagen(row) }}><DeleteIcon />Eliminar</Button>
                                        </FormControl>
                                    )}

                            </Box>
                        </Container>

                        <Container maxW={'6xl'} mt={10} border='1px' borderColor='gray.500' borderRadius="xl" >

                            <Stack spacing={4} as={Container} maxW={'3xl'} mt="4" textAlign={'center'}>
                                <Heading fontSize={'2xl'}>Actualizar Stock</Heading>
                                <Text fontSize={'md'}>
                                    Agregar solamente el nuevo stock del producto, el cual se sumara al ya existente.
                                </Text>
                            </Stack>

                            <Box className='row' p="4" alignItems="center" justifyContent="space-between">

                                <FormControl isRequired w="xs" mt="6">
                                    <FormLabel >Stock</FormLabel>
                                    <Input type='number' value={row.stock} readOnly />
                                </FormControl>


                                <FormControl isRequired w="xs" mt="6">
                                    <FormLabel>Nuevo Stock</FormLabel>
                                    <Input type='number' ref={stockRef} />
                                </FormControl>

                            </Box>

                            <Box className='row' p="4" justifyContent="end">

                                <Button colorScheme='blue' size='md' onClick={() => editarStock(row)}>
                                    Actualizar
                                </Button>

                                <Button colorScheme={"red"} ml="1" onClick={onClose}>Cancelar</Button>

                            </Box>

                        </Container>

                    </ModalBody>


                    <ModalFooter>

                    </ModalFooter>
                </ModalContent>
            </Modal >
        </>
    )
}

export default ModalEditar