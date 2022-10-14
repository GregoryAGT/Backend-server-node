const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const 
    {
        getMedicos,
        crearMedico,
        actializarMedico,
        borrarMedico
    } = require ('../controllers/medicos')

const router = Router();

router.get( '/', getMedicos );

router.post( '/',
    [
        validarJWT,
        check ('nombre', 'El nombre del medico').not().isEmpty(),
        check ('hospital', 'El hospital ID debe ser valido').isMongoId(),
        validarCampos
    ], 
    crearMedico );


router.put( '/:id', 
    [
        validarJWT,
        check ('nombre', 'El nombre del medico').not().isEmpty(),
        check ('hospital', 'El hospital ID debe ser valido').isMongoId(),
        validarCampos
    ],
    actializarMedico
);

router.delete( '/:id',    
    borrarMedico
);


module.exports = router;