import express from "express";
import mongoose from "mongoose";
import ejs from "ejs";
import bodyParser from "body-parser";
import cuna from "./models/cuna.js";
import guarderia from "./models/guarderia.js";
import jardin from "./models/jardin.js";
import dotenv from "dotenv";

//.env
dotenv.config();

//coneccion app y port
const app = express();
const port = process.env.PORT || 3000;

//mongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error de conexión ", err);
  });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/node_modules", express.static("node_modules"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("pages/index.ejs");
});

app.post("/admision", async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      genero,
      nacimiento,
      nivel,
      nombreYapellido,
      telefono,
      email,
    } = req.body;

    const modelosPorNivel = {
      Cuna: cuna,
      Guarderia: guarderia,
      Jardin: jardin,
    };

    if (modelosPorNivel[nivel]) {
      const nuevoDocumento = new modelosPorNivel[nivel]({
        nombre,
        apellido,
        genero,
        nacimiento,
        nombreYapellido,
        telefono,
        email,
      });

      const resultado = await nuevoDocumento.save();
      console.log("Documento guardado con éxito", resultado);
      res.send("Documento guardado con éxito");
    } else {
      res.status(400).send("Nivel no válido");
    }
  } catch (error) {
    console.error("Error al guardar el documento:", error);
    res.status(500).send("Error al guardar el documento");
  }
});

app.listen(port, () => console.log("server listing on port", port));
