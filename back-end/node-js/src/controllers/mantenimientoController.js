import { conexion } from '../database/database.js';

/* 5 listo funcional */
export const listarRequerimiento5 = async (req, res) => {
    try {
        let sql = `
            SELECT idMantenimiento ,mant_fecha_realizacion
            FROM mantenimiento 
            
        `;
        const [result] = await conexion.query(sql);
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ "message": "No se encontraron requerimientos de mantenimiento completos en la base de datos." });
        }
    }
    catch (err) {
        res.status(500).json({ "message": "Error en el controlador listarRequerimiento5: " + err });
    }
}; 

/* 5.2 busqueda por id de mantenimiento y que aparesca todas las actividades */
export const listarMantenimientoPorId = async (req, res) => {
    try {
        const { idMantenimiento } = req.params;
        let sql = `SELECT idActividades, acti_nombre, acti_descripcion, acti_fecha_realizacion, acti_estado, fk_mantenimiento 
                    FROM mantenimiento AS m
                    JOIN actividades AS a ON m.idMantenimiento = a.fk_mantenimiento
                    WHERE m.idMantenimiento = ${idMantenimiento}`;
        const [result] = await conexion.query(sql);

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ "message": "No se encontró actividades con el ID especificado" });
        }
    } catch (err) {
        res.status(500).json({ "message": "Error en el controlador mantenimientoController.js: " + err });
    }
};

/* 14 */
export const registrarMantenimiento = async (req, res) => {
    try {
        let {
            mant_codigo_mantenimiento,
            mant_fecha_realizacion,
            mant_fecha_proxima,
            mant_fk_fichas,
            fk_tipo_mantenimiento,
            mant_descripcion
        } = req.body;

        let sql = `INSERT INTO mantenimiento (mant_codigo_mantenimiento, mant_fecha_realizacion, mant_fecha_proxima, mant_fk_fichas, fk_tipo_mantenimiento, mant_descripcion)
        values('${mant_codigo_mantenimiento}', '${mant_fecha_realizacion}', '${mant_fecha_proxima}', '${mant_fk_fichas}', '${fk_tipo_mantenimiento}', '${mant_descripcion}')`;
        
        const [respuesta] = await conexion.query(sql);

        if (respuesta.affectedRows > 0) {
            return res.status(200).json({"mensaje": "Se registró con éxito"});
        } else {
            return res.status(404).json({"mensaje": "No se registró con éxito el mantenimiento"});
        }
    } catch (e) {
        return res.status(500).json({"mensaje": "Error: " + e.message});
    }
}

/* 16 generar ficha de mantenimiento */
export const listarRequerimiento17 = async (req, res) => {
    try {
        const { fecha_realizacion } = req.params;

        const sql = `
            SELECT
                fichas.fi_placa_sena AS referencia_maquina,
                mantenimiento.mant_codigo_mantenimiento,
                mantenimiento.mant_descripcion,
                mantenimiento.mant_fecha_realizacion,
                actividades.acti_estado,
                actividades.idActividades,
                actividades.acti_nombre,
                tipo_mantenimiento.tipo_mantenimiento,
                fichas.idFichas,
                fichas.fi_fecha_inicio_garantia,
                fichas.fi_fecha_fin_garantia,
                fichas.fi_descripcion_garantia
            FROM
                mantenimiento
            LEFT JOIN
                fichas ON mantenimiento.mant_fk_fichas = fichas.idFichas
            LEFT JOIN
                actividades ON actividades.fk_mantenimiento = mantenimiento.idMantenimiento
            LEFT JOIN
                tipo_mantenimiento ON mantenimiento.fk_tipo_mantenimiento = tipo_mantenimiento.idTipo_mantenimiento
            WHERE 
                mantenimiento.mant_fecha_realizacion = ?
        `;

        const [result] = await conexion.query(sql, [fecha_realizacion]);

        if (result.length > 0) {
            const requerimientos = [];
            const idsProcesados = new Set();

            for (let i = 0; i < result.length; i++) {
                const row = result[i];
                
                /* evitar la repetición de datos */
                if (!idsProcesados.has(row.idActividades)) {
                    const requerimiento = {
                        referencia_maquina: row.referencia_maquina,
                        codigo_mantenimiento: row.mant_codigo_mantenimiento,
                        descripcion_mantenimiento: row.mant_descripcion,
                        fecha_realizacion: row.mant_fecha_realizacion,
                        estado_maquina: row.acti_estado,
                        idActividades: row.idActividades,
                        acti_nombre: row.acti_nombre,
                        tipo_mantenimiento: row.tipo_mantenimiento,
                        idFichas: row.idFichas,
                        fi_fecha_inicio_garantia: row.fi_fecha_inicio_garantia,
                        fi_fecha_fin_garantia: row.fi_fecha_fin_garantia,
                        fi_descripcion_garantia: row.fi_descripcion_garantia
                    };
                    requerimientos.push(requerimiento);
                    idsProcesados.add(row.idActividades);
                }
            }
            
            res.status(200).json(requerimientos);
        } else {
            res.status(404).json({ "message": "No se encontraron requerimientos de mantenimiento en la base de datos para la fecha de realización proporcionada." });
        }
    } catch (err) {
        res.status(500).json({ "message": "Error en el controlador listarRequerimiento17: " + err.message });
    }
};

/* busca el mantenimiento por id de la ficha  */
export const mantenimientoDeMaquinas = async (req, res) => {
    try {
        const { idFichas } = req.params; 
        let sql = `
            SELECT idMantenimiento, mant_codigo_mantenimiento, mant_fecha_realizacion, mant_fecha_proxima, mant_fk_fichas, fk_tipo_mantenimiento
            FROM mantenimiento 
            LEFT JOIN fichas ON mantenimiento.mant_fk_fichas = fichas.idFichas
            WHERE idFichas = ${idFichas}`; 

        const [result] = await conexion.query(sql, [idFichas]); 
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ "message": "No se encontraron mantenimientos relacionados con esa ficha." });
        }
    } catch (err) {
        res.status(500).json({ "message": "Error en el controlador mantenimientoDeMaquinas: " + err });
    }
};
