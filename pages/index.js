import { extend } from "lodash/fp";
import { Col, Container, Row } from "reactstrap";
import Link from "next/link";
import Editor from "../components/editor";
import Head from "../components/head";
import Header from "../components/header";
import Preview from "../components/preview";
import {
    COLOR,
    ENCLOSURE,
    HARDWARE,
    KEY,
    LABEL,
    POSITION
} from "../components/constants";

// ERROR: You may need an appropriate loader to handle this file type
// import "bootstrap/dist/css/bootstrap.css";

const hasLocalStorage = typeof localStorage !== "undefined";

class Index extends React.Component {
    stateStorageKey = "STATE";

    defaultState = {
        vanityText: "OKAY",
        keyCount: 8,
        startingNoteIndex: 0,
        color: COLOR.AQUA_BLUE,
        speakerDiameter: 49.8,
        knobsCount: 2,
        controlPosition: POSITION.AUTO,
        valid: true,
        minimumKeyCount: 3,
        maximumKeyCount: 88
    };

    getMinimumKeyCount() {
        function possibleGutter(width) {
            return width > 0 ? ENCLOSURE.GUTTER : 0;
        }

        const vanityTextMinimumWidth =
            KEY.WIDTH * this.defaultState.minimumKeyCount;

        let width = 0;

        if (this.state.vanityText.length > 0) {
            width += vanityTextMinimumWidth;
        }

        if (this.state.controlPosition === POSITION.BACK) {
            width += possibleGutter(width) + this.state.speakerDiameter;

            if (this.state.knobsCount >= 0) {
                width +=
                    possibleGutter(width) +
                    HARDWARE.KNOB_DIAMETER * this.state.knobsCount +
                    ENCLOSURE.GUTTER * (this.state.knobsCount - 1);
            }
        }

        return Math.max(
            Math.ceil(width / KEY.WIDTH),
            this.defaultState.minimumKeyCount
        );
    }

    getMaximumKeyCount() {
        return this.defaultState.maximumKeyCount;
    }

    constructor(props) {
        super(props);
        this.state = this.getLocalState();
        this.editState = this.editState.bind(this);
        this.resetState = this.resetState.bind(this);
    }

    getLocalState = () => {
        return extend(
            this.defaultState,
            hasLocalStorage
                ? JSON.parse(localStorage.getItem(this.stateStorageKey))
                : {}
        );
    };

    componentDidMount() {
        this.setState(this.getLocalState());
        this.updateMinimumKeyCountAndValidity();
    }

    updateMinimumKeyCountAndValidity() {
        const minimumKeyCount = this.getMinimumKeyCount();
        const maximumKeyCount = this.getMaximumKeyCount();

        const valid =
            this.state.keyCount >= minimumKeyCount &&
            this.state.keyCount <= maximumKeyCount;

        this.setState({
            minimumKeyCount: minimumKeyCount,
            maximumKeyCount: maximumKeyCount,
            valid: valid
        });
    }

    editState(newState = {}) {
        if (hasLocalStorage) {
            localStorage.setItem(
                this.stateStorageKey,
                JSON.stringify(extend(this.getLocalState(), newState))
            );
        }

        this.setState(newState, this.updateMinimumKeyCountAndValidity);
    }

    resetState() {
        this.editState(this.defaultState);
    }

    render() {
        return (
            <Container>
                <Head title="build.oskitone" />
                <Header title="build.oskitone" />

                <Row>
                    <Col xs="12" md="4">
                        <Editor
                            state={this.state}
                            onChange={this.editState}
                            onReset={this.resetState}
                        />
                    </Col>

                    <Col xs="12" md="8">
                        <Preview state={this.state} />
                    </Col>
                </Row>

                <style jsx>{`
                    :global(body) {
                        margin: 1rem 0;
                    }
                `}</style>
            </Container>
        );
    }
}

export default Index;
