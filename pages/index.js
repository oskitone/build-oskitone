import { extend } from "lodash/fp";
import { Col, Container, Row } from "reactstrap";
import Editor from "../components/editor";
import { AboutModal, InquireModal } from "../components/modals";
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
        vanityTextDimensions: { width: undefined, height: undefined },
        inputValidities: {},
        openModalKey:
            hasLocalStorage && !localStorage.dismissedAboutModal
                ? "about"
                : undefined,
        exportData: undefined
    };

    constructor(props) {
        super(props);

        this.vanityTextMinimumWidth =
            KEY.WIDTH * this.defaultState.minimumKeyCount;
        this.minimumVanityTextHeight = 10;

        this.state = this.getLocalState();
        this.editState = this.editState.bind(this);
        this.resetState = this.resetState.bind(this);

        this.onModalOpen = this.onModalOpen.bind(this);
        this.onModalClosed = this.onModalClosed.bind(this);
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

    getMaximumVanityTextLength() {
        function possibleGutter(width) {
            return width > 0 ? ENCLOSURE.GUTTER : 0;
        }

        let availableWidh = this.state.keyCount * KEY.WIDTH;

        if (this.state.controlPosition === POSITION.BACK) {
            availableWidh -=
                possibleGutter(availableWidh) + this.state.speakerDiameter;

            if (this.state.knobsCount >= 0) {
                availableWidh -=
                    possibleGutter(availableWidh) +
                    HARDWARE.KNOB_DIAMETER * this.state.knobsCount +
                    ENCLOSURE.GUTTER * (this.state.knobsCount - 1);
            }
        }

        return Math.ceil(availableWidh / KEY.WIDTH);
    }

    updateMinimumKeyCountAndValidity() {
        let inputValidities = {};

        const minimumKeyCount = this.getMinimumKeyCount();
        const maximumKeyCount = this.getMaximumKeyCount();
        inputValidities.keyCount =
            this.state.keyCount >= minimumKeyCount &&
            this.state.keyCount <= maximumKeyCount &&
            this.state.keyCount % 1 === 0;

        const maximumVanityTextLength = this.getMaximumVanityTextLength();
        inputValidities.vanityText =
            !inputValidities.keyCount || // Assume valid until keyCount fixed
            this.state.vanityText.length <= maximumVanityTextLength;

        let valid = true;
        for (var key in inputValidities) {
            valid = valid && inputValidities[key];
        }

        this.setState(
            {
                minimumKeyCount: minimumKeyCount,
                maximumKeyCount: maximumKeyCount,
                maximumVanityTextLength: maximumVanityTextLength,
                inputValidities: inputValidities,
                valid: valid
            },
            this.updateEnclosureDimensions
        );
    }

    updateEnclosureDimensions() {
        if (this.state.valid) {
            this.setState({
                enclosureDimensions: this.getEnclosureDimensions(),
                vanityTextDimensions: this.getVanityTextDimensions()
            });
        }
    }

    getExportData() {
        return {
            vanityText: this.state.vanityText,
            keyCount: this.state.keyCount,
            startingNoteIndex: this.state.startingNoteIndex,
            color: this.state.color,
            speakerDiameter: this.state.speakerDiameter,
            controlPosition: this.getControlPosition(),
            enclosureDimensions: this.state.enclosureDimensions,
            vanityTextDimensions: this.state.vanityTextDimensions
        };
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
        const message =
            "Are yous sure? You will lose any changes you have made.";

        if (window.confirm(message)) {
            this.editState(this.defaultState);
        }
    }

    onModalOpen(modalKey) {
        return () => {
            this.setState({
                exportData: this.getExportData(), // todo conditionalize
                openModalKey: modalKey
            });
        };
    }

    onModalClosed(modalKey) {
        return () => {
            if (this.state.openModalKey === modalKey) {
                this.setState({ openModalKey: undefined });

                if (hasLocalStorage && modalKey === "about") {
                    localStorage.dismissedAboutModal = 1;
                }
            }
        };
    }

    render() {
        const verticalGutterRem = 1;

        return (
            <Container className="container">
                <Head title="build.oskitone" />
                <Header onAboutClick={this.onModalOpen("about")} />

                <Row className="editorAndPreview">
                    <Col xs="12" md="4">
                        <Editor
                            state={this.state}
                            onChange={this.editState}
                            onReset={this.resetState}
                            onInquire={this.onModalOpen("inquire")}
                        />
                    </Col>

                    <Col xs="12" md="8">
                        <Preview state={this.state} />
                    </Col>
                </Row>

                <AboutModal
                    isOpen={this.state.openModalKey === "about"}
                    onClosed={this.onModalClosed("about")}
                />

                <InquireModal
                    isOpen={this.state.openModalKey === "inquire"}
                    onClosed={this.onModalClosed("inquire")}
                    data={this.state.exportData}
                />

                <style jsx>{`
                    :global(body) {
                        margin: ${verticalGutterRem}rem 0;
                    }

                    // TODO: make kosher, w/o global hacks
                    @media (min-width: 768px) {
                        :global(.container) {
                            display: flex;
                            flex-direction: column;
                            height: calc(100vh - ${verticalGutterRem * 2}rem);
                        }

                        :global(.editorAndPreview) {
                            flex: 1;
                        }

                        :global(.previewContainer) {
                            position: absolute;
                            height: 100%;
                            left: 0;
                            right: 0;
                        }
                    }
                `}</style>
            </Container>
        );
    }
}

export default Index;
