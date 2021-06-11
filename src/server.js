import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';
import { stripHtml } from 'string-strip-html';
const app = express();

app.use(express.json());
app.use(cors());

const participants = [];

const messages = [];

function toUpdateParticipants(){
    if(participants.length > 0){

        participants.forEach((participant, index, participants) => {

            if(Date.now() - participant.timestamp > 10000) {
                participants.splice(index, 1);
                messages.push({
                    from: participant.name,
                    to: 'Todos',
                    text: 'sai da sala...',
                    type: 'status',
                    time: dayjs(Date.now()).format("HH:mm:ss"),
                    timestamp: Date.now()
                });
            }   
        });
        return;
    }
}

const updateInterval = setInterval(()=> toUpdateParticipants(), 15000);

app.post("/status", (req, res) => {
    const user = req.headers.user;
    if(!!participants.find(participant => participant.name === user)){
        participants.forEach(participant.name === user? participant.lastStatus = dayjs(Date.now()).format("HH:mm:ss"):null);
        res.sendStatus(200);
        return;
    }
    res.sendStatus(400);
});

app.get("/messages", (req, res) => {

    const user = req.headers.user;
    const maxMessages = req.query.limit;
    const messagesToUser = messages.filter(message => message.from === user || message.to === user || message.to === "Todos");

    if(messagesToUser.length > maxMessages){
        const limitedMessagesToUser = messagesToUser.slice(-(maxMessages+1),-1);
        res.send(limitedMessagesToUser);
        return;
    }
    res.send(messagesToUser);
}); 

app.post("/messages", (req,res) => {
    const user = req.headers.user;
    const userFromParticipants = !!participants.find(participant => participant.name === user);
    const { to, text, type } = req.body;
    const correctType = type === "message" || type === "private_message";

    if(to.trim().length > 0 && text.trim().length > 0 && correctType && userFromParticipants){

        req.body.time = dayjs(Date.now()).format("HH:mm:ss");
        req.body.from = user;
        messages.push(req.body);
        res.sendStatus(200);
        return;
    }
    
    res.sendStatus(400);

});

app.get("/participants", (req, res) => {
    res.send(participants);
});

app.post("/participants", (req, res) => {
    if(req.body.name.trim().length > 0 && !participants.find(item=> item.name===req.body.name)){

        req.body.lastStatus = dayjs(Date.now()).format("HH:mm:ss");
        req.body.timestamp = Date.now();

        participants.push(req.body)

        const formattedName = stripHtml(`${req.body.name}`);
        const result = formattedName.result;

        messages.push({
            from: result,
            to: "Todos",
            text: "entra na sala...",
            type: "status",
            time: req.body.lastStatus
        });

        res.sendStatus(200);
        return;
    }

    res.sendStatus(400);
});

app.listen(4000, ()=>{
    console.log("Running on port 4000...")
});