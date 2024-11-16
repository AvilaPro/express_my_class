const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
// Requerimos fs de node
const fs = require('fs').promises;
// Requerimos helmet
const helmet = require('helmet');

/**
 * Funciones utilitarias
 */

function fun1(req, res, next) {
    console.log('respuesta de FUN 1');
    next();
}

function fun2(req, res, next) {
    console.log('Respuesta FUN 2');
    next();
}

async function getUserById(id){
    try {
        // console.log("entro al getUserById ");
        const data = await fs.readFile(`./public/users/${id}.json`);
        // console.log(data);
        return JSON.parse(data);
    } catch (error) {
        throw new Error('Usuario no encontrado');
    }
}

function ValidarCredenciales(username, password) {
    //Nos conectamos a la base de datos y validamos sea autentico
    // console.log(username, password);
    let isValid = true;
    if(isValid){
        return true;
    }else{
        return false;
    }
}

function validadorDeURLDeRedireccion(url) {
    return url.startsWith('http://mi-sitio.com') || url.startsWith('https://mi-otro-sitio.com');

}

/**Clases utilitarias de la aplicacion */
class ErrorPersonalizado extends Error{
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fallo' : 'error';
        
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Inicializacion de middlewares de la aplicacion
 */
app.use(bodyParser.json());
// app.use(express.static('public'));
app.use(cors());
app.use(helmet(
    {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "https://cdn.jsdelivr.net/npm/chart.js"],
                styleSrc: ["'self'", 'bootstrapcdn.com']
            }
        },
        frameguard: {
            action: 'deny'
        }
    }
));

/***
 * Rutas del servidor
 */

//**Petciciones GET */
app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, 'public', 'index.html'));
    //Error intencional
    throw new Error('error intencional');
})
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
})

app.get('/fileNotFound', (req, res, next) => {
    fs.readFile('./notFound.txt', (err, data) => {
        if (err) {
            next(err);
        } else {
            res.send(data);
        }
    })
})

app.get('/user/:id', async (req, res, next) => {
    try {
        const user = await getUserById(req.params.id);
        res.send(user);
    } catch (error) {
        const myError = new ErrorPersonalizado('Este es un error personalizado', 502);
        next(myError)
    }
})

//Clase 1
/*
app.get('/', (req, res) => {
    res.send('Bienvenido al servidor de express.')
});
*/

app.get('/userData', (req, res) => {
    const userData = {
        name: 'Juan',
        age: 30
    }
    res.json(userData)
})

app.get('/encadenado', [fun1, fun2], (req, res, next) => {
    console.log('respuesta desde el primer arrow function');
    next();
},
(req, res) => {
    console.log('respuesta del ultimo arrow function');
    res.send('<h1 style="color: red; text-align: center;">Eduardo Mejias</h1>');
});

/**Peticiones POST */

//manejar peticiones post en el servidor
//Analizando el 'body' de la request del cliente.
app.post('/login', (req, res) => {
    if (ValidarCredenciales(req.body.username, req.body.password)) {
        const urlDeRedireccion = req.query.redirect || '/login';

        //Verificar si la URL de redireccion es segura
        if (validadorDeURLDeRedireccion(urlDeRedireccion)) {
            res.redirect(urlDeRedireccion);
        }else{
            res.send(400).send('URL de redireccion no valido');
        }
    }else{
        res.send('Credenciales invalidas');
    }
    let body = '';
    req.on('data', (chunk) =>{
        body += chunk.toString();
    });
    req.on('end', () => {
        console.log(body);
        let datosFormulario = JSON.parse(body);
        console.log('Datos del formulario: ' + datosFormulario);

        res.status(202).json(datosFormulario);
    });
})

app.post('/register', (req, res) => {
    //desestructuramos el request de la peticion y creamos una variable para cada dato
    let { username, email, password, phone } = req.body;
    //enviamos una response que muestre los datos
    res.status(201).send(`Usuario: ${username}, correo: ${email}`);
})

app.post('/iniciar', (req, res) => {
    console.log('ruta iniciar');
    //desestructuracion del body
    let { username, password } = req.body;
    // asignacion de informacion del body
    // let username = req.body.username;
    // let password = req.body.password;

    /**Middleware que valide en la base de datos */

    // res.status(202).send(`Usuario: ${username}`);
    res.status(202).send(`Usuario: ${username}`);
})

/**Peticiones PUT */

app.put('/actualizarProducto/:id', (req, res) => {
    let id = req.params.id;
    let { nombre, precio, descripcion } = req.body;

    //Proceso de actualizacion de datos en la base de datos.
    //typeORM - mySQL

    res.status(200).send('Datos actualizados');
})

/**Peticiones DELETE */

app.delete('/eliminarProducto/:id', (req, res) => {
    let id = req.params.id;

    //Proceso de actualizacion de datos en la base de datos.
    //typeORM - mySQL

    res.status(200).send('Dato eliminado');
})

/**Middlewares del sistema */
//Middleware para manejar errores
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });     
})



app.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000");
})