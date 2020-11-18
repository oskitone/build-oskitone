import { Alert, Col, Container, Row } from "reactstrap";
import Editor from "../components/editor";
import {
    AboutModal,
    ExportModal,
    ImportModal,
    InquireModal
} from "../components/modals";
import Head from "../components/head";
import Header from "../components/header";
import Preview from "../components/preview";
import {
    AUDIO_OUT,
    COLOR,
    CONTROL,
    ENCLOSURE,
    HARDWARE,
    KEY,
    MODEL,
    MODEL_DEFAULTS,
    OSKITONE,
    POSITION
} from "../components/constants";
import { getCoolWordByLength } from "../components/cool-words";
import ReactGA from "react-ga";
import PropTypes from "prop-types";

// ERROR: You may need an appropriate loader to handle this file type
// import "bootstrap/dist/css/bootstrap.css";

const hasLocalStorage = typeof localStorage !== "undefined";
const hasWindow = typeof window !== "undefined";

const gutter = (val, gutter = ENCLOSURE.GUTTER) =>
    val > 0 ? val + gutter : val;

const defaultModel = MODEL.OKAY;
class Index extends React.Component {
    stateStorageKey = "STATE";

    defaultState = Object.assign({}, MODEL_DEFAULTS[defaultModel], {
        model: defaultModel,
        color: COLOR.AQUA_BLUE,
        vanityText: "OKAY",
        debugMode: false,
        valid: true,
        minimumKeyCount: 3,
        maximumKeyCount: 88,
        enclosureDimensions: { width: undefined, height: undefined },
        vanityTextDimensions: { width: undefined, height: undefined },
        inputValidities: {},
        sideways: false,
        openModalKey:
            hasLocalStorage && !localStorage.dismissedAboutModal
                ? "about"
                : undefined,
        exportData: undefined
    });

    static propTypes = {
        url: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.vanityTextMinimumWidth =
            KEY.WIDTH * this.defaultState.minimumKeyCount;
        this.minimumVanityTextHeight = HARDWARE.KNOB_DIAMETER;

        this.state = this.getLocalState();
        this.pageModel = (props.url.query || {}).model;

        this.sendTracking =
            !!process.env.GA_TRACKING_ID &&
            process.env.GA_TRACKING_ID !== "null";
        if (this.sendTracking) {
            ReactGA.initialize(process.env.GA_TRACKING_ID, {
                debug: process.env.NODE_ENV !== "production"
            });
        }

        if (hasWindow) {
            window.randomize = this.randomize; // Easter egg!

            window.toggleDebug = () => {
                this.setState({ debugMode: !this.state.debugMode });
            };
        }
    }

    getMinimumKeyCount = (
        vanityText = this.state.vanityText,
        speakerDiameter = this.state.speakerDiameter,
        controlPosition = this.state.controlPosition
    ) => {
        const possibleGutter = width => (width > 0 ? ENCLOSURE.GUTTER : 0);

        let width = 0;

        if (vanityText.length > 0) {
            width += this.vanityTextMinimumWidth;
        }

        if (controlPosition === POSITION.BACK) {
            width += possibleGutter(width) + speakerDiameter;

            if (this.state.knobsCount >= 0) {
                width += possibleGutter(width) + this.getControlsWidth();
            }
        }

        return Math.max(
            Math.ceil(width / KEY.WIDTH),
            this.defaultState.minimumKeyCount
        );
    };

    getMaximumKeyCount = () => this.defaultState.maximumKeyCount;

    // TODO: factor in knobsCount, extract or expose
    getControlPosition = (
        controlPosition = this.state.controlPosition,
        keyCount = this.state.keyCount
    ) =>
        controlPosition === POSITION.AUTO
            ? this.state.keyCount > 8 ? POSITION.BACK : POSITION.RIGHT
            : controlPosition;

    getVanityTextDimensions = () => {
        const controlHeight =
            this.state.knobsCount > 0 ? CONTROL.MINIMUM_HEIGHT : 0;

        return {
            width:
                KEY.WIDTH * this.state.keyCount -
                (this.getControlPosition() === POSITION.BACK
                    ? (this.state.speakerDiameter > 0
                          ? ENCLOSURE.GUTTER + this.state.speakerDiameter
                          : 0) + gutter(this.getControlsWidth())
                    : 0),
            height: Math.max(
                this.getControlPosition() === POSITION.BACK
                    ? Math.max(this.state.speakerDiameter, controlHeight)
                    : this.state.speakerDiameter + controlHeight - KEY.HEIGHT,
                this.minimumVanityTextHeight
            )
        };
    };

