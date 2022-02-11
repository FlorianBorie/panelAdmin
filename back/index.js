require('babel-register');
const {checkAndChange} = require('./src/assets/functions')
const mysql = require('promise-mysql');
const bodyParser = require('body-parser');
const express = require("express");
const morgan = require('morgan')('dev')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/assets/swagger.json');
const config = require('./src/assets/config.json')

mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password,
    socketPath: config.db.socketPath
}).then((db) => {

    console.log("Bien connecter !")
    const app = express();

    let Routes = express.Router();
    let Clients = require('./src/classes/client-class')(db, config)

    app.use(morgan)
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(config.rootAPI+'api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


    Routes.route('/:id')
        // Récupère un client avec son ID
        .get(async (req, res) => {
            let client = await Clients.getByID(req.params.id)
            res.json(checkAndChange(client))
        })

        // Modifie un client avec ID
        .put(async (req, res) => {
            let updateClient = await Clients.update(req.params.id, req.body.nom, req.body.prenom, req.body.mail, req.body.tel)
            res.json(checkAndChange(updateClient))

        })

        // Supprime un client avec ID
        .delete(async (req, res) => {
            let deleteClient = await Clients.delete(req.params.id)
            res.json(checkAndChange(deleteClient))

        })

    Routes.route('/')

        // Récupère tous les clients
        .get(async (req, res) => {
            let allClients = await Clients.getAll(req.query.max)
            res.json(checkAndChange(allClients))
        })

        // Ajoute un client
        .post(async (req, res) => {
            let addClient = await Clients.add(req.body.nom, req.body.prenom, req.body.mail, req.body.tel)
            res.json(checkAndChange(addClient))
        })

    app.use(config.rootAPI+'clients', Routes)

    app.listen(config.port, () => console.log('Serveur bien démarrer au port : '+config.port))
}).catch((err) => {
    console.log('Erreur durant la connection avec la base de donnée')
    console.log(err.message)
})