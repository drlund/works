import React, { Component } from "react";
import { Form } from "react-bootstrap";
  
class GeeksForGeeks extends Component {
    constructor() {
        super();
        this.myRef = React.createRef();
    }
    onButtonClick() {
        console.log(this.myRef.current.value);
    }
  
    render() {
        return (
            <div>
                Select element of react-bootstrap
                <hr />
            Select color
                <Form.Control
                    as="select"
                    custom
                    ref={this.myRef}
                >
                    <option value="black">Black</option>
                    <option value="amber">Amber</option>
                    <option value="purple">Purple</option>
                    <option value="magenta">Magenta</option>
                    <option value="white">White</option>
                </Form.Control>
                <button onClick={this.onButtonClick}>
                    Gfg color
                </button>
            </div>
        );
    }
}
  
export default GeeksForGeeks;