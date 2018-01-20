import { Container, Row, Col } from "reactstrap";

const Header = props => (
    <Row>
        <Col>
            <h1>{props.title}</h1>
        </Col>

        <style jsx>{`
            h1 {
                margin: 1rem 0 2rem;
            }
        `}</style>
    </Row>
);

export default Header;