    getControlsWidth = () =>
        HARDWARE.KNOB_DIAMETER * this.state.knobsCount +
        ENCLOSURE.GUTTER * Math.max(this.state.knobsCount - 1, 0);

    getEnclosureDimensions = () => {
        const controlHeight =
            this.state.knobsCount > 0 ? CONTROL.MINIMUM_HEIGHT : 0;

        const possibleSideWidth =
            this.getControlPosition() === POSITION.BACK
                ? 0
                : Math.max(this.state.speakerDiameter, this.getControlsWidth());

        return {
            width:
                this.state.keyCount * KEY.WIDTH +
                ENCLOSURE.GUTTER * 2 +
                gutter(possibleSideWidth),
            height:
                this.getControlPosition() === POSITION.BACK
                    ? KEY.HEIGHT +
                      ENCLOSURE.GUTTER * 2 +
                      gutter(
                          Math.max(
                              this.state.vanityText.length > 0
                                  ? this.minimumVanityTextHeight
                                  : 0,
                              this.state.speakerDiameter,
                              controlHeight
                          )
                      )
                    : this.state.vanityText.length > 0
                      ? this.getVanityTextDimensions().height +
                        KEY.HEIGHT +
                        ENCLOSURE.GUTTER * 3
                      : this.state.speakerDiameter > 0
                        ? gutter(this.state.speakerDiameter) +
                          gutter(controlHeight) +
                          ENCLOSURE.GUTTER
                        : Math.max(
                              KEY.HEIGHT,
                              this.state.speakerDiameter +
                                  ENCLOSURE.GUTTER +
                                  controlHeight
                          ) +
                          ENCLOSURE.GUTTER * 2
        };
    };

    getLocalState = () =>
        Object.assign(
            {},
            this.defaultState,
            hasLocalStorage
                ? JSON.parse(localStorage.getItem(this.stateStorageKey))
                : {}
        );

