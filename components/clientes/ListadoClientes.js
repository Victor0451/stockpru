import React, { useMemo } from 'react'
import DataTable from "react-data-table-component";
import FilterComponent from "../Layouts/FilterComponent";
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Button,
} from '@chakra-ui/react';
import moment from 'moment';
import Link from 'next/link';
import ModalVista from './ModalVista';
import ModalEditar from './ModalEditar';
import BajaClientes from './BajaClientes';
import ExportarPadron from './ExportarExcel';
import ModalCuenta from './ModalCuenta';

const ListadoClientes = ({
  listado,
  nombreRef,
  apellidoRef,
  telefonoRef,
  direccionRef,
  detalleRef,
  editarCliente,
  activarCliente,
  bajaCliente,
  traerCuenta,
  cuentas,
  traerDetallesCuenta,
  detalles,
  calcTotales,
  calcDeduda,
  deuda,
  pagoRef,
  guardarDeduda,
  pagoCuenta
}) => {
  const columns = [

    {
      name: "ID",
      selector: row => `${row.idcliente}`,
      sortable: true,
      grow: 0.2
    },

    {
      name: "Cliente",
      selector: row => `${row.apellido}, ${row.nombre}`,
      sortable: true,
      grow: 0.3
    },
    {
      name: "DNI",
      selector: row => `${row.dni}`,
      sortable: true,
      grow: 0.2
    },
    {
      name: "Alta",
      selector: row => `${moment(row.precio_venta).format('DD/MM/YYYY')}`,
      sortable: true,
      grow: 0.2
    },
    {
      name: "acciones",
      button: true,
      grow: 0.1,
      cell: (row, index) =>
      (
        <>


          <ModalVista
            row={row}
          />

          <ModalEditar
            row={row}
            nombreRef={nombreRef}
            apellidoRef={apellidoRef}
            telefonoRef={telefonoRef}
            direccionRef={direccionRef}
            detalleRef={detalleRef}
            editarCliente={editarCliente}
            activarCliente={activarCliente}
            bajaCliente={bajaCliente}
          />

          <BajaClientes
            row={row}
            bajaCliente={bajaCliente}
          />


          <ModalCuenta
            row={row}
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

        </>

      )
    }
  ];

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(
    false
  );

  const filteredItems = listado.filter(
    item =>
      JSON.stringify(item)
        .toLowerCase()
        .indexOf(filterText.toLowerCase()) !== -1
  );

  const subHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (

      <>
        <FilterComponent
          onFilter={e => setFilterText(e.target.value)}
          onClear={handleClear}
          filterText={filterText}
        />

        <ExportarPadron
          listado={listado}
        />

      </>


    );
  }, [filterText, resetPaginationToggle]);

  return (
    <Box
      p={4}
    >
      <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
        <Heading fontSize={'3xl'}>Listado de Clientes</Heading>
        <Text fontSize={'xl'}>
          Listado de Clientes registrados en el sistema. Para ingresar un nuevo cliente, hace click en el boton. <Link href={"/clientes/nuevo"}><Button colorScheme={"blue"}>Nuevo Cliente</Button></Link>
        </Text>
      </Stack>

      <Container maxW={'100%'} mt={10}  >
        <DataTable
          // title="Listado de Clientes"
          columns={columns}
          data={filteredItems}
          defaultSortField="name"
          striped
          pagination
          subHeader
          subHeaderComponent={subHeaderComponent}
        />
      </Container>
    </Box>
  )
}

export default ListadoClientes