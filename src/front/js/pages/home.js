import React from 'react';
import Login from '../component/Login';
import Clima from '../component/Clima';
import Formulario from '../component/Formulario';
import Footer from '../component/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';

const Home = () => {
  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} xl={4}>
          <Login />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} xl={4}>
          <Clima />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} xl={4}>
          <Formulario />
        </Col>
      </Row>
      <Footer />
    </Container>
  );
};

export default Home;