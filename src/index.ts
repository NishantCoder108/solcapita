import "dotenv/config";
import express from "express"
import { PUBLICKEY } from "./constant";

const app = express();

app.use(express.json())//when json data will come , application/json
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 3000;

console.log({ PUBLICKEY })
app.post("/body", (req, res) => {

    const data = req.body
    console.log(data)

    res.json(data)
})

app.get("/", (req, res) => {

    res.json({
        message: "Hello Nishant!"
    })

})

app.listen(PORT, () => {
    console.log("Application is running on port : ", PORT)
})