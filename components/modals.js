import { round } from "lodash";
import {
    Alert,
    Button,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Table
} from "reactstrap";
import PropTypes from "prop-types";

import { COLOR, POSITION } from "../components/constants";

class ExportModal extends React.Component {
    static propTypes = {
        isOpen: PropTypes.bool,
        data: PropTypes.object,
        onClosed: PropTypes.func,
        onInquire: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = { open: this.props.isOpen };
    }

    componentWillReceiveProps(props) {
        this.setState({ isOpen: props.isOpen });
    }

    render() {
        return (
            <Modal
                onClosed={this.props.onClosed}
                isOpen={this.state.isOpen}
                toggle={this.props.onClosed}
            >
                <ModalHeader>Export</ModalHeader>
                <ModalBody>
                    <p>Copy and save this text to your computer.</p>
                    <pre>{JSON.stringify(this.props.data, null, 4)}</pre>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.props.onInquire}>
                        Inquire for purchase
                    </Button>
                    <Button onClick={this.props.onClosed}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

class InquireModal extends React.Component {
    static propTypes = {
        isOpen: PropTypes.bool,
        data: PropTypes.object,
        onClosed: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            open: this.props.isOpen,
            option: undefined,
            windowAttemptedToOpen: false
        };

        this.onInquire = this.onInquire.bind(this);
        this.handleOptionSelection = this.handleOptionSelection.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({ isOpen: props.isOpen });
    }

    onInquire() {
        const subject = "Purchase Inquiry [build.oskitone]";
        const body =
            'Hello, I would like to inquire about purchasing a synth of type "' +
            this.state.option +
            '" and the following design values:\n\n' +
            JSON.stringify(this.props.data, null, 4);

        const url =
            "mailto:orders@oskitone.com?subject=" +
            encodeURIComponent(subject) +
            "&body=" +
            encodeURIComponent(body);

        window.open(url);

        this.setState({ windowAttemptedToOpen: true });
    }

    getControlPositionText(controlPosition) {
        if (controlPosition === POSITION.AUTO) {
            return "Auto";
        }
        if (controlPosition === POSITION.BACK) {
            return "Back";
        }
        if (controlPosition === POSITION.LEFT) {
            return "Left";
        }
        if (controlPosition === POSITION.RIGHT) {
            return "Right";
        }
    }

    getStartingNoteIndexText() {
        return ["C", "D", "E", "F", "G", "A", "B"][
            this.props.data.startingNoteIndex
        ];
    }

    getDimensionsText() {
        const dimensions = this.props.data.enclosureDimensions;

        const toEnglish = value => {
            return round(value / 25.4, 2);
        };

        return (
            toEnglish(dimensions.width) +
            '" x ' +
            toEnglish(dimensions.height) +
            '" x 2.2"'
        );
    }

    getSpeakerSizeText() {
        return this.props.data.speakerDiameter > 0
            ? '2" x 2"' // TODO: extract
            : "None";
    }

    getCanBeMadeByOskitone(
        maxWidth = 250,
        maxLength = 210,
        availableColors = [
            COLOR.AQUA_BLUE.toUpperCase(),
            COLOR.HOT_PINK.toUpperCase(),
            COLOR.APPLE_GREEN.toUpperCase()
        ]
    ) {
        const colorIsAvailable =
            availableColors.indexOf(this.props.data.color.toUpperCase()) !== -1;

        const willFitOnPrinter =
            this.props.data.enclosureDimensions.width <= maxWidth &&
            this.props.data.enclosureDimensions.height <= maxLength;

        return colorIsAvailable && willFitOnPrinter;
    }

    handleOptionSelection(event) {
        this.setState({ option: event.target.value });
    }

    render() {
        const props = this.props;
        const data = props.data;

        if (!data) {
            return null;
        }

        return (
            <Modal
                onClosed={props.onClosed}
                isOpen={this.state.isOpen}
                toggle={props.onClosed}
            >
                <ModalHeader>Inquire for purchase</ModalHeader>
                <ModalBody>
                    <Alert
                        color="danger"
                        style={{
                            display: !this.getCanBeMadeByOskitone()
                                ? "block"
                                : "none"
                        }}
                    >
                        <h4 className="alert-heading">
                            There may be a problem...
                        </h4>
                        <p>
                            Looks like your design cannot fully be made by
                            Oskitone, because it is either too big or in an
                            unsupported color. This limits your available
                            options below to only the DIY Kit without any
                            3D-printed parts.
                        </p>
                        <p className="mb-0">
                            To fix that, make your instrument smaller and use
                            one of the default color options.
                        </p>
                    </Alert>

                    <p>Thank you for your interest!</p>

                    <h5>About the synth</h5>

                    <p className="small">
                        Your synth will be based on the Oskitone{" "}
                        <a href="http://blog.tommy.sh/posts/okay-synth">
                            OKAY Synth
                        </a>{" "}
                        and its followup, the{" "}
                        <a href="http://blog.tommy.sh/posts/okay-2-synth">
                            OKAY 2
                        </a>. It will have the same controls (Octave and
                        Volume), the same monophonic square-wave sound, and use
                        the same analog internals...
                    </p>
                    <p className="small">
                        <em>But it will have your design!!</em>
                    </p>

                    <Table size="sm" className="small">
                        <tbody>
                            <tr>
                                <th>Vanity text</th>
                                <td>
                                    {data.vanityText.length
                                        ? data.vanityText.toUpperCase()
                                        : "None"}
                                </td>
                            </tr>
                            <tr>
                                <th>Keys</th>
                                <td>
                                    {data.keyCount} natural keys, starting at
                                    the note of{" "}
                                    {this.getStartingNoteIndexText()}
                                </td>
                            </tr>
                            <tr>
                                <th>Control position</th>
                                <td>
                                    {this.getControlPositionText(
                                        data.controlPosition
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>Color</th>
                                <td>
                                    <span
                                        style={{
                                            width: "1rem",
                                            height: "1rem",
                                            backgroundColor: data.color,
                                            display: "inline-block",
                                            verticalAlign: "text-bottom",
                                            margin: "0 .5rem 0 0"
                                        }}
                                    />
                                    <span>{data.color}</span>
                                </td>
                            </tr>
                            <tr>
                                <th>Speaker</th>
                                <td>{this.getSpeakerSizeText()}</td>
                            </tr>
                            <tr>
                                <th>Dimensions</th>
                                <td>
                                    {this.getDimensionsText()}{" "}
                                    <span className="text-muted">
                                        (approximate)
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <th>Battery</th>
                                <td>
                                    9v{" "}
                                    <span className="text-muted">
                                        (not included)
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </Table>

                    <hr />

                    <h5>Next steps</h5>

                    <p className="small">
                        Select an option and press the button below to start an
                        email conversation. You are not obligated to purchase.
                    </p>

                    <Label for="option">Option</Label>
                    <Table size="sm" className="small">
                        <tbody>
                            <tr>
                                <td>
                                    <FormGroup check>
                                        <Input
                                            type="radio"
                                            id="optionByop"
                                            name="option"
                                            value="DIY Kit BYOP"
                                            onChange={
                                                this.handleOptionSelection
                                            }
                                        />
                                    </FormGroup>
                                </td>
                                <td>
                                    <Label for="optionByop">
                                        <strong>
                                            DIY Kit BYOP (Bring Your Own
                                            Printer)
                                        </strong>
                                        <br />
                                        Just the electronics, which you'll
                                        solder and assemble. The 3D models will
                                        be sent to your email for you to print
                                        on your own. If you have access to a 3D
                                        printer, this is the kit for you!
                                    </Label>
                                </td>
                                <td className="cost">
                                    <Label for="optionByop">$50 to $150</Label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <FormGroup check>
                                        <Input
                                            type="radio"
                                            id="optionComplete"
                                            name="option"
                                            value="DIY Kit Complete"
                                            onChange={
                                                this.handleOptionSelection
                                            }
                                            disabled={
                                                !this.getCanBeMadeByOskitone()
                                            }
                                        />
                                    </FormGroup>
                                </td>
                                <td>
                                    <Label for="optionComplete">
                                        <strong>DIY Kit Complete</strong>
                                        <br />
                                        Electronics and{" "}
                                        <em>all 3D-printed parts</em> --
                                        everything you need to build at home.
                                    </Label>
                                </td>
                                <td className="cost">
                                    <Label for="optionComplete">
                                        $100 to 200
                                    </Label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <FormGroup check>
                                        <Input
                                            type="radio"
                                            id="optionFullyAssembled"
                                            name="option"
                                            value="Fully Assembled"
                                            onChange={
                                                this.handleOptionSelection
                                            }
                                            disabled={
                                                !this.getCanBeMadeByOskitone()
                                            }
                                        />
                                    </FormGroup>
                                </td>
                                <td>
                                    <Label for="optionFullyAssembled">
                                        <strong>Fully Assembled</strong>
                                        <br />
                                        Fully assembled, tuned, and ready to
                                        play!
                                    </Label>
                                </td>
                                <td className="cost">
                                    <Label for="optionFullyAssembled">
                                        $150 to $300
                                    </Label>
                                </td>
                            </tr>
                        </tbody>
                    </Table>

                    <h6>Please note</h6>

                    <ul className="text-muted small">
                        <li>
                            A revised price within the described range will be
                            emailed to you after you complete this form.
                        </li>
                        <li>
                            Custom designs are created manually. Please allow up
                            to 2 business days to receive 3D model files (if
                            applicable) and up to 10 business days for fully
                            assembled instruments.
                        </li>
                        <li>
                            Soldering and basic tools (like screwdrivers, wire
                            cutters, ruler, etc) required for both DIY kits. A
                            printed assembly guide with detailed instructions,
                            circuit schematics, helpful tips, and experiment
                            suggestions will come included.
                        </li>
                    </ul>
                    <Alert
                        color="info"
                        style={{
                            display: this.state.windowAttemptedToOpen
                                ? "block"
                                : "none"
                        }}
                    >
                        <p className="small">
                            A new window should have opened with an email for
                            you to send.
                        </p>
                        <p className="small mb-0">
                            If that did not happen, please copy the table
                            contents above and send it to orders@oskitone.com
                            along with your option selection.
                        </p>
                    </Alert>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.onInquire}>
                        Inquire for purchase
                    </Button>
                    <Button onClick={this.props.onClosed}>Cancel</Button>
                </ModalFooter>
                <style jsx>{`
                    th,
                    .cost {
                        white-space: nowrap;
                    }

                    .cost {
                        font-style: italic;
                    }
                `}</style>
            </Modal>
        );
    }
}

export { ExportModal, InquireModal };
