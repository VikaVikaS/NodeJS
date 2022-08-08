import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./router";


require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(router);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});