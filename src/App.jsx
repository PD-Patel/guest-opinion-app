import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { addEmail } from "./EmailListSlice";
import axios from "axios";
function App() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const emailList = useSelector((state) => state.newEmail.value);

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  console.log(BACKEND_URL);
  // Adding email address
  const AddEmail = (e) => {
    e.preventDefault();

    if (email.trim()) {
      if (!isValidEmail(email)) {
        alert(`"${email}" is not a valid email address.`);
        return;
      }
    }
    // check whether emails are already added!!
    const exists = emailList.includes(email);

    if (!exists) {
      dispatch({
        type: "emailList/addEmail",
        payload: email,
      });
    } else {
      alert("already in state");
    }
  };

  const handleAddEmail = async (e) => {
    e.preventDefault();

    await axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/emails/add`, {
        emails: emailList,
      })
      .then((res) =>
        alert("after pressing ok it will redirect to homepage.", res.data)
      );

    // Clear input field
    localStorage.removeItem("emails");

    window.location.reload();
  };

  return (
    <Main>
      <Container>
        <FormContainer>
          <h2>Guest Opinion App</h2>

          <InputContainer>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputContainer>

          <AddEmailButtons onClick={AddEmail}>Add Email</AddEmailButtons>
        </FormContainer>

        <EmailsContainer>
          <h4>Email List</h4>
          <EmailList>
            <ul>
              {emailList.map((email) => (
                <li>{email}</li>
              ))}
            </ul>
          </EmailList>
          <AddEmailButtons onClick={handleAddEmail}>
            Send Surveys to All Email
          </AddEmailButtons>
        </EmailsContainer>
      </Container>
    </Main>
  );
}

const Main = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  flex-direction: column;
`;
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #000;
  border-radius: 5px;
  flex-direction: column;
  padding: 20px;
`;

const FormContainer = styled.div`
  width: 500px;
  height: 200px;
  display: flex;
  padding: 15px;
  justify-content: center;
  flex-direction: column;

  h2 {
    font-size: 28px;
    margin-bottom: 20px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  label {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 600;
  }
  input {
    height: 33px;
    border-radius: 5px;
    border: 1px solid gray;
  }
`;

const AddEmailButtons = styled.button`
  height: 39px;
  background: #000;
  color: #fff;
  border: none;
  font-size: 15px;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
`;

const EmailsContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 500px;
  padding: 15px;
  h4 {
    font-size: 22px !important;
    font-weight: 500;
  }
`;

const EmailList = styled.div`
  margin: 15px;

  li {
    margin-bottom: 5px;
    font-weight: 500;
  }
`;
export default App;
