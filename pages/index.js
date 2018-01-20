import Link from "next/link";
import Head from "../components/head";
import Preview from "../components/preview";
import Editor from "../components/editor";

import { Component } from "react";

// ERROR: You may need an appropriate loader to handle this file type
// import "bootstrap/dist/css/bootstrap.css";

import { Col, Container, Row } from "reactstrap";

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            vanityText: "OKAY",
            keyCount: 15,
            startingNoteIndex: 0,
            color: "#ff0000"
        };

        this.editState = this.editState.bind(this);
    }

    editState(newState = {}) {
        this.setState(newState);
    }

    render() {
        return (
            <Container>
                <Head title="build.oskitone" />

                <Row>
                    <Col xs="4">
                        <Editor state={this.state} onChange={this.editState} />
                    </Col>

                    <Col xs="8">
                        <Preview state={this.state} />
                    </Col>
                </Row>

                <style jsx>{``}</style>
            </Container>
        );
    }
}

export default Index;
