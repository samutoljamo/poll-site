import cors from "cors";
import express from "express";
import path from "path";

interface Option{
    votes: number,
    name: string,
    id: number
}
type OptionInfo = Omit<Option, "votes">;

interface Poll{
    name: string,
    options: Option[]
}
interface PollInfo extends Omit<Poll, "options">{
    options: OptionInfo[],
    id: number
}

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(cors());
app.use(express.json());

var polls : Poll[] = []; // todo: use db(mongodb) instead of memory

// creates and saves a new poll
app.post("/api/createpoll", function(req, res){
    var poll : Poll =  {"name": req.body.name, "options": []};
    var id : number = 0;
    req.body.options.forEach((element: string) => {
        poll.options.push({"name":element, "votes":0, id:id});
        id++;
    });
    polls.push(poll);
    res.json({id: polls.length-1});
});

// adds a vote to an existing poll
app.post("/api/vote/:id", function(req, res){
    var id : number = parseInt(req.params.id);
    if(isNaN(id) || id < 0 || id >= polls.length){
        res.sendStatus(400); // bad request
        return;
    }
    let poll : Poll = polls[id];
    if(!req.body.hasOwnProperty("option") || typeof req.body.option !== "number" || req.body.option >= poll.options.length || req.body.option < 0){
        res.sendStatus(400); // bad request
        return;
    }
    poll.options[req.body.option].votes += 1;
    res.sendStatus(204);
});

// returns voting options on a poll
app.get("/api/vote/:id", function(req, res){
    var id : number = parseInt(req.params.id);
    if(isNaN(id)){
        res.sendStatus(400); // bad request
        return;
    }
    if(id >= polls.length || id < 0){
        res.sendStatus(400); // bad request
        return;
    }
    var response : {name: String, options:OptionInfo[]} = {
        name: polls[id].name,
        options: []
    }
    polls[id].options.forEach(element => {
        response.options.push({name:element.name, id:element.id});
    });
    res.json(response);

});

// returns the current results of a poll
app.get("/api/results/:id", function(req, res){
    var id : number = parseInt(req.params.id);
    if(isNaN(id)){
        res.sendStatus(400); // bad request
        return;
    }
    if(id >= polls.length || id < 0){
        res.sendStatus(400); // bad request
        return;
    }
    res.json(polls[id]);
});

// returns 10 newest polls
app.get("/api/newpolls", function(req, res){
    if(polls.length === 0){
        res.json([]);
        return;
    }
    var response : PollInfo[] = [];
    for (let i = polls.length-1; i > polls.length-11; i--) {
        if(i < 0){
            break;
        }
        let poll = polls[i];
        var pollInfo : PollInfo = {name: poll.name, options:[], id:i};
        poll.options.forEach(element => {
            pollInfo.options.push({name:element.name, id:element.id});
        });
        response.push(pollInfo);
    }
    res.json(response);
});

app.get("*", function(req, res){
    res.sendFile(__dirname + "/client/build/index.html");
});

app.listen(PORT, function(){
    console.log(`Listening on port ${PORT}`);
});
