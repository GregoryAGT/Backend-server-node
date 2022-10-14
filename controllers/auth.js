const { response } = require('express')
const Usuario = require('../models/usuario')
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res = response ) => {

    const { email, password } = req.body;


    try {
        
        const usuarioDB = await Usuario.findOne({email});

        if(!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
            if (!validPassword){
               return  res.status(400).json({
                ok: false,
                msg: 'Contraseña no es valida'
            });
            }

        const token = await generarJWT(usuarioDB.id);
            
        res.json({
            ok: true,
            token
        })


    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })



    }

} 

const googleSingIn = async(req, res = response ) => {

    try {
        const {email, name, picture} = await googleVerify (req.body.token);

        const usuarioDb = await Usuario.findOne({ email });
        let usuario;

        if(!usuarioDb){
            usuario = new Usuario({
                nombre: name,
                email: email,
                password: '@@@',
                img: picture,
                google: true
            })
        }else{
            usuario = usuarioDb;
           usuario.google = false;
        }

        await usuario.save();

        const token = await generarJWT(usuario.id);


        res.json({
            ok: true,
            email, name, picture,
            token
        })

    }catch(error){
        console.log(error)
        res.status(400).json({
            ok: false,
            msg: 'Token de google no es correcto'
        })
    }
       

}

const renewToken = async (req, res = response) =>{

    const uid = req.uid; 
    const token = await generarJWT(uid);
    const usuario = await Usuario.findById( uid );

    res.json({
        ok: true,
        token,
        usuario

    })


}



module.exports = {
    login,
    googleSingIn,
    renewToken
}