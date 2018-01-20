import { Button, Form, FormGroup, FormText, Input, Label } from "reactstrap";

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.state;
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        let newState = {};

        if (this.props.state.hasOwnProperty(name)) {
            newState[name] = isNaN(value) ? value : +value;
            this.props.onChange(newState);
        }
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
                        defaultValue={this.props.state.vanityText}
                        onChange={this.handleChange}
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="keyCount">Key count</Label>
                    <Input
                        type="select"
                        name="keyCount"
                        id="keyCount"
                        defaultValue={this.props.state.keyCount}
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
                        defaultValue={this.props.state.keyCount}
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
                    <Input
                        type="text"
                        name="color"
                        id="color"
                        defaultValue={this.props.state.color}
                        onChange={this.handleChange}
                    />
                </FormGroup>
            </div>
        );
    }
}

export default Editor;
