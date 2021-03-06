import React, { FormEvent} from "react";

export class Option extends React.Component<{defaulttext:string, onChange:Function, data:number, handleRemove:Function}, {}>{
    render(){
        return (
        <div className="input-group mt-2">
            <input type="text" className="form-control" placeholder={`Option ${this.props.data + 1}`} value={this.props.defaulttext} onChange={(event) => this.props.onChange(event, this.props.data)} name="option" tabIndex={this.props.data+2}/>
            <div className="input-group-append">
                <button className="btn btn-secondary" onClick={(event : FormEvent) => this.props.handleRemove(event, this.props.data)}>Remove</button>
            </div>
        </div>);
    }
}

