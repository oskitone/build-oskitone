import { extend } from "lodash/fp";
import { Col, Container, Row } from "reactstrap";
import Editor from "../components/editor";
import Head from "../components/head";
import Header from "../components/header";
import Preview from "../components/preview";
import {
    COLOR,
    CONTROL,
    ENCLOSURE,
    HARDWARE,
    KEY,
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
        maximumKeyCount: 88,
        enclosureDimensions: { width: undefined, height: undefined },
        vanityTextDimensions: { width: undefined, height: undefined }
    };

    constructor(props) {
        super(props);

        this.vanityTextMinimumWidth =
            KEY.WIDTH * this.defaultState.minimumKeyCount;
        this.minimumVanityTextHeight = 10;

        this.state = this.getLocalState();
        this.editState = this.editState.bind(this);
        this.resetState = this.resetState.bind(this);
    }

    getMinimumKeyCount() {
        function possibleGutter(width) {
            return width > 0 ? ENCLOSURE.GUTTER : 0;
        }

        let width = 0;

        if (this.state.vanityText.length > 0) {
            width += this.vanityTextMinimumWidth;
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

    getControlPosition() {
        return this.state.controlPosition === POSITION.AUTO
            ? this.state.keyCount > 8 ? POSITION.BACK : POSITION.RIGHT
            : this.state.controlPosition;
    }

    getVanityTextDimensions() {
        const state = this.state;

        return {
            width:
                KEY.WIDTH * state.keyCount -
                (this.getControlPosition() === POSITION.BACK
                    ? (state.speakerDiameter > 0
                          ? ENCLOSURE.GUTTER + state.speakerDiameter
                          : 0) +
                      state.knobsCount *
                          (HARDWARE.KNOB_DIAMETER + ENCLOSURE.GUTTER)
                    : 0),
            height: Math.max(
                this.getControlPosition() === POSITION.BACK
                    ? Math.max(state.speakerDiameter, CONTROL.MINIMUM_HEIGHT)
                    : state.speakerDiameter +
                      CONTROL.MINIMUM_HEIGHT -
                      KEY.HEIGHT,
                this.minimumVanityTextHeight
            )
        };
    }

    getEnclosureDimensions() {
        const state = this.state;

        return {
            width:
                state.keyCount * KEY.WIDTH +
                ENCLOSURE.GUTTER * 2 +
                (this.getControlPosition() === POSITION.BACK
                    ? 0
                    : state.speakerDiameter > 0
                      ? state.speakerDiameter + ENCLOSURE.GUTTER
                      : HARDWARE.KNOB_DIAMETER * 2 + ENCLOSURE.GUTTER * 2),
            height:
                this.getControlPosition() === POSITION.BACK
                    ? KEY.HEIGHT +
                      ENCLOSURE.GUTTER * 2 +
                      Math.max(state.speakerDiameter, CONTROL.MINIMUM_HEIGHT) +
                      ENCLOSURE.GUTTER
                    : state.vanityText.length > 0
                      ? this.getVanityTextDimensions().height +
                        KEY.HEIGHT +
                        ENCLOSURE.GUTTER * 3
                      : state.speakerDiameter > 0
                        ? state.speakerDiameter +
                          CONTROL.MINIMUM_HEIGHT +
                          ENCLOSURE.GUTTER * 3
                        : Math.max(
                              KEY.HEIGHT,
                              state.speakerDiameter +
                                  ENCLOSURE.GUTTER +
                                  CONTROL.MINIMUM_HEIGHT
                          ) +
                          ENCLOSURE.GUTTER * 2
        };
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
        this.updateEnclosureDimensions();
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

    updateEnclosureDimensions() {
        if (this.state.valid) {
            this.setState({
                enclosureDimensions: this.getEnclosureDimensions(),
                vanityTextDimensions: this.getVanityTextDimensions()
            });
        }
    }

    editState(newState = {}) {
        if (hasLocalStorage) {
            localStorage.setItem(
                this.stateStorageKey,
                JSON.stringify(extend(this.getLocalState(), newState))
            );
        }

        this.setState(newState, () => {
            this.updateMinimumKeyCountAndValidity();
            this.updateEnclosureDimensions();
        });
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
