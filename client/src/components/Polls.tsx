import React from "react";
import {Link} from "react-router-dom";

interface State{
    polls : PollInfo[]
}


export class Polls extends React.Component<{}, State>{
    constructor(props : any){
        super(props);
        this.state = {
            polls: []
        }
    }
    componentDidMount(){
        fetch(`/api/newpolls`).then(res => res.json()).then(res => this.setState({
            polls: res
        }));
    }
    render(){
        if(this.state.polls.length === 0){
            return <div> no polls</div>;
        }
        console.log(this.state.polls);
        var options :any = [];
        this.state.polls.forEach(element => {
            options.push(
                <div key={element._id} className="card">
                    <Link className="card-title h4" to={`/vote/${element._id}`}>{element.name}</Link>
                </div>
            );
        });
        return (
            <div className="container">
                <h3 className="text-center">Latest polls</h3>
                {options}
            </div>
        )
    }
}