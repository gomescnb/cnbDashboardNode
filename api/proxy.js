const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

app.get("/proxy", async (req, res) => {
  try {
    const diaResponse = await axios.get(
      "https://ptax.bcb.gov.br/ptax_internet/consultarTodasAsMoedas.do?method=consultaTodasMoedas"
    );
    const index = diaResponse.data.indexOf("es de todas as moedas no dia ");
    const dateCSV = diaResponse.data.substring(index + 29, index + 39);

    function convertDateFormat(dateString) {
      var parts = dateString.split("/");
      var yyyy = parts[2];
      var mm = parts[1];
      var dd = parts[0];
      if (mm.length === 1) {
        mm = "0" + mm;
      }
      if (dd.length === 1) {
        dd = "0" + dd;
      }
      return yyyy + mm + dd;
    }

    let datacerta = convertDateFormat(dateCSV);

    const response = await axios.get(
      `https://www4.bcb.gov.br/Download/fechamento/${datacerta}.csv`
    );

    const data = await response;

    console.log(dateCSV);
    res.send(data.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

