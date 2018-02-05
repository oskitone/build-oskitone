import { Col, Button, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import { TwitterPicker } from "react-color";
import { AUDIO_OUT, COLOR, POSITION } from "../components/constants";
import PropTypes from "prop-types";

class ColorPicker extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        color: PropTypes.string,
        onChange: PropTypes.func,
        size: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            displayColorPicker: false,
            color: props.color
        };
    }

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false });
    };

    handleColorChange = color => {
        this.props.onChange(color.hex);
    };

    render() {
        const popover = {
            position: "absolute",
            zIndex: "2"
        };
        const cover = {
            position: "fixed",
            top: "0px",
            right: "0px",
            bottom: "0px",
            left: "0px"
        };
        return (
            <div>
                <Input
                    onClick={this.handleClick}
                    value={this.props.color}
                    size={this.props.size}
                    id={this.props.id}
                    onChange={event =>
                        this.handleColorChange(event.target.value)
                    }
                />
                {this.state.displayColorPicker ? (
                    <div style={popover}>
                        <div style={cover} onClick={this.handleClose} />
                        <TwitterPicker
                            onChange={this.handleColorChange}
                            color={this.props.color}
                            colors={[
                                COLOR.AQUA_BLUE,
                                COLOR.HOT_PINK,
                                COLOR.APPLE_GREEN
                            ]}
                        />
                    </div>
                ) : null}
            </div>
        );
    }
}

class Editor extends React.Component {
    static propTypes = {
        state: PropTypes.object,
        onChange: PropTypes.func,
        onReset: PropTypes.func,
        onInquire: PropTypes.func,
        inquireUrl: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = props.state;

        this.state.moreButtonIsOpen = false;
    }

    handleChange = event => {
        const name = event.target.name;
        const value = event.target.value;

        let newState = {};

        if (this.props.state.hasOwnProperty(name)) {
            newState[name] = value;
            this.props.onChange(newState);
        }
    };

    handleColorChange = color => {
        this.props.onChange({ color: color });
    };

    toggleMoreButton = () => {
        this.setState({ moreButtonIsOpen: !this.state.moreButtonIsOpen });
    };

    render() {
        const cols = [5, 7];

        const isValid = key => {
            const valid = this.props.state.inputValidities[key];

            // Intentionally avoiding "true" valid state styling
            return valid === true || valid === undefined ? null : false;
        };

        return (
            <div>
                <FormGroup row>
                    <Label for="vanityText" xl={cols[0]} size="sm">
                        Vanity text
                    </Label>
                    <Col xl={cols[1]}>
                        <Input
                            valid={isValid("vanityText")}
                            type="text"
                            name="vanityText"
                            id="vanityText"
                            bsize="sm"
                            value={this.props.state.vanityText}
                            onChange={this.handleChange}
                        />
                        <FormFeedback>
                            No more than{" "}
                            {this.props.state.maximumVanityTextLength}{" "}
                            characters
                        </FormFeedback>
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="keyCount" xl={cols[0]} size="sm">
                        Natural key count
                    </Label>
                    <Col xl={cols[1]}>
                        <Input
                            valid={isValid("keyCount")}
                            type="number"
                            min={this.props.state.minimumKeyCount}
                            max={this.props.state.maximumKeyCount}
                            name="keyCount"
                            id="keyCount"
                            bsize="sm"
                            value={this.props.state.keyCount}
                            onChange={this.handleChange}
                        />
                        <FormFeedback>
                            Round numbers from{" "}
                            {this.props.state.minimumKeyCount} to{" "}
                            {this.props.state.maximumKeyCount} only
                        </FormFeedback>
                    </Col>
                </FormGroup>

                <FormGroup
                    row
                    style={{
                        display: this.props.state.debugMode ? "flex" : "none"
                    }}
                >
                    <Label for="knobsCount" xl={cols[0]} size="sm">
                        Knobs
                    </Label>
                    <Col xl={cols[1]}>
                        <Input
                            type="number"
                            min={0}
                            max={4}
                            name="knobsCount"
                            id="knobsCount"
                            bsize="sm"
                            value={this.props.state.knobsCount}
                            onChange={this.handleChange}
                        />
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="startingNoteIndex" xl={cols[0]} size="sm">
                        Starting note
                    </Label>
                    <Col xl={cols[1]}>
                        <Input
                            type="select"
                            name="startingNoteIndex"
                            id="startingNoteIndex"
                            bsize="sm"
                            value={this.props.state.startingNoteIndex}
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
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="controlPosition" xl={cols[0]} size="sm">
                        Control position
                    </Label>
                    <Col xl={cols[1]}>
                        <Input
                            type="select"
                            name="controlPosition"
                            id="controlPosition"
                            bsize="sm"
                            value={this.props.state.controlPosition}
                            onChange={this.handleChange}
                        >
                            <option value={POSITION.AUTO}>Auto</option>
                            <option value={POSITION.BACK}>Back</option>
                            <option value={POSITION.RIGHT}>Right</option>
                        </Input>
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="speakerDiameter" xl={cols[0]} size="sm">
                        Speaker size
                    </Label>
                    <Col xl={cols[1]}>
                        <Input
                            type="select"
                            name="speakerDiameter"
                            id="speakerDiameter"
                            bsize="sm"
                            value={this.props.state.speakerDiameter}
                            onChange={this.handleChange}
                        >
                            <option value="49.8">2&quot; x 2&quot;</option>
                            <option value="0">None</option>
                        </Input>
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="audioOut" xl={cols[0]} size="sm">
                        Audio Out
                    </Label>
                    <Col xl={cols[1]}>
                        <Input
                            type="select"
                            name="audioOut"
                            id="audioOut"
                            bsize="sm"
                            value={this.props.state.audioOut}
                            onChange={this.handleChange}
                        >
                            <option value={AUDIO_OUT.NONE}>None</option>
                            <option value={AUDIO_OUT.QUARTER_INCH}>1/4"</option>
                        </Input>
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="color" xl={cols[0]} size="sm">
                        Color
                    </Label>
                    <Col xl={cols[1]}>
                        <ColorPicker
                            bsize="sm"
                            color={this.props.state.color}
                            onChange={this.handleColorChange}
                            id="color"
                        />
                    </Col>
                </FormGroup>

                <FormGroup>
                    <Button
                        size="sm"
                        color="primary"
                        disabled={!this.props.state.valid}
                        onClick={this.props.onInquire}
                    >
                        Purchase
                    </Button>{" "}
                    <Button
                        size="sm"
                        color="secondary"
                        onClick={this.props.onReset}
                    >
                        Reset
                    </Button>
                </FormGroup>
            </div>
        );
    }
}

export default Editor;
