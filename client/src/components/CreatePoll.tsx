import React, { FormEvent} from "react";
import { Redirect } from "react-router";
import {Option} from "./Option";
type State = {
    name: string,
    options: string[],
    redirect: string
}

export class CreatePollForm extends React.Component<{}, State>{
    constructor(props : any){
        super(props);
        this.state = {
            name: '',
            options: ['', ''],
            redirect: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addOption = this.addOption.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleRemove= this.handleRemove.bind(this);

    }
    handleInputChange(event : FormEvent<HTMLInputElement>) : void{
        event.preventDefault();
        const target = event.currentTarget;
        this.setState({
            'name': target.value
        });
    }
    handleOptionChange(event : FormEvent<HTMLInputElement>, num : number){
        event.preventDefault();
        const target = event.currentTarget;
        var options = this.state.options;
        options[num] = target.value;
        this.setState({
            options: options
        });
    }

    handleSubmit(event : FormEvent) : void{
        event.preventDefault();
        var poll = {
            name: this.state.name,
            options: this.state.options
        }
        fetch("/api/createpoll/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accepts': 'application/json'
            },
            body:JSON.stringify(poll)
        }).then(res=>res.json()).then(res => this.setState({redirect: `/vote/${res.id}`}));
    }
    addOption(event : FormEvent) : void{
        event.preventDefault();
        var options = this.state.options;
        options.push('');
        this.setState({options:options});
    }
    handleRemove(event : FormEvent, num : number) :void{
        event.preventDefault();
        var options = this.state.options;
        options.splice(num, 1);
        this.setState({options:options});
    }

    render(){
        if (this.state.redirect !== ''){
            return <Redirect push to={this.state.redirect}/>
        }
        let options : any = [];
        let id : number = 0;
        this.state.options.forEach(name => {
            options.push(<Option onChange={this.handleOptionChange} defaulttext={name} key={id} data={id} handleRemove={this.handleRemove}/>); id++;});
        return (
            <div className="container pt-3">
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group mb-4">
                        <input type="text" className="form-control" placeholder="Title" onChange={this.handleInputChange} name="title" tabIndex={1}/>
                    </div>
                    {options}
                    <div className="form-group mt-2">
                        <button  className="btn btn-primary" onClick={this.addOption}>Add option</button>
                        <input type="submit" className="btn btn-primary ml-1" value="create" tabIndex={id+2}/>
                    </div>
                </form>
            </div>
        )
    }
}
