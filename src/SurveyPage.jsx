import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
function SurveyPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const [feedback, setFeedback] = useState({
    issues: {
      checkIn: false,
      checkOut: false,
      breakfast: false,
      guestRoom: false,
      bathroom: false,
      lobby: false,
      staff: false,
    },
    additionalFeedback: "",
  });

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus("invalid");

        return;
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/emails/verify`,
          {
            token,
          }
        );

        // Backend responded with status 200 and token is valid
        if (response.data.status === "valid") {
          setStatus("valid");

          // Optionally store the email: setEmail(response.data.email)
        }
      } catch (err) {
        if (err.response && err.response.data) {
          const { status, message } = err.response.data;
          setStatus(status); // could be "used", "expired", or "invalid"
        } else {
          setStatus("error");
        }

        console.error("Verification error:", err.message);
      }
    };

    verifyToken();
  }, [token]);

  const handleCheckboxChange = (field) => {
    setFeedback((prev) => ({
      ...prev,
      issues: { ...prev.issues, [field]: !prev.issues[field] },
    }));
  };

  const handleTextAreaChange = (e) => {
    setFeedback((prev) => ({
      ...prev,
      additionalFeedback: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (status === "valid") {
      if (!email) {
        alert("Email parameter is missing.");
        return;
      }

      const date = new Date().toISOString().split("T")[0]; // Format: "YYYY-MM-DD"
      const surveyData = {
        issues: feedback.issues,
        additionalFeedback: feedback.additionalFeedback,
      };

      // await axios
      //   .post("http://localhost:4000/emails/verify", { token })
      //   .then((res) => console.log(res))
      //   .catch((err) => console.error(err));

      try {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/emails/survey`, {
          date,
          email,
          surveyData,
          token,
        });
        setStatus("used");
        alert("Survey submitted successfully!");
      } catch (error) {
        console.log("Error submitting survey:", error.message);
        alert("Error submitting survey. Please try again.");
      }
    }
  };

  return (
    <div>
      <Header>
        <img src="./vite.png" alt="Days Inn Logo" />
      </Header>
      {status === "loading" && <p>Verifying token...</p>}

      {status === "valid" && (
        <FeedbackForm>
          <h2>Feedback Form</h2>
          <p>
            Please provide feedback on any issues you faced during your stay
          </p>

          <ListOfCheckbox>
            <p>Issue Faced</p>
            {[
              { key: "checkIn", label: "Check-In" },
              { key: "checkOut", label: "Check-Out" },
              { key: "breakfast", label: "Breakfast" },
              { key: "guestRoom", label: "GuestRoom" },
              { key: "bathroom", label: "Bathroom" },
              { key: "lobby", label: "Lobby/Hallway" },
              { key: "staff", label: "Staff" },
            ].map((item) => (
              <CheckboxContainer key={item.key}>
                <div>
                  <input
                    type="checkbox"
                    checked={feedback.issues[item.key]}
                    onChange={() => handleCheckboxChange(item.key)}
                  />
                  <label>{item.label}</label>
                </div>
              </CheckboxContainer>
            ))}
          </ListOfCheckbox>

          <AdditionalFeedbackContainer>
            <p>Additional Feedback</p>
            <textarea
              value={feedback.additionalFeedback}
              onChange={handleTextAreaChange}
            ></textarea>
          </AdditionalFeedbackContainer>

          <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
        </FeedbackForm>
      )}
      {status === "used" && (
        <Message bg="#fff3cd" color="#856404">
          <h2>Survey Already Submitted</h2>
          <p>
            This survey link has already been used. Thank you for your time!
          </p>
        </Message>
      )}

      {status === "expired" && (
        <Message bg="#f8d7da" color="#721c24">
          <h2>Survey Link Expired</h2>
          <p>This link has expired. Please contact us if you need a new one.</p>
        </Message>
      )}

      {status === "invalid" && (
        <Message bg="#f8d7da" color="#721c24">
          <h2>Invalid Link</h2>
          <p>The link you followed is invalid or broken.</p>
        </Message>
      )}
    </div>
  );
}

const Header = styled.div`
  height: 200px;
  background-color: #5fc0e9;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  width: 100vw;
  img {
    height: 60%;
  }
`;

const FeedbackForm = styled.div`
  width: 90vw;
  height: fit-content;

  margin: auto;
  padding: 20px;
  h2 {
    font-size: 27px;
    font-weight: 800;
    margin-bottom: 5px;
  }

  p {
    color: #848484;
    width: 100%;
  }
`;

const ListOfCheckbox = styled.div`
  height: fit-content;

  padding: 20px;

  margin-top: 20px;
  margin-bottom: 30px;

  p {
    color: #000;
    font-weight: 700;
    margin-bottom: 10px;
  }
`;

const CheckboxContainer = styled.div`
  margin-top: 20px;
  margin-left: 20px;
  div {
    display: flex;
    align-items: center;
  }
  input {
    margin-right: 10px;

    width: 22px;
    height: 22px;
  }

  label {
    font-size: 15px;
    margin-top: 3px;
    font-weight: 600;
  }
`;

const AdditionalFeedbackContainer = styled.div`
  p {
    color: #000;
    font-weight: 600;
  }
  textarea {
    width: 100%;
    height: 150px;
    resize: none;
    margin-top: 10px;
    padding: 10px;
    font-size: 18px;
  }
`;

const SubmitButton = styled.button`
  width: 150px;
  height: 47px;
  margin-top: 20px;

  background-color: #0da8eb;
  color: #ffff;
  font-weight: 700;
  border: none;
  font-size: 18px;
  border-radius: 5px;
`;

const Message = styled.div`
  padding: 20px;
  width: 100%;
  text-align: center;
  color: ${(props) => props.color || "#333"};
  background-color: ${(props) => props.bg || "#f0f0f0"};

  margin-bottom: 30px;
`;
export default SurveyPage;

// {
//   email ? (
//     <p>Thank you for visiting our survey page. Survey for: {email}</p>
//   ) : (
//     <p>Email parameter is missing.</p>
//   );
// }