    componentDidMount() {
        if (this.pageModel !== undefined) {
            this.changeModel(this.pageModel);
        } else {
            this.setState(this.getLocalState());
        }

        this.updateMinimumKeyCountAndValidity();
        this.updateEnclosureDimensions();

        if (this.sendTracking) {
            ReactGA.pageview(window.location.pathname + window.location.search);
        }
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
                    possibleGutter(availableWidh) + this.getControlsWidth();
            }
        }

        return Math.ceil(availableWidh / KEY.WIDTH);
    };

    updateMinimumKeyCountAndValidity = () => {
        const minimumKeyCount = this.getMinimumKeyCount();
        const maximumKeyCount = this.getMaximumKeyCount();

        const keyCountIsValid =
            this.state.keyCount >= minimumKeyCount &&
            this.state.keyCount <= maximumKeyCount &&
            this.state.keyCount % 1 === 0;

        const maximumVanityTextLength = this.getMaximumVanityTextLength();
        const vanityTextIsValid =
            this.state.vanityText.length <= maximumVanityTextLength;

        this.setState(
            {
                minimumKeyCount: minimumKeyCount,
                maximumKeyCount: maximumKeyCount,
                maximumVanityTextLength: maximumVanityTextLength,
                inputValidities: {
                    vanityText: vanityTextIsValid,
                    keyCount: keyCountIsValid
                },
                valid: keyCountIsValid && vanityTextIsValid,
                renderable: keyCountIsValid
            },
            this.updateEnclosureDimensions
        );
    };

    updateEnclosureDimensions = () => {
        if (this.state.renderable) {
            this.setState({
                enclosureDimensions: this.getEnclosureDimensions(),
                vanityTextDimensions: this.getVanityTextDimensions()
            });
        }
    };

    getExportData = () => {
        let data = {
            model: this.getModel(),
            vanityText: this.state.vanityText,
            keyCount: this.state.keyCount,
            startingNoteIndex: this.state.startingNoteIndex,
            color: this.state.color,
            speakerDiameter: this.state.speakerDiameter,
            controlPosition: this.getControlPosition(),
            audioOut: this.state.audioOut,
            enclosureDimensions: this.state.enclosureDimensions,
            vanityTextDimensions: this.state.vanityTextDimensions
        };

        if (this.state.debugMode) {
            data.knobsCount = parseInt(this.state.knobsCount);
        }

        return data;
    };

    getModel = (newState = {}) => {
        let model = MODEL.CUSTOM;

        const state = Object.assign({}, this.state, newState);
        state.keyCount = parseInt(state.keyCount);
        state.audioOut = parseInt(state.audioOut);
        state.controlPosition = this.getControlPosition(
            state.controlPosition,
            state.keyCount
        );

        for (let modelKey in MODEL_DEFAULTS) {
            let match = true;

            for (let key in MODEL_DEFAULTS[modelKey]) {
                match = match && state[key] === MODEL_DEFAULTS[modelKey][key];
            }

            if (match) {
                model = modelKey;
            }
        }

        return model;
    };

    editState = (newState = {}) => {
        if (hasLocalStorage) {
            localStorage.setItem(
                this.stateStorageKey,
                JSON.stringify(
                    Object.assign({}, this.getLocalState(), newState)
                )
            );
        }

        this.setState(newState, this.updateMinimumKeyCountAndValidity);

        if (this.sendTracking) {
            ReactGA.event({
                category: "Interaction",
                action: "Edit",
                label: Object.keys(newState)[0]
            });
        }
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

        if (this.sendTracking) {
            ReactGA.modalview(modalKey);
        }
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
            audioOut: getRandomArrayValue([
                AUDIO_OUT.NONE,
                AUDIO_OUT.QUARTER_INCH
            ]),
            startingNoteIndex: getRandom(0, 6),
            color: getRandomArrayValue(OSKITONE.AVAILABLE_COLORS)
        });

        setTimeout(() => {
            if (this.state.valid) {
                this.randomize();
            }
        }, 250);
    };

    importSave = data => {
        const get = key =>
            data[key] !== undefined ? data[key] : this.defaultState[key];

        const newState = {
            vanityText: get("vanityText"),
            keyCount: get("keyCount"),
            startingNoteIndex: get("startingNoteIndex"),
            color: get("color"),
            speakerDiameter: get("speakerDiameter"),
            controlPosition: get("controlPosition"),
            audioOut: get("audioOut"),
            knobsCount: get("knobsCount")
        };

        newState.model = this.getModel(newState);

        this.editState(newState);
    };

    changeModel = model => {
        this.editState(
            Object.assign({}, { model: model }, MODEL_DEFAULTS[model])
        );
    };

    render() {
        const verticalGutterRem = 1;

        return (
            <Container className="container">
                <Head
                    title="build.oskitone"
                    description="Design your own Oskitone Synthesizer"
                    url="http://build.oskitone.com/"
                    ogImage="http://build.oskitone.com/static/haha-sup.png"
                />
                <Header onAboutClick={this.onModalOpen("about")} />

                <Alert color="danger">
                    <strong>Update Fall 2020:</strong> This project is deprecated and isn't accepting new orders. Sorry! Thanks!
                </Alert>

                <Row className="editorAndPreview">
                    <Col xs="12" md="4">
                        <Editor
                            state={this.state}
                            onChange={this.editState}
                            onModelChange={this.changeModel}
                            onReset={this.resetState}
                            onInquire={this.onModalOpen("inquire")}
                            onExport={this.onModalOpen("export")}
                            onImport={this.onModalOpen("import")}
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

                <ExportModal
                    isOpen={this.state.openModalKey === "export"}
                    onClosed={this.onModalClosed("export")}
                    onInquire={this.onModalOpen("inquire")}
                    data={this.state.exportData}
                />

                <ImportModal
                    isOpen={this.state.openModalKey === "import"}
                    onClosed={this.onModalClosed("import")}
                    onImportSave={this.importSave}
                    data={this.state.exportData}
                />

                <InquireModal
                    isOpen={this.state.openModalKey === "inquire"}
                    onClosed={this.onModalClosed("inquire")}
                    data={this.state.exportData}
                />

                <script
                    dangerouslySetInnerHTML={{
                        __html: `env = ${JSON.stringify({
                            NODE_ENV: process.env.NODE_ENV,
                            GA_TRACKING_ID: process.env.GA_TRACKING_ID
                        })}`
                    }}
                />
                <style jsx>{`
                    :global(body) {
                        margin: ${verticalGutterRem}rem 0;
                    }

                    :global(.btn-primary, .btn-primary:hover, .btn-primary:active, .btn-primary:not(:disabled):not(.disabled):active) {
                        background: ${COLOR.AQUA_BLUE_DARK};
                        border-color: ${COLOR.AQUA_BLUE_DARK};
                    }

                    :global(.btn-info, .btn-info:hover, .btn-info:active, .btn-info:not(:disabled):not(.disabled):active) {
                        background: ${COLOR.HOT_PINK};
                        border-color: ${COLOR.HOT_PINK};
                    }
                `}</style>
            </Container>
        );
    }
}

export default Index;
