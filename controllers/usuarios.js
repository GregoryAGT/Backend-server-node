const { response } = require('express');
const bcrypt = require('bcryptjs');



const Usuario = require ('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async (req, res) => {

    const desde = Number(req.query.desde) || 0 ;  
 
    const [ usuarios, total] =  await Promise.all([
        Usuario
            .find({}, 'nombre email role google img' )
            .skip( desde )
            .limit( 5 ),

        Usuario.countDocuments()
    ])


    res.json({
        ok:true,
        usuarios,
        total
       
    })
} 

const crearUsuario = async(req, res = response) => {


    const { email, password, nombre} = req.body;

    

    try {

        const existeEmail = await Usuario.findOne({ email });

        if ( existeEmail ) {
            return res.status (400).json({
                ok: false,
                msg: 'El correo esta registrado'
            });
        }
        
        const usuario = new Usuario( req.body );

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        


    await usuario.save();

    const token = await generarJWT(usuario.id);



        res.json({
            ok:true,
             usuario,
             token
    });

    } catch (error) {
        console.log(error)
        res.status(500).json({
                ok: false,
                msg:  'Error inesperado'
            });  
    }

} 

const actualizarUsuario = async(req, res =  response) =>{

    const uid = req.params.id;
    

    try {

        const usuarioDb = await Usuario.findById( uid );

        if(!usuarioDb) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el ID'
            });
        }
        const { password, google, email, ...campos} =  req.body;
        if( usuarioDb.email !== email  ){
            
            const existeEmail = await Usuario.findOne({ email });
            if ( existeEmail ) {
                return res.status(400).json({
                    ok:false,
                    msg: 'El email existe'
                })
            }
        }
        
        campos.email = email;

const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true} );


        res.json({
            ok: true,
            usuario: usuarioActualizado
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado'
        })
    }


}

const borrarUsuario = async(req, res =  response) => {

    const uid = req.params.id;

    try {
        const usuarioDb = await Usuario.findById( uid );

        if(!usuarioDb) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el ID'
            });
        }

        await Usuario.findByIdAndDelete( uid );

        res.json({
            ok: true,
            msg: 'Usuario Eliminado'
        });

    }catch (error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });


    }



}     




module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}