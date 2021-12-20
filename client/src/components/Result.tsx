import React, { FormEvent } from "react";
import { Redirect, RouteComponentProps } from "react-router";

interface RouterParams{
    id: string
}

interface State{
    title: string,
    options: Omit<Option, "optid">[],
    redirect: string,
    requested: boolean
}


export class Result extends React.Component<RouteComponentProps<RouterParams>, State>{
    constructor(props : any){
        super(props);
        this.state = {
            title: '',
            options: [],
            redirect: '',
            requested: false
        };
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount(){
        fetch(`/api/results/${this.props.match.params.id}`).then(res => res.json()).then(res => this.setState({
            title: res.name,
            options: res.options,
            requested: true
        }));
    }
    handleClick(e : FormEvent<HTMLButtonElement>){
        e.preventDefault();
        this.setState({
            redirect: `/vote/${this.props.match.params.id}`
        });
    }
    render(){
        if(this.state.redirect !== ''){
            return <Redirect push to={this.state.redirect}/>
        }
        if(!this.state.requested){
            return <div></div>
        }
        var options :any = [];
        this.state.options.forEach(element => {
            options.push(
                <li key={element.name} className="list-group-item justify-content-between align-items-center d-flex">
                    <h5>{element.name}</h5>
                    <span className="badge badge-primary">{element.votes} votes</span>
                </li>
            );
        });
        return (
        <div className="container pt-3">
            <h1 className="pb-3">{this.state.title}</h1>
            <ul className="list-group">
                {options}
            </ul>
            <button className="btn btn-primary mt-2" onClick={this.handleClick}>Vote again</button>
        </div>)
    }
}