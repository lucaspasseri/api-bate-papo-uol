import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';
const app = express();

app.use(express.json());
app.use(cors());

const participants = [];

const messages = [];


app.get("/participants", (req, res) => {

    res.send(participants);
});

app.post("/participants", (req, res) => {
    if(req.body.name.trim().length > 0 && !participants.find(item=> item.name===req.body.name)){

        req.body.lastStatus = Date.now();

        participants.push(req.body)

        messages.push({
            from: req.body.name,
            to: "Todos",
            text: "entra na sala...",
            type: "status",
            time: dayjs(req.body.lastStatus).format("HH:mm:ss")
        });

        res.sendStatus(200);
        return;
    }

    res.sendStatus(400);
});

app.listen(4000, ()=>{
    console.log("Running on port 4000...")
});