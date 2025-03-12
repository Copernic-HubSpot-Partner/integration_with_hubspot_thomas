const express = require("express");
const axios = require("axios");
require("dotenv").config();
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const HUBSPOT_BASE_URL = "https://api.hubapi.com/crm/v3/objects";
const CUSTOM_OBJECT_ID = "2-140254049";

// ROUTE 1 - Homepage: Affiche la liste des objets personnalisés
app.get("/", async (req, res) => {
  const url = `${HUBSPOT_BASE_URL}/${CUSTOM_OBJECT_ID}?properties=nom,description,attaque`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(url, { headers });
    const data = response.data.results;
    console.log(data);
    res.render("homepage", { title: "Custom Objects | HubSpot APIs", data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération des données");
  }
});

// ROUTE 2 - Formulaire pour ajouter un nouvel objet personnalisé
app.get("/update-cobj", (req, res) => {
  res.render("updates", { title: "Update Custom Object Form | HubSpot" });
});

// ROUTE 3 - Création d'un nouvel objet personnalisé
app.post("/update-cobj", async (req, res) => {
  const newObject = {
    properties: {
      nom: req.body.nom,
      description: req.body.description,
      attaque: req.body.attaque,
    },
  };

  const url = `${HUBSPOT_BASE_URL}/${CUSTOM_OBJECT_ID}`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    await axios.post(url, newObject, { headers });
    res.redirect("/");
  } catch (error) {
    console.error(error.response);
    res
      .status(500)
      .send("Erreur lors de la création du nouvel objet personnalisé");
  }
});

// Serveur local
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
