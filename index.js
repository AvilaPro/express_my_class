const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

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

/**
 * Inicializacion de middlewares de la aplicacion
 */
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());

/***
 * Rutas del servidor
 */

//**Petciciones GET */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
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



app.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000");
})