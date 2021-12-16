import React, { FormEvent } from "react";
import { RouteComponentProps, Redirect} from "react-router";
interface RouterParams{
    id: string
}
interface State{
    title: string,
    options: {name: number, id: string}[],
    chosen: number,
    redirect: string
}
export class Voting extends React.Component<RouteComponentProps<RouterParams>, State>{
    constructor(props : any){
        super(props);
        this.state = {
            title: '',
            options: [],
            chosen: -1,
            redirect: ''
        }
        this.handleOption = this.handleOption.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount(){
        fetch(`/api/vote/${this.props.match.params.id}`).then(res => res.json()).then(res => this.setState({
            title: res.name,
            options: res.options
        }));
    }
    handleSubmit(e : FormEvent<HTMLInputElement>){
        e.preventDefault();
        var vote : any = {
            option: this.state.chosen
        };
        fetch(`/api/vote/${this.props.match.params.id}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accepts': 'application/json'
            },
            body:JSON.stringify(vote)
        }).then(res=>{if(res.status === 204){
            this.setState({
                redirect: `/results/${this.props.match.params.id}`
            });
        }});
        
    }
    handleOption(i : number){
        this.setState({chosen: i});
    }
    render(){
        if(this.state.redirect !== ''){
            return <Redirect push to={this.state.redirect}/>
        }
        var options :any = [];
        this.state.options.forEach(element => {
            options.push(
                <div key={element.id} className="form-check">
                    <input className="form-check-input" type="radio" name="option" onClick={() => this.handleOption(parseInt(element.id))}/>
                    <label className="form-check-label">{element.name}</label>
                </div>
            );
        });
        return (
        <div className="container">
            <h1>{this.state.title}</h1>
            <form>
                {options}
                <input type="submit" className="btn btn-primary" value="vote" onClick={this.handleSubmit}/>
            </form>
        </div>)
    }
}
