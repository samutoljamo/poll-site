import React from "react";

export class Option extends React.Component<{onChange:Function, data:number, handleRemove:Function}, {}>{
    render(){
        return (
        <div className="input-group mt-2">
            <input type="text" className="form-control" placeholder={`Option ${this.props.data + 1}`} onChange={(event) => this.props.onChange(event, this.props.data)} name="option" tabIndex={this.props.data+2}/>
            <div className="input-group-append">
                <button className="btn btn-secondary" onClick={() => this.props.handleRemove(this.props.data)}>Remove</button>
            </div>
        </div>);
    }
}

