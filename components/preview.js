import { extend } from "lodash/fp";
import { times, throttle } from "lodash";
import { Stage, Layer, Rect, Circle, Text } from "react-konva";
import { COLOR, POSITION } from "../components/constants";

class PreviewRect extends React.Component {
    render(props) {
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
    render(props) {
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
    constructor(props) {
        super(props);

        this.state = {
            fontSize: this.props.fontSize,
            text: this.props.text,
            x: this.props.x,
            y: this.props.y
        };
    }

    hasRoom() {
        return this.props.fillWidth > 0 && this.props.fillHeight > 0;
    }

    isDynamic() {
        return this.instance && this.props.fillWidth && this.props.fillHeight;
    }

    componentDidUpdate() {
        if (this.hasRoom() && this.isDynamic()) {
            const fontSize = Math.floor(
                this.instance.getFontSize() *
                    Math.min(
                        this.props.fillWidth / this.instance.getWidth(),
                        this.props.fillHeight / this.instance.getHeight()
                    )
            );
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

            if (
                fontSize !== this.state.fontSize ||
                x !== this.state.x ||
                y !== this.state.y
            ) {
                this.setState({
                    fontSize: fontSize,
                    x: x,
                    y: y
                });
            }
        }
    }

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
    keyWidth = 14.24;
    keyHeight = 45.72;
    accidentalKeyWidth = 7.62;
    accidentalKeyHeight = 22.86;

    gutter = 5;
    relatedGutter = 2;

    knobDiameter = 22.4;
    labelHeight = 5;

    constructor(props) {
        super(props);

        this.vanityText = props.state.vanityText;

        this.controlMinimumHeight =
            this.knobDiameter + this.relatedGutter + this.labelHeight;

        this.state = {
            stageWidth: 600,
            stageHeight: 600
        };

        this.stageEl = null;

        this.updateStageDimensions = throttle(
            this.updateStageDimensions.bind(this),
            200
        );
    }

    getKeys(
        keyCount = 0,
        startingNoteIndex = 0,
        includeNaturals = false,
        includeAccidentals = false
    ) {
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
    }

    getControls(knobsCount, startingX, startingY, availableHeight) {
        const markerWidth = 2;
        const radius = this.knobDiameter / 2;

        let knobs = [];

        for (var i = 0; i < knobsCount; i++) {
            const x = startingX + i * (this.knobDiameter + this.gutter);
            const y =
                startingY + (availableHeight - this.controlMinimumHeight) / 2;

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
    }

    updateStageDimensions() {
        this.setState({
            stageWidth: this.stageEl.clientWidth,
            stageHeight: this.stageEl.clientHeight
        });
    }

    componentDidMount() {
        this.updateStageDimensions();
        window.addEventListener("resize", this.updateStageDimensions);
    }

    render() {
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

        const speakerWidth = state.speakerDiameter;
        const speakerHeight = state.speakerDiameter;

        const controlPosition =
            state.controlPosition === POSITION.AUTO
                ? state.keyCount > 8 ? POSITION.BACK : POSITION.RIGHT
                : state.controlPosition;

        const vanityTextWidth =
            this.keyWidth * state.keyCount -
            (controlPosition === POSITION.BACK
                ? (!!state.speakerDiameter ? this.gutter + speakerWidth : 0) +
                  state.knobsCount * (this.knobDiameter + this.gutter)
                : 0);
        const vanityTextHeight =
            controlPosition === POSITION.BACK
                ? state.speakerDiameter || 40
                : speakerHeight + this.controlMinimumHeight - this.keyHeight;

        const controls = this.getControls(
            state.knobsCount,
            controlPosition === POSITION.BACK
                ? this.gutter * 2 + vanityTextWidth
                : state.keyCount * this.keyWidth + this.gutter * 2,
            controlPosition === POSITION.BACK
                ? this.gutter
                : this.gutter * 2 + speakerWidth,
            controlPosition === POSITION.BACK
                ? Math.max(speakerHeight, vanityTextHeight)
                : this.knobDiameter + this.relatedGutter + this.labelHeight
        );

        const enclosureWidth =
            state.keyCount * this.keyWidth +
            this.gutter * 2 +
            (controlPosition === POSITION.BACK
                ? 0
                : speakerWidth > 0
                  ? speakerWidth + this.gutter
                  : this.knobDiameter * 2 + this.gutter * 2);
        const enclosureHeight =
            vanityTextHeight + this.keyHeight + this.gutter * 3;

        const offset = 5;
        const scale = Math.min(
            (this.state.stageWidth - offset * 5) / enclosureWidth,
            (this.state.stageHeight - offset * 5) / enclosureHeight
        );

        return (
            <div ref={el => (this.stageEl = el)}>
                <Stage
                    width={this.state.stageWidth}
                    height={this.state.stageHeight}
                    offset={{ x: -offset, y: -offset }}
                    scale={{ x: scale, y: scale }}
                >
                    <Layer>
                        <PreviewRect
                            fill={state.color}
                            width={enclosureWidth}
                            height={enclosureHeight}
                        />
                    </Layer>
                    {controls.map((control, i) => (
                        <Layer key={i}>
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
                        </Layer>
                    ))}
                    <Layer visible={!!state.speakerDiameter}>
                        <PreviewRect
                            fill={COLOR.DARK}
                            x={enclosureWidth - this.gutter - speakerWidth}
                            y={this.gutter}
                            width={speakerWidth}
                            height={speakerHeight}
                        />
                    </Layer>
                    <Layer>
                        <PreviewText
                            text={state.vanityText.toUpperCase()}
                            x={this.gutter}
                            y={this.gutter}
                            fillWidth={vanityTextWidth}
                            fillHeight={vanityTextHeight}
                            strokeWidth={1 / scale}
                            fill={COLOR.LIGHT}
                            fontFamily={"Work Sans"}
                            fontStyle={"900"}
                            align={"center"}
                        />
                    </Layer>
                    <Layer>
                        {naturalKeys.map((val, i) => (
                            <PreviewRect
                                key={i}
                                x={this.gutter + val.x}
                                y={vanityTextHeight + this.gutter * 2}
                                width={val.width}
                                height={val.height}
                                fill={COLOR.LIGHT}
                            />
                        ))}
                    </Layer>
                    <Layer>
                        {accidentalKeys.map((val, i) => (
                            <PreviewRect
                                key={i}
                                x={this.gutter + val.x}
                                y={vanityTextHeight + this.gutter * 2}
                                width={val.width}
                                height={val.height}
                                fill={COLOR.DARK}
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>
        );
    }
}

export default Preview;
