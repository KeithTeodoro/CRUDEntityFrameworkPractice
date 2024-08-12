import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Crud() {
  const empData = [
    {
      id: 1,
      name: "Keith Andre F. Teodoro",
      age: "23",
      isActive: "1",
    },
    {
      id: 2,
      name: "Jian Mikaela Villegas",
      age: "24",
      isActive: "0",
    },
  ];

  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [isActive, setIsActive] = useState(0);

  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editIsActive, setEditIsActive] = useState(0);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get("https://localhost:7187/api/Employee")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEdit = (id) => {
    handleShow();
    axios
      .get(`https://localhost:7187/api/Employee/${id}`)
      .then((res) => {
        setEditName(res.data.name);
        setEditAge(res.data.age);
        setEditIsActive(res.data.isActive);
        setEditId(id);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you Sure?")) {
      axios
        .delete(`https://localhost:7187/api/Employee/${id}`)
        .then((res) => {
          if (res.status === 200) {
            toast.success("Employee has been Deleted.");
            getData();
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };

  const handleUpdate = () => {
    const url = `https://localhost:7187/api/Employee/${editId}`;
    const data = {
      id: editId,
      name: editName,
      age: editAge,
      isActive: editIsActive,
    };

    axios
      .put(url, data)
      .then(() => {
        handleClose();
        getData();
        clear();
        toast.success("Employee has been Updated");
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const handleSave = () => {
    const url = "https://localhost:7187/api/Employee";
    const data = {
      name: name,
      age: age,
      isActive: isActive,
    };

    axios
      .post(url, data)
      .then(() => {
        getData();
        clear();
        toast.success("Employee has been added");
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const clear = () => {
    setName("");
    setAge("");
    setIsActive(0);
    setEditName("");
    setEditAge("");
    setEditIsActive(0);
    setEditId("");
  };

  const handleActiveChange = (e) => {
    if (e.target.checked) {
      setIsActive(1);
    } else {
      setIsActive(0);
    }
  };

  const handleEditActiveChange = (e) => {
    if (e.target.checked) {
      setEditIsActive(1);
    } else {
      setEditIsActive(0);
    }
  };

  return (
    <>
      <ToastContainer />
      <Container className="my-5">
        <Row>
          <Col>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
          <Col>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </Col>
          <Col>
            <input
              type="checkbox"
              checked={isActive === 1 ? true : false}
              onChange={(e) => handleActiveChange(e)}
              value={isActive}
            />
            <label htmlFor="">isActive</label>
          </Col>
          <Col>
            <button className="btn btn-primary" onClick={(e) => handleSave(e)}>
              Submit
            </button>
          </Col>
        </Row>
      </Container>
      <Table striped bordered hover className="align-middle text-center">
        <thead>
          <tr>
            <th>#</th>

            <th>Name</th>
            <th>Age</th>
            <th>isActive</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0
            ? data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    <td>{item.name}</td>
                    <td>{item.age}</td>
                    <td>{item.isActive}</td>
                    <td
                      colSpan={2}
                      className="d-flex justify-content-center gap-2"
                    >
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(item.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            : "Loading..."}
        </tbody>
      </Table>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Employee Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Age"
                value={editAge}
                onChange={(e) => setEditAge(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="checkbox"
                checked={editIsActive === 1 ? true : false}
                onChange={(e) => handleEditActiveChange(e)}
                value={editIsActive}
              />
              <label htmlFor="">isActive</label>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Crud;
