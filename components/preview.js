import { Table } from "reactstrap";

class Preview extends React.Component {
    render() {
        const vanityText = this.props.state.vanityText;
        const keyCount = this.props.state.keyCount;
        const startingNoteIndex = this.props.state.startingNoteIndex;
        const color = this.props.state.color;

        return (
            <div>
                <Table hover bordered>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Value</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>vanityText</th>
                            <td>{vanityText}</td>
                        </tr>
                        <tr>
                            <th>keyCount</th>
                            <td>{keyCount}</td>
                        </tr>
                        <tr>
                            <th>startingNoteIndex</th>
                            <td>{startingNoteIndex}</td>
                        </tr>
                        <tr>
                            <th>color</th>
                            <td>{color}</td>
                        </tr>
                    </tbody>
                </Table>

                <style jsx>{``}</style>
            </div>
        );
    }
}

export default Preview;
