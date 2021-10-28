import './App.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import './Header.css';

function Header() {
  return (
    <div className="Header">
        <div>
            <Navbar  className="navbar"> 
                <Container className="navbar-pad">
                <Navbar.Brand href="#home" className="logo" textAlign="center">
                    <img
                    alt="cj logo"
                    src="./../cj_logo_white.png"
                    width="30"
                    height="30"
                    className="d-inline-block align-top logo"
                    />{'   '}
                   <b> PIXEL PARSER </b>
                </Navbar.Brand>
                </Container>
            </Navbar>
        </div>
    </div>
  );
}

export default Header;
