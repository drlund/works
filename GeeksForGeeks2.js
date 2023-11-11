import React, { Component } from "react";
import { Form } from "react-bootstrap";
  
class GeeksForGeeks extends Component {
    onFormSubmit(event) {
        event.preventDefault();
        console.log("Color value is :", this.state.color);
    }
    onChangeColor() {
        this.setState({ color: event.target.value })
    }
    render() {
        return (
            <div>
                Select element of react-bootstrap
                <hr />
                <Form onSubmit=
                    {this.onFormSubmit.bind(this)} role="form">
                    <Form.Group controlId="exampleForm.SelectCustom">
                        <Form.Label>Select Color : </Form.Label>
                        <Form.Control as="select"
                            custom onChange=
                            {this.onChangeColor.bind(this)}>
                            <option value="black">Black</option>
                            <option value="amber">Amber</option>
                            <option value="purple">Purple</option>
                            <option value="magenta">Magenta</option>
                            <option value="white">White</option>
                        </Form.Control>
                    </Form.Group>
                    <Button type="submit">Gfg color</Button>
                </Form>
            </div>
        );
    }
}
export default GeeksForGeeks;