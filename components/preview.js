import { throttle } from "lodash";
import { Stage, Layer, Rect, Text } from "react-konva";

class Preview extends React.Component {
    keyWidth = 14.24;
    keyHeight = 45.72;
    accidentalKeyWidth = 7.62;
    accidentalKeyHeight = 22.86;
    gutter = 5;

    constructor(props) {
        super(props);

        this.vanityText = props.state.vanityText;
        this.vanityTextHeight = 40;

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

        const naturalKeys = this.getKeys(
            state.keyCount,
            parseInt(state.startingNoteIndex),
            true,
            false
        );
        const accidentalKeys = this.getKeys(
            state.keyCount,
            parseInt(state.startingNoteIndex),
            false,
            true
        );

        const vanityTextWidth = this.keyWidth * state.keyCount;

        const enclosureWidth = state.keyCount * this.keyWidth + this.gutter * 2;
        const enclosureHeight =
            this.vanityTextHeight + this.keyHeight + this.gutter * 3;

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
                        <Rect
                            fill={state.color}
                            width={enclosureWidth}
                            height={enclosureHeight}
                            stroke="black"
                            strokeWidth={1}
                            strokeScaleEnabled={false}
                        />
                    </Layer>
                    <Layer>
                        <Text
                            text={state.vanityText.toUpperCase()}
                            x={this.gutter}
                            y={this.gutter}
                            width={vanityTextWidth}
                            height={this.vanityTextHeight}
                            fontSize={this.vanityTextHeight}
                            fontFamily="Work Sans"
                            fontStyle="900"
                            align="center"
                            fill="white"
                            stroke="black"
                            strokeWidth={0.5}
                            strokeScaleEnabled={false}
                        />
                    </Layer>
                    <Layer>
                        {naturalKeys.map((val, i) => (
                            <Rect
                                key={i}
                                x={this.gutter + val.x}
                                y={this.vanityTextHeight + this.gutter * 2}
                                width={val.width}
                                height={val.height}
                                stroke="black"
                                strokeWidth={1}
                                strokeScaleEnabled={false}
                                fill="white"
                            />
                        ))}
                    </Layer>
                    <Layer>
                        {accidentalKeys.map((val, i) => (
                            <Rect
                                key={i}
                                x={this.gutter + val.x}
                                y={this.vanityTextHeight + this.gutter * 2}
                                width={val.width}
                                height={val.height}
                                stroke="black"
                                strokeWidth={1}
                                strokeScaleEnabled={false}
                                fill="black"
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>
        );
    }
}

export default Preview;
