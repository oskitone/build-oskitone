import Link from "next/link";
import Head from "../components/head";
import Preview from "../components/preview";

import { Component } from "react";

// ERROR: You may need an appropriate loader to handle this file type
// import "bootstrap/dist/css/bootstrap.css";

import {
    Button,
    Col,
    Container,
    Form,
    FormGroup,
    FormText,
    Input,
    Label,
    Row
} from "reactstrap";

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            vanityText: "OKAY",
            keyCount: 15,
            startingNoteIndex: 0,
            color: "#ff0000"
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        let newState = {};
        if (this.state.hasOwnProperty(name)) {
            newState[name] = isNaN(value) ? value : +value;
        }
        this.setState(newState);
    }

    render() {
        return (
            <Container>
                <Head title="build.oskitone" />

                <Row>
                    <Col xs="4">
                        <FormGroup>
                            <Label for="vanityText">Vanity text</Label>
                            <Input
                                type="text"
                                name="vanityText"
                                id="vanityText"
                                defaultValue={this.state.vanityText}
                                onChange={this.handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="keyCount">Key count</Label>
                            <Input
                                type="select"
                                name="keyCount"
                                id="keyCount"
                                defaultValue={this.state.keyCount}
                                onChange={this.handleChange}
                            >
                                <option>8</option>
                                <option>12</option>
                                <option>15</option>
                            </Input>
                        </FormGroup>

                        <FormGroup>
                            <Label for="startingNoteIndex">
                                Starting note index
                            </Label>
                            <Input
                                type="select"
                                name="startingNoteIndex"
                                id="startingNoteIndex"
                                defaultValue={this.state.keyCount}
                                onChange={this.handleChange}
                            >
                                <option value="0">C</option>
                                <option value="1">D</option>
                                <option value="2">E</option>
                                <option value="3">F</option>
                                <option value="4">G</option>
                                <option value="5">A</option>
                                <option value="6">B</option>
                            </Input>
                        </FormGroup>

                        <FormGroup>
                            <Label for="color">Color</Label>
                            <Input
                                type="text"
                                name="color"
                                id="color"
                                defaultValue={this.state.color}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </Col>

                    <Col xs="8">
                        <Preview model={this.state} />
                    </Col>
                </Row>

                <style jsx>{``}</style>
            </Container>
        );
    }
}

export default Index;
