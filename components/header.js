import { Container, Row, Col } from "reactstrap";

const Header = props => (
    <Row>
        <Col>
            <h1>{props.title}</h1>
        </Col>

        <style jsx>{`
            h1 {
                margin: 1rem 0 2rem;
                text-transform: uppercase;
                font-weight: 800;
                font-family: Work Sans, -apple-system, BlinkMacSystemFont,
                    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
                    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            }
        `}</style>
    </Row>
);

export default Header;
