import excuteQuery from '../../../config/db';
import moment from 'moment';

export default async function handlerProductos(req, res) {

    const { method } = req

    if (method === "GET") {


        if (req.query.f && req.query.f === 'producto') {

            try {

                const result = await excuteQuery({

                    query: `SELECT * FROM productos 
                WHERE codigo = ${req.query.codigo}
                AND estado = 1 
                
                `,

                });



                if (result[0]) {

                    res.json({
                        msg: "Producto Encontrado",
                        body: result
                    })

                } else if (!result[0]) {

                    res.json("No hay Producto")

                }

            } catch (error) {
                console.log(error);
            }

        } if (req.query.f && req.query.f === 'nfactura') {

            try {

                const result = await excuteQuery({

                    query: `
                    SELECT idventa 
                    FROM ventas
                    ORDER BY idventa DESC             
                
                `,

                });



                if (result[0]) {

                    res.json({
                        msg: "Id Encontrado",
                        body: result
                    })

                } else if (!result[0]) {

                    res.json("No hay Id")

                }

            } catch (error) {
                console.log(error);
            }

        } if (req.query.f && req.query.f === 'factura') {

            try {

                const result = await excuteQuery({

                    query: `
                    SELECT nfactura, p.codigo, p.descripcion, p.precio_venta, vp.cantidad,  v.fecha, v.usuario
                    FROM ventas as v
                    INNER JOIN ventas_productos as vp on vp.idventa = v.idventa
                    INNER JOIN productos as p on p.codigo = vp.codigo
                    where v.idventa = ${req.query.idventa}           
                
                `,

                });


                if (result[0]) {

                    res.json({
                        msg: "Ventas Encontradas",
                        body: result
                    })

                } else if (!result[0]) {

                    res.json("No hay ventas")

                }

            } catch (error) {
                console.log(error);
            }

        }

    } else if (method === "POST") {

        if (req.body.f && req.body.f === 'venta') {

            const venta = {

                nfactura: req.body.nfactura,
                importe: req.body.importe,
                cantidad: req.body.cantidad,
                fecha: req.body.fecha,
                usuario: req.body.usuario,
                idcliente: req.body.idcliente,
                medio_pago: req.body.medio_pago,
                vuelto: req.body.vuelto,
            }


            try {

                const result = await excuteQuery({
                    query: `INSERT INTO ventas 
                        (nfactura, importe, cantidad, fecha, usuario, idcliente, medio_pago, vuelto) 
                        VALUES('${venta.nfactura}', ${venta.importe}, ${venta.cantidad}, '${venta.fecha}', '${venta.usuario}', ${venta.idcliente}, '${venta.medio_pago}', ${venta.vuelto})`

                });

                if (result) {
                    res.json({
                        msg: "Venta Registrada",
                        body: result
                    })
                }


            } catch (error) {
                console.log(error);
            }

            return venta;


        } else if (req.body.f && req.body.f === 'ventaProd') {

            const ventaProd = {
                idventa: req.body.idventa,
                codigo: req.body.codigo,
                cantidad: req.body.cantidad,
                importe: req.body.importe,

            }


            try {

                const result = await excuteQuery({
                    query: `INSERT INTO ventas_productos 
                        (idventa, codigo, cantidad, importe) 
                        VALUES(${ventaProd.idventa}, '${ventaProd.codigo}', ${ventaProd.cantidad}, ${ventaProd.importe})`,

                });

                if (result) {
                    res.json({
                        msg: "Items Registrados",
                        body: result
                    })
                }


            } catch (error) {
                console.log(error);
            }

            return ventaProd;

        }

    } else if (method === "PUT") {

        const datos = {
            f: req.body.f,
            codigo: req.body.codigo,
            cantidad: req.body.cantidad
        }

        if (datos.f && datos.f === 'menos') {


            try {

                const result = await excuteQuery({
                    query: `UPDATE productos
                        SET stock = stock - ${datos.cantidad}                            
                        WHERE codigo = '${datos.codigo}'`


                });

                if (result) {
                    res.json({
                        msg: "Stock Restado",
                        body: result
                    })

                }



            } catch (error) {
                console.log(error);

            }

            return datos

        } if (datos.f && datos.f === 'mas') {

            try {

                const result = await excuteQuery({
                    query: `UPDATE productos
                        SET stock = stock + ${datos.cantidad} 
                        WHERE codigo = '${datos.codigo}'`


                });


                if (result) {
                    res.json({
                        msg: "Stock Sumado",
                        body: result
                    })

                }




            } catch (error) {
                console.log(error);

            }

            return datos



        }
    }


}
