const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

app.get("/table/:dado", async (req, res) => {
  try {
  const dado = req.params.dado;
  console.log(dado + "antes")
  const tableResponse = await axios.get(`https://portalbrasil.net/${dado}`);
  console.log("apos table response");
  console.log(dado);
  let startIndex = "";
  let tableParcial = "";
  let endIndex = "";
  let tableFinal = "";
  switch (dado) {
    case "ipca":
      startIndex = tableResponse.data.indexOf("<table");
      endIndex = tableResponse.data.indexOf("</table>");
      tableFinal = tableResponse.data.substring(startIndex, endIndex + 8); // 8 is the length of "</table>" in the original
      console.log("if ipca");
      return res.send("opa ramon response");

    case "igpm":
      startIndex = tableResponse.data.indexOf("<table");
      endIndex = tableResponse.data.indexOf("</table>");
      tableFinal = tableResponse.data.substring(startIndex, endIndex + 8); // 8 is the length of "</table>" in the original
      return res.send(tableFinal);    
    case "inpc":
      startIndex = tableResponse.data.indexOf(
        '<table id="tb" cellspacing="1" cellpadding="3">'
      );
      tableParcial = tableResponse.data.substring(
        startIndex,
        tableResponse.data.length
      );
      endIndex = tableParcial.indexOf("</table>");
      tableFinal = tableParcial.substring(0, endIndex + 8); // 8 is the length of "</table>" in the original
      return res.send(tableFinal);
    default:
      return res.status(404).send("Rota não encontrada");
  }

  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data", error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
