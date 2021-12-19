import cors from "cors";
import express from "express";
import path from "path";
import mongoose, {Error, HydratedDocument} from "mongoose";
import sanitize from "mongo-sanitize";
import {PollModel, Poll} from "./models/Poll";

const app = express();
const PORT = process.env.PORT || 8000;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost");

app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());
app.use(express.json());


// creates and saves a new poll
app.post("/api/createpoll", function(req, res){
    const poll : HydratedDocument<Poll> = new PollModel({"name": req.body.name, "options": []});
    var id : number = 0;
    req.body.options.forEach((element: string) => {
        poll.options.push({name:sanitize(element), votes:0, optid:sanitize(id)});
        id++;
    });
    try {
        poll.save();
        res.json({id: poll.id});
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// adds a vote to an existing poll
app.post("/api/vote/:id", function(req, res){
    PollModel.findById(sanitize(req.params.id), function(err : Error, poll : HydratedDocument<Poll>){
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }
        try{
            const option : number = parseInt(req.body.option);
            poll.options[option].votes += 1;
            poll.save();
            res.sendStatus(204);
        }catch (error){
            console.log(err);
            res.sendStatus(500);
        }
    });
});

// returns voting options on a poll
app.get("/api/vote/:id", function(req, res){
    PollModel.findById(sanitize(req.params.id), function(err: Error, poll: HydratedDocument<Poll>){
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }
        const options : {name:string, optid:number}[]= [];
        poll.options.forEach(option => {
            options.push((({name: string, optid: number}) => ({name: string, optid: number}))(option)); // hacky way to get the subset
        });
        res.json({
            name: poll.name,
            options: options
        });
    });
});

// returns the current results of a poll
app.get("/api/results/:id", function(req, res){
    PollModel.findById(sanitize(req.params.id)).lean().then(function(poll: Poll | null){
        res.json(poll);
    }).catch(function(err: Error){
        console.log(err);
        res.sendStatus(404); // might be internal server error too
    });
});

// returns 10 newest polls
app.get("/api/newpolls", function(req, res){
    PollModel.find().sort({createdAt: "desc"}).limit(10).lean().then(function(polls : Poll[]){
        res.json(polls); // this sends fields it doesn't have to
    }).catch(function(err : Error){
        console.log(err);
        res.sendStatus(500);
    });
});

app.get("*", function(req, res){
    res.sendFile(__dirname + "/build/index.html");
});

app.listen(PORT, function(){
    console.log(`Listening on port ${PORT}`);
});
