//Social페이지에서 게시글인 Post를 작성하려면 WritePost페이지에서 작성하게 됩니다
//이때 개인적으로 특정 영화관이 가고 싶은 경우에 해당 영화관을 지도에서 선택할 수 있는데
//(ex 건대 롯데시네마)
//그 지도가 모달 창으로 띄워지는 페이지입니다
//영화관을 입력해서 지도를 보며 선택이 가능합니다 


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