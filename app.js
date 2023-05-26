const express = require("express");
const app = express();
const port = 3001;
const mainRouter = require("./routes/index");

app.use(express.json());
app.use("/", [mainRouter]);

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
