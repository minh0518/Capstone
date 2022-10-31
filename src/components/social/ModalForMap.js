import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ShowLocation from '../map/ShowLocation'

const ModalForMap = ({handleClose,handleShow,onChange,post}) => {
    return (
        <Modal show={true} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>영화관을 선택하세요</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlInput1"
            >
    
              <Form.Control
                placeholder="ex) 건대 롯데시네마"
                autoFocus
                name="specificTheater"
                onChange={onChange}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>KAKAO MAP</Form.Label>

              <ShowLocation placeName={post.specificTheater} />
              
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>

    );
};

export default ModalForMap;