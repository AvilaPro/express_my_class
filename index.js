const express = require("express")
const jwt = require("jsonwebtoken")

const secret = '6RZWy39R4fzcD2PvQBV1mKHN9KiYm9'
const app = express()

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.json())

  

app.post("/token", (req, res) => {
    const { username, password } = req.body;

    // Validar el usuario y la contraseña (por ejemplo, contra una base de datos)

    // Si la autenticación es exitosa, generar el token
    const token = jwt.sign({ username, exp: Date.now() + 60 * 1000 }, secret);

    res.json({ token });

    res.send(token);
})

app.get("/public", (req, res) => {
    res.send("Ruta publica")
})

app.get("/private", (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const payload = jwt.verify(token, secret)
    
        if (Date.now() > payload.exp) {
            return res.status(401).send({ error: 'Token expiro'})
        }
        res.send({
            "result": "Exitoso"
        })
    } catch (error) {
        res.status(401).send({ error: error.message })
    }
})


app.listen(3000)