import { debounce } from "lodash";
import { Stage, Layer, Group, Rect, Circle, Text } from "react-konva";
import { Alert } from "reactstrap";
import {
    COLOR,
    CONTROL,
    ENCLOSURE,
    HARDWARE,
    KEY,
    LABEL,
    POSITION
} from "../components/constants";
import PropTypes from "prop-types";

class PreviewRect extends React.Component {
    static propTypes = {
        stroke: PropTypes.string,
        strokeWidth: PropTypes.number
    };

    render() {
        return (
            <Rect
                {...this.props}
                stroke={this.props.stroke || COLOR.STROKE}
                strokeWidth={
                    isNaN(this.props.strokeWidth) ? 1 : this.props.strokeWidth
                }
                strokeScaleEnabled={false}
            />
        );
    }
}

class PreviewCircle extends React.Component {
    static propTypes = {
        stroke: PropTypes.string,
        strokeWidth: PropTypes.number
    };

    render() {
        return (
            <Circle
                {...this.props}
                stroke={this.props.stroke || COLOR.STROKE}
                strokeWidth={
                    isNaN(this.props.strokeWidth) ? 1 : this.props.strokeWidth
                }
                strokeScaleEnabled={false}
            />
        );
    }
}

class PreviewText extends React.Component {
    static propTypes = {
        fillWidth: PropTypes.number,
        fillHeight: PropTypes.number,
        fontSize: PropTypes.number,
        text: PropTypes.string,
        stroke: PropTypes.string,
        strokeWidth: PropTypes.number,
        x: PropTypes.number,
        y: PropTypes.number
    };

    constructor(props) {
        super(props);

        this.state = {
            fontSize: this.props.fontSize,
            text: this.props.text,
            x: this.props.x,
            y: this.props.y
        };
    }

    hasRoom = () => this.props.fillWidth > 0 && this.props.fillHeight > 0;

    isDynamic = () =>
        this.instance && this.props.fillWidth > 0 && this.props.fillHeight > 0;

    componentDidMount() {
        this.updateSizeAndPlacement(true);
    }

    componentDidUpdate() {
        this.updateSizeAndPlacement();
    }

    updateSizeAndPlacement = (forceUpdate = false) => {
        if (this.hasRoom() && this.isDynamic()) {
            const fontSize =
                Math.floor(
                    this.instance.getFontSize() *
                        Math.min(
                            this.props.fillWidth / this.instance.getWidth(),
                            this.props.fillHeight / this.instance.getHeight()
                        )
                ) || 1;
            const x =
                this.props.x +
                Math.round(
                    (this.props.fillWidth - this.instance.getWidth()) / 2
                );
            const y =
                this.props.y +
                Math.round(
                    (this.props.fillHeight - this.instance.getHeight()) / 2
                );

            const shouldUpdate =
                fontSize !== this.state.fontSize ||
                x !== this.state.x ||
                y !== this.state.y ||
                forceUpdate;

            if (shouldUpdate) {
                this.setState({
                    fontSize: fontSize,
                    x: x,
                    y: y
                });
            }
        }
    };

    render() {
        return (
            <Text
                {...this.props}
                ref={el => (this.instance = el)}
                x={this.state.x}
                y={this.state.y}
                fontSize={this.state.fontSize}
                stroke={this.props.stroke || COLOR.STROKE}
                strokeWidth={
                    isNaN(this.props.strokeWidth) ? 1 : this.props.strokeWidth
                }
                strokeScaleEnabled={false}
            />
        );
    }
}

class Preview extends React.Component {
    keyWidth = KEY.WIDTH;
    keyHeight = KEY.HEIGHT;
    accidentalKeyWidth = KEY.ACCIDENTAL_WIDTH;
    accidentalKeyHeight = KEY.ACCIDENTAL_HEIGHT;

    gutter = ENCLOSURE.GUTTER;
    relatedGutter = ENCLOSURE.RELATED_GUTTER;

    knobDiameter = HARDWARE.KNOB_DIAMETER;
    labelHeight = LABEL.HEIGHT;

    static propTypes = {
        state: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            stageWidth: 600,
            stageHeight: 600
        };

        this.stageEl = null;
    }

    getKeys = (
        keyCount = 0,
        startingNoteIndex = 0,
        includeNaturals = false,
        includeAccidentals = false
    ) => {
        let keys = [];

        for (var i = 0; i < keyCount; i++) {
            const x = i * this.keyWidth;

            if (includeNaturals) {
                keys.push({
                    width: this.keyWidth,
                    height: this.keyHeight,
                    x: x
                });
            }

            if (includeAccidentals) {
                const nextIsAccidental =
                    [2, 6].indexOf((i + startingNoteIndex) % 7) === -1;

                if (nextIsAccidental && i < keyCount - 1) {
                    keys.push({
                        width: this.accidentalKeyWidth,
                        height: this.accidentalKeyHeight,
                        x: x + this.keyWidth - this.accidentalKeyWidth / 2
                    });
                }
            }
        }

        return keys;
    };

    getControls = (knobsCount, startingX, startingY, availableHeight) => {
        const markerWidth = 2;
        const radius = this.knobDiameter / 2;

        let knobs = [];

        for (var i = 0; i < knobsCount; i++) {
            const x = startingX + i * (this.knobDiameter + this.gutter);
            const y =
                startingY + (availableHeight - CONTROL.MINIMUM_HEIGHT) / 2;

            knobs.push({
                knob: {
                    x: x + radius,
                    y: y + radius,
                    diameter: this.knobDiameter,
                    marker: {
                        x: x + radius - markerWidth / 2,
                        y: y,
                        width: markerWidth,
                        height: radius
                    }
                },
                label: {
                    x: x,
                    y: y + this.knobDiameter + this.relatedGutter,
                    width: this.knobDiameter,
                    height: this.labelHeight
                }
            });
        }

        return knobs;
    };

    updateStageDimensions = debounce(() => {
        if (this.stageEl) {
            this.setState({
                stageWidth: this.stageEl.clientWidth,
                stageHeight: this.stageEl.clientHeight
            });
        }
    }, 200);

    componentDidMount() {
        this.updateStageDimensions();
        window.addEventListener("resize", this.updateStageDimensions);
    }

    render() {
        this.updateStageDimensions();

        const state = this.props.state;
        state.speakerDiameter = parseFloat(state.speakerDiameter) || 0;
        state.startingNoteIndex = parseInt(state.startingNoteIndex);
        state.controlPosition = parseInt(state.controlPosition);

        const naturalKeys = this.getKeys(
            state.keyCount,
            state.startingNoteIndex,
            true,
            false
        );
        const accidentalKeys = this.getKeys(
            state.keyCount,
            state.startingNoteIndex,
            false,
            true
        );

        // TODO: use extracted getControlPosition()
        const controlPosition =
            state.controlPosition === POSITION.AUTO
                ? state.keyCount > 8 ? POSITION.BACK : POSITION.RIGHT
                : state.controlPosition;

        const controls = this.getControls(
            state.knobsCount,
            controlPosition === POSITION.BACK
                ? this.gutter * 2 + state.vanityTextDimensions.width
                : state.keyCount * this.keyWidth + this.gutter * 2,
            controlPosition === POSITION.BACK
                ? this.gutter
                : state.speakerDiameter > 0
                  ? this.gutter * 2 + state.speakerDiameter
                  : this.gutter,
            controlPosition === POSITION.BACK
                ? Math.max(
                      state.speakerDiameter,
                      state.vanityTextDimensions.height
                  )
                : this.knobDiameter + this.relatedGutter + this.labelHeight
        );

        const keyY =
            state.enclosureDimensions.height - this.keyHeight - this.gutter;

        const controlsWidth =
            HARDWARE.KNOB_DIAMETER * state.knobsCount +
            ENCLOSURE.GUTTER * Math.max(state.knobsCount - 1, 0);
        const controlsAndSpeakerSideWidth = Math.max(
            controlsWidth,
            state.speakerDiameter
        );

        const speakerX =
            state.enclosureDimensions.width -
            this.gutter -
            (controlPosition === POSITION.BACK
                ? state.speakerDiameter
                : controlsAndSpeakerSideWidth -
                  (controlsAndSpeakerSideWidth - state.speakerDiameter) / 2);

        const scale = state.sideways
            ? Math.min(
                this.state.stageHeight / state.enclosureDimensions.width,
                this.state.stageWidth / state.enclosureDimensions.height
            ) * 0.9
            : Math.min(
                this.state.stageWidth / state.enclosureDimensions.width,
                this.state.stageHeight / state.enclosureDimensions.height
            ) * 0.9;

        if (!state.renderable) {
            return (
                <Alert color="danger">
                    <h4 className="alert-heading">Input Error!</h4>
                    <p className="mb-0">Check form values, please.</p>
                </Alert>
            );
        }

        return (
            <div className="previewContainer" ref={el => (this.stageEl = el)}>
                <Stage
                    width={this.state.stageWidth}
                    height={this.state.stageHeight}
                    offset={{
                        x: this.state.stageWidth / -2,
                        y: this.state.stageHeight / -2
                    }}
                >
                    <Layer
                        scale={{ x: scale, y: scale }}
                        offset={{
                            x: state.enclosureDimensions.width / 2,
                            y: state.enclosureDimensions.height / 2
                        }}
                        rotation={state.sideways ? 90 : 0}
                    >
                        <PreviewRect
                            fill={state.color}
                            width={state.enclosureDimensions.width}
                            height={state.enclosureDimensions.height}
                        />
                        {controls.map((control, i) => (
                            <Group key={i}>
                                <PreviewCircle
                                    fill={COLOR.DARK}
                                    x={control.knob.x}
                                    y={control.knob.y}
                                    radius={control.knob.diameter / 2}
                                />
                                <PreviewRect
                                    fill={COLOR.LIGHT}
                                    x={control.knob.marker.x}
                                    y={control.knob.marker.y}
                                    width={control.knob.marker.width}
                                    height={control.knob.marker.height}
                                />
                                <PreviewRect
                                    fill={COLOR.DARK}
                                    x={control.label.x}
                                    y={control.label.y}
                                    width={control.label.width}
                                    height={control.label.height}
                                />
                            </Group>
                        ))}
                        <PreviewRect
                            fill={COLOR.DARK}
                            visible={!!state.speakerDiameter}
                            x={speakerX}
                            y={this.gutter}
                            width={state.speakerDiameter}
                            height={state.speakerDiameter}
                        />
                        <PreviewRect
                            fill="yellow"
                            x={this.gutter}
                            y={this.gutter}
                            width={state.vanityTextDimensions.width}
                            height={state.vanityTextDimensions.height}
                            visible={
                                state.debugMode && state.vanityText.length > 0
                            }
                        />
                        <PreviewText
                            text={state.vanityText
                                .substr(0, state.maximumVanityTextLength)
                                .toUpperCase()}
                            x={this.gutter}
                            y={this.gutter}
                            fillWidth={state.vanityTextDimensions.width}
                            fillHeight={state.vanityTextDimensions.height}
                            strokeWidth={1 / scale}
                            fill={COLOR.LIGHT}
                            fontFamily={"Work Sans"}
                            fontStyle={"900"}
                            align={"center"}
                        />
                        {naturalKeys.map((val, i) => (
                            <PreviewRect
                                key={i}
                                x={this.gutter + val.x}
                                y={keyY}
                                width={val.width}
                                height={val.height}
                                fill={COLOR.LIGHT}
                            />
                        ))}
                        {accidentalKeys.map((val, i) => (
                            <PreviewRect
                                key={i}
                                x={this.gutter + val.x}
                                y={keyY}
                                width={val.width}
                                height={val.height}
                                fill={COLOR.DARK}
                            />
                        ))}
                    </Layer>
                </Stage>
                <style jsx>{`
                    .previewContainer {
                        background: ${COLOR.LIGHT};
                    }

                    @media (min-width: 768px) {
                        .previewContainer {
                            position: absolute;
                            height: 100%;
                            left: 0;
                            right: 0;
                        }
                    }
                `}</style>
            </div>
        );
    }
}

export default Preview;
