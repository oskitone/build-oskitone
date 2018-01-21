import { Button, Form, FormGroup, FormText, Input, Label } from "reactstrap";
import { TwitterPicker } from "react-color";

class ColorPicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            displayColorPicker: false,
            color: props.color
        };

        this.handleColorChange = this.handleColorChange.bind(this);
    }

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false });
    };

    handleColorChange = (color, event) => {
        this.props.onChange(color.hex);
    };

    render() {
        const popover = {
            position: "absolute",
            zIndex: "2",
            left: "50%"
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
                            colors={["#15EAFD", "#FF69B4"]}
                        />
                    </div>
                ) : null}
            </div>
        );
    }
}

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.state;
        this.handleChange = this.handleChange.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        let newState = {};

        if (this.props.state.hasOwnProperty(name)) {
            newState[name] = value;
            this.props.onChange(newState);
        }
    }

    handleColorChange(color, event) {
        console.log(color);
        this.props.onChange({ color: color });
    }

    render() {
        return (
            <div>
                <FormGroup>
                    <Label for="vanityText">Vanity text</Label>
                    <Input
                        type="text"
                        name="vanityText"
                        id="vanityText"
                        value={this.props.state.vanityText}
                        onChange={this.handleChange}
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="keyCount">Key count</Label>
                    <Input
                        type="select"
                        name="keyCount"
                        id="keyCount"
                        value={this.props.state.keyCount}
                        onChange={this.handleChange}
                    >
                        <option>8</option>
                        <option>12</option>
                        <option>15</option>
                    </Input>
                </FormGroup>

                <FormGroup>
                    <Label for="startingNoteIndex">Starting note index</Label>
                    <Input
                        type="select"
                        name="startingNoteIndex"
                        id="startingNoteIndex"
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
                </FormGroup>

                <FormGroup>
                    <Label for="color">Color</Label>
                    <ColorPicker
                        color={this.props.state.color}
                        onChange={this.handleColorChange}
                    />
                </FormGroup>

                <FormGroup>
                    <Button color="secondary" onClick={this.props.onReset}>
                        Reset
                    </Button>
                </FormGroup>
            </div>
        );
    }
}

export default Editor;
