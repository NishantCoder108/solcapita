import express from "express"

const app = express();



app.get("/", (req, res) => {

    res.json({
        message: "Hello Nishant!"
    })

})

app.listen(3000, () => {
    console.log("Application is running on port : ", 3000)
})