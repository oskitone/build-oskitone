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
    OSKITONE,
    POSITION
} from "../components/constants";
import { getCoolWordByLength } from "../components/cool-words";

// ERROR: You may need an appropriate loader to handle this file type
// import "bootstrap/dist/css/bootstrap.css";

const hasLocalStorage = typeof localStorage !== "undefined";
const hasWindow = typeof window !== "undefined";

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

        if (hasWindow) {
            window.randomize = this.randomize; // Easter egg!
        }
    }

    getMinimumKeyCount = (
        vanityText = this.state.vanityText,
        speakerDiameter = this.state.speakerDiameter,
        controlPosition = this.getControlPosition()
    ) => {
        const possibleGutter = width => (width > 0 ? ENCLOSURE.GUTTER : 0);

        let width = 0;

        if (vanityText.length > 0) {
            width += this.vanityTextMinimumWidth;
        }

        if (controlPosition === POSITION.BACK) {
            width += possibleGutter(width) + speakerDiameter;

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
    };

    getMaximumKeyCount = () => this.defaultState.maximumKeyCount;

    getControlPosition = (
        controlPosition = this.state.controlPosition,
        keyCount = this.state.keyCount
    ) =>
        controlPosition === POSITION.AUTO
            ? this.state.keyCount > 8 ? POSITION.BACK : POSITION.RIGHT
            : controlPosition;

    getVanityTextDimensions = () => ({
        width:
            KEY.WIDTH * this.state.keyCount -
            (this.getControlPosition() === POSITION.BACK
                ? (this.state.speakerDiameter > 0
                      ? ENCLOSURE.GUTTER + this.state.speakerDiameter
                      : 0) +
                  this.state.knobsCount *
                      (HARDWARE.KNOB_DIAMETER + ENCLOSURE.GUTTER)
                : 0),
        height: Math.max(
            this.getControlPosition() === POSITION.BACK
                ? Math.max(this.state.speakerDiameter, CONTROL.MINIMUM_HEIGHT)
                : this.state.speakerDiameter +
                  CONTROL.MINIMUM_HEIGHT -
                  KEY.HEIGHT,
            this.minimumVanityTextHeight
        )
    });

    getEnclosureDimensions = () => ({
        width:
            this.state.keyCount * KEY.WIDTH +
            ENCLOSURE.GUTTER * 2 +
            (this.getControlPosition() === POSITION.BACK
                ? 0
                : this.state.speakerDiameter > 0
                  ? this.state.speakerDiameter + ENCLOSURE.GUTTER
                  : HARDWARE.KNOB_DIAMETER * 2 + ENCLOSURE.GUTTER * 2),
        height:
            this.getControlPosition() === POSITION.BACK
                ? KEY.HEIGHT +
                  ENCLOSURE.GUTTER * 2 +
                  Math.max(this.state.speakerDiameter, CONTROL.MINIMUM_HEIGHT) +
                  ENCLOSURE.GUTTER
                : this.state.vanityText.length > 0
                  ? this.getVanityTextDimensions().height +
                    KEY.HEIGHT +
                    ENCLOSURE.GUTTER * 3
                  : this.state.speakerDiameter > 0
                    ? this.state.speakerDiameter +
                      CONTROL.MINIMUM_HEIGHT +
                      ENCLOSURE.GUTTER * 3
                    : Math.max(
                          KEY.HEIGHT,
                          this.state.speakerDiameter +
                              ENCLOSURE.GUTTER +
                              CONTROL.MINIMUM_HEIGHT
                      ) +
                      ENCLOSURE.GUTTER * 2
    });

    getLocalState = () =>
        extend(
            this.defaultState,
            hasLocalStorage
                ? JSON.parse(localStorage.getItem(this.stateStorageKey))
                : {}
        );

    componentDidMount() {
        this.setState(this.getLocalState());
        this.updateMinimumKeyCountAndValidity();
        this.updateEnclosureDimensions();
    }

    getMaximumVanityTextLength = (
        keyCount = this.state.keyCount,
        speakerDiameter = this.state.speakerDiameter,
        controlPosition = this.getControlPosition()
    ) => {
        const possibleGutter = width => (width > 0 ? ENCLOSURE.GUTTER : 0);

        let availableWidh = keyCount * KEY.WIDTH;

        if (controlPosition === POSITION.BACK) {
            availableWidh -= possibleGutter(availableWidh) + speakerDiameter;

            if (this.state.knobsCount >= 0) {
                availableWidh -=
                    possibleGutter(availableWidh) +
                    HARDWARE.KNOB_DIAMETER * this.state.knobsCount +
                    ENCLOSURE.GUTTER * (this.state.knobsCount - 1);
            }
        }

        return Math.ceil(availableWidh / KEY.WIDTH);
    };

    updateMinimumKeyCountAndValidity = () => {
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
    };

    updateEnclosureDimensions = () => {
        if (this.state.valid) {
            this.setState({
                enclosureDimensions: this.getEnclosureDimensions(),
                vanityTextDimensions: this.getVanityTextDimensions()
            });
        }
    };

    getExportData = () => ({
        vanityText: this.state.vanityText,
        keyCount: this.state.keyCount,
        startingNoteIndex: this.state.startingNoteIndex,
        color: this.state.color,
        speakerDiameter: this.state.speakerDiameter,
        controlPosition: this.getControlPosition(),
        enclosureDimensions: this.state.enclosureDimensions,
        vanityTextDimensions: this.state.vanityTextDimensions
    });

    editState = (newState = {}) => {
        if (hasLocalStorage) {
            localStorage.setItem(
                this.stateStorageKey,
                JSON.stringify(extend(this.getLocalState(), newState))
            );
        }

        this.setState(newState, this.updateMinimumKeyCountAndValidity);
    };

    resetState = () => {
        const message =
            "Are yous sure? You will lose any changes you have made.";

        if (window.confirm(message)) {
            this.editState(this.defaultState);
        }
    };

    onModalOpen = modalKey => () => {
        this.setState({
            exportData: this.getExportData(), // todo conditionalize
            openModalKey: modalKey
        });
    };

    onModalClosed = modalKey => () => {
        if (this.state.openModalKey === modalKey) {
            this.setState({ openModalKey: undefined });

            if (hasLocalStorage && modalKey === "about") {
                localStorage.dismissedAboutModal = 1;
            }
        }
    };

    randomize = () => {
        const getRandomArrayValue = (values = []) =>
            values[Math.floor(values.length * Math.random())];
        const getRandom = (min = 0, max = 0) =>
            min + Math.round(Math.random() * (max - min));
        const controlPosition = getRandomArrayValue([
            POSITION.BACK,
            POSITION.RIGHT
        ]);

        const speakerDiameter = ((likelihood = 3 / 4) =>
            Math.random() <= likelihood
                ? this.defaultState.speakerDiameter
                : 0)();

        const keyCount = getRandom(
            this.getMinimumKeyCount(
                "Truthy!",
                speakerDiameter,
                controlPosition
            ),
            Math.round(OSKITONE.PRINTER.BED_WIDTH / KEY.WIDTH)
        );

        this.editState({
            controlPosition: controlPosition,
            keyCount: keyCount,
            speakerDiameter: speakerDiameter,
            vanityText: getCoolWordByLength(
                this.getMaximumVanityTextLength(
                    keyCount,
                    speakerDiameter,
                    controlPosition
                )
            ),
            startingNoteIndex: getRandom(0, 6),
            color: getRandomArrayValue(OSKITONE.AVAILABLE_COLORS)
        });

        setTimeout(() => {
            if (this.state.valid) {
                this.randomize();
            }
        }, 250);
    };

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
                `}</style>
            </Container>
        );
    }
}

export default Index;
