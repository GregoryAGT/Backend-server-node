const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const 
    {
        getHospitales,
        crearHospital,
        actializarHospital,
        borrarHospital
    } = require ('../controllers/hospitales')

const router = Router();

router.get( '/', getHospitales );

router.post( '/',
    [
        validarJWT,
        check ('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
        validarCampos
    ], 
         crearHospital );


router.put( '/:id', 
    [
        validarJWT,
        check ('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
        validarCampos

    ],
       actializarHospital
);

router.delete( '/:id', 


    validarJWT,
    borrarHospital
);


module.exports = router;