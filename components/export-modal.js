import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import PropTypes from "prop-types";

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

export default ExportModal;
