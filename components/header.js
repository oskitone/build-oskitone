import { Badge, Button, Row, Col } from "reactstrap";
import PropTypes from "prop-types";

class Header extends React.Component {
    static propTypes = {
        onAboutClick: PropTypes.func
    };

    render() {
        return (
            <Row>
                <Col xs="12" md="7">
                    <h1>
                        <span className="build">build</span>.<span className="oskitone">
                            oskitone
                        </span>
                    </h1>
                    <Badge
                        pill
                        color="secondary"
                        style={{ verticalAlign: "text-bottom" }}
                    >
                        beta
                    </Badge>
                </Col>
                <Col xs="12" md="5">
                    <ul className="links">
                        <li>
                            <a href="http://www.oskitone.com/">Store</a>
                        </li>
                        <li>
                            <a href="https://github.com/rocktronica/build-oskitone">
                                Code
                            </a>
                        </li>
                        <li>
                            <Button
                                size="sm"
                                color="info"
                                onClick={this.props.onAboutClick}
                            >
                                About
                            </Button>
                        </li>
                    </ul>
                </Col>

                <style jsx>{`
                    h1 {
                        text-transform: uppercase;
                        font-weight: 400;
                        font-family: Work Sans, -apple-system,
                            BlinkMacSystemFont, "Segoe UI", Roboto,
                            "Helvetica Neue", Arial, sans-serif,
                            "Apple Color Emoji", "Segoe UI Emoji",
                            "Segoe UI Symbol";
                        display: inline-block;
                        margin-right: 0.5rem;
                    }

                    h1 .oskitone {
                        font-weight: 900;
                    }

                    .links {
                        margin: 0 0 1rem;
                        padding: 0;
                    }

                    .links li {
                        margin: 0 1rem 0 0;
                        list-style: none;
                        display: inline-block;
                    }

                    a {
                        color: #666;
                    }

                    @media (min-width: 768px) {
                        .links {
                            margin: 0 -0.5rem 0 0;
                            text-align: right;
                        }

                        .links li {
                            line-height: 3rem; // h1: 2.5rem * 1.2 line-height
                            margin: 0 0 0 0.5rem;
                        }

                        .links a {
                            padding: 0 0.5rem;
                            display: inline-block;
                        }
                    }
                `}</style>
            </Row>
        );
    }
}

export default Header;
