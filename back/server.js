const PORT = 4000;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const routes = express.Router();
app.use("/api", routes)

// Swagger
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const swaggerOptions = {
  swaggerDefinition:{
    info: {
      title: 'Customer API',
      description: 'Customer API information',
      contact: {
        name: "amazing developper"
      },
      servers: ['http://localhost:4000/']
    }
  },
  apis: ["server.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
routes.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

 
// body-parser
routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());
let jsonParser = bodyParser.json();
 
//cors
routes.use(cors());

/**
 * @swagger
 * definitions:
 *  Clients:
 *   type: object
 *   properties:
 *    nom:
 *     type: string
 *     description: nom du client
 *     example: 'test'
 *    prenom:
 *     type: string
 *     description: prenom du client
 *     example: 'test'
 *    mail:
 *     type: string
 *     description: mail du client
 *     example: 'jayaramachandran@whizpath.com'
 *    adresse:
 *     type: string
 *     description: adresse du client
 *     example: 'rue des test'
 */

  // GET ALL
  /**
   * @swagger
   * /api/clients:
   *  get:
   *    description: Permet d'accéder à tous les clients
   *    responses:
   *      '200':
   *        description: Client bien trouvé
   */
  routes.get("/clients", (req, res) => {
    db.find()
    .toArray()
    .then((error, results) => {
      if(error){ 
        return res.send(error); 
      }
      res.status(200).send({ results });
    })
    .catch((err) => res.send(err));
  });

  // GET ID
  /**
   * @swagger
   * /api/clients/{clients_id}:
   *  get:
   *   description: afficher un client
   *   parameters:
   *    - in: path
   *      name: clients_id
   *      schema:
   *       type: integer
   *      required: true
   *      description: id du clients 
   *   responses:
   *    200:
   *     description: affichage du client réussi
   */
  routes.get("/clients/:id", (req, res) => {
    const o_id = new ObjectID(req.params.id);
    db.findOne(
      { _id: o_id })
    .then((error, results) => {
      if(error){ 
        return res.send(error); 
      }
      res.status(200).send(results);
    })
    .catch((err) => res.send(err));
  });
  
  // POST
  /**
   * @swagger
   * /api/clients/add:
   *  post:
   *   description: créer un client
   *   parameters:
   *    - in: body
   *      name: body
   *      required: true
   *      description: body du clients
   *      schema:
   *       $ref: '#/definitions/Clients'
   *   requestBody:
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#/definitions/Clients'
   *   responses:
   *    200:
   *     description: success
   *    500:
   *     description : error
   */
  routes.post("/clients", jsonParser, function (req, res) {
    db.insertOne(req.body)
    .then(() => res.status(200).send(`L'ajout du nouveau client est fait avec success !`))
    .catch((err) => {      
      console.log(err);
      res.send(err)
    });
  })

  // UPDATE
  /**
   * @swagger
   * /api/clients/{id}:
   *  put:
   *   description: mise à jour du client
   *   consumes:
   *    - application/json
   *   produces:
   *    - application/json
   *   parameters:
   *    - in: path
   *      name: id
   *      schema:
   *       type: integer
   *      required: true
   *      description: id du client
   *    - in: body
   *      name: body
   *      required: true
   *      description: body object
   *      schema:
   *       $ref: '#/definitions/Clients'
   *   requestBody:
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#/definitions/Clients'
   *   responses:
   *    200:
   *     description: success
   *     content:
   *      application/json:
   *       schema:
   *        $ref: '#/definitions/Clients'
   */
  routes.put("/clients/:id", (req, res) => {
    const o_id = new ObjectID(req.params.id);
    db.updateOne(
      { "_id": o_id },
      { $set: {"prenom": req.body.prenom, "nom": req.body.nom, "mail": req.body.mail, "adresse": req.body.adresse }})
    .then((error, results) => {
      if(error){ 
        return res.send(error); 
      }
      res.status(200).send(results);
    })
    .catch((err) => res.send(err));
  });

  // DELETE
  /**
   * @swagger
   * /api/clients/{clients_id}:
   *  delete:
   *   description: suppression d'un client
   *   parameters:
   *    - in: path
   *      name: clients_id
   *      schema:
   *       type: integer
   *      required: true
   *      description: id du client
   *   responses:
   *    200:
   *     description: suppression avec success
   */

  routes.delete("/clients/:id", (req, res) => {
    const o_id = new ObjectID(req.params.id);
    db.deleteOne(
      { _id: o_id })
    .then((error, results) => {
      if(error){ 
        return res.send(error); 
      }
      res.status(200).send(`Suppression d'un client fait avec success !` + results);
    })
    .catch((err) => res.send(err));
  });

// Port
app.listen(PORT, () => {
  console.log(`Mon serveur écoute sur http://localhost:${PORT}`);
});

// Route principale
routes.get("/", (req, res) => {
  res.send("Hello World!");
});