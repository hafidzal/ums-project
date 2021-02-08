import { useState } from "react";
import { useQuery } from "react-query";
import { Form } from "./components/form";
import { ModalComponent } from "./components/modal";
import { Edit } from "./components/edit";
import { Container, Row, Col, Input, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';

export default function App() {
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchStatus, setSearchStatus] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  

  const getUser = async () => {
    const res = await fetch("/api/users")
      .then(res => res.json())

    setMaxPage(Math.ceil(res.users.length / 3))
    
    return res
  }

  const deleteUser = async (id) => {
    try {
        const response = await fetch(`/api/users/${id}`, {
            method: "DELETE",
        })
        .then(refetch)
        return response
    } catch (err) {
        console.log(err)
    }
  }

  const getFirstname = async (term) => {
    const res = await fetch(`/api/users/search/${term}`)
      .then(res => res.json())
    setSearchResults(res)
    return res
  }

  const handleModal = (id) => {
    setShowModal(true)
    setSelectedUser(id)
  }

  const {status, data, refetch} = useQuery('users', getUser);
  
  const nextPage = () => {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, maxPage));
  }

  const previousPage = () => {
    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));
  }

  const currentData = () => {
    const begin = (currentPage - 1) * 3;
    // 3 means items per page

    const end = begin + 3;
    // console.log('data render: ', data);

    let renderedData = data.users.slice(begin, end);

    return (
      <Container data-testid="users" className="mt-4">
        <Row className="p-4 rounded" style={{backgroundColor: '#f1f1f1'}}>
          <ul style={{listStyleType: 'none', backgroundColor: '#D1D5DB'}} className="px-4 rounded">
            {renderedData.map(user => (
              <li key={user.id} data-testid={`user-${user.id}`} style={{backgroundColor: '#D1D5DB'}} className="p-4 mt-2 rounded">
                <Row className="">
                <h2>{user.firstName} {user.lastName}</h2>
                </Row>
                <Row className="">
                <p style={{ color:"#9CA3AF" }}>{user.email} &bull; {user.dob}</p>
                </Row>
                <Row>   
                  <Button data-testid="update-button" color="warning" className="px-4 mr-2" onClick={() => handleModal(user.id)}>Update</Button>
                  <Button data-testid="delete-button" color="danger" className="px-4" onClick={() => deleteUser(user.id)}>Delete</Button>
                </Row>
              </li>
            ))}
          </ul>
        </Row>
        <Row className="p-4 d-flex justify-content-center">
          <Button
            color="info"
            onClick={previousPage}
            disabled={currentPage === 0}
          >
            Prev
          </Button>
          
          <div style={{ backgroundColor: "#f1f1f1", color: "#374151"}} className="mx-2">
            <h5 className="mx-4 pt-2">{currentPage}</h5>
          </div>
          <Button
            color="info"
            onClick={nextPage}
            // disabled={!renderedData?.hasMore}
          >
            Next
          </Button>
        </Row>
      </Container>
    )
  }

  const searchData = () => {
    if(searchResults.length !== 0){
      if(searchResults.users.length > 0){
        return(
          <>
          <Container data-testid="search-users-result">
            <Row className="p-4 rounded" style={{backgroundColor: '#f1f1f1'}}>
            {searchResults.users.map(user => (
              <li key={user.id} data-testid={`user-${user.id}`}>
                {user.firstName} {user.lastName} {' '}
              </li>
            ))}
            </Row>
          </Container>
          <Button color="danger" onClick={() => setSearchStatus(false)}>close</Button>
          </>
        )
      } else {
        return(
          <>
          <div>
            <p>Oops..</p>
          </div>
          <button onClick={() => setSearchStatus(false)}>close</button>
          </>
        )
      }
    }else {
      return(
        <>
        <Container>
          <Row className="">
            <p className="mr-2">loading..</p>
            <Button color="danger" className="" onClick={() => setSearchStatus(false)}>close</Button>
          </Row>
        </Container>
        </>
      )
    }
  }

  const handleChange = e => {
    setSearchTerm(e.target.value);
    setSearchStatus(true);
  };

  const toggle = () => setShowModal(!showModal);

  const handleClick = (e) => {
    e.preventDefault();
    
    if(data){
      getFirstname(searchTerm)
      // setSearchStatus(false)
    }
  }

  return (
    <div>
      <Container fluid>
          {/* Showing modal for updating data */}
          {showModal && 
          <Modal isOpen={showModal}>
            <ModalHeader toggle={toggle}>Edit User</ModalHeader>
            <ModalBody>
              <ModalComponent data-testid="modal">
                  <Edit refetch={refetch} id={selectedUser} handleClose={() => setShowModal(false)}/>
              </ModalComponent>
            </ModalBody>
          </Modal>
          } 

          <Row className="p-2" style={{ backgroundColor: '#D1FAE5' }}> 
            <Col>
                <Row className="float-left">
                  <h4 className="p-2 ml-4"  style={{ color: '#059669  ' }}>User Management System</h4>
                </Row>
                <Row className="float-right">
                  <Col className="p-2">
                    <Input
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col className="p-2">
                    <Button data-testid="search-button" color="info" type='submit' style={{ backgroundColor: '#059669', color: '#D1FAE5' }} onClick={handleClick}>Search</Button>
                  </Col>
                </Row>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col>
              {/* Showing form user to be input */}
              <Form refetch={refetch}/> {' '}
            </Col>
          </Row>

          {/* Display user */}
          {status === "error" && <p>Error fetching data</p>}
          {status === "loading" && <p>Fetching data...</p>}
          {status === "success" && !searchStatus && currentData()}
          {console.log('result: ', searchResults, ' status: ', searchStatus)}
          {status === "success" && searchStatus && searchData()}
      </Container>
    </div>
  )
}