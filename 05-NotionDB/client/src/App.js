import './App.css';
import { useState } from 'react';


function App() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [extraInfo, setExtraInfo] = useState("");

  function submitFormToNotion() {
    console.log("whatIgot: " + name);
    fetch("http://localhost:4000/submitFormToNotion", {
      method: "post",
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        phoneNumber: phoneNumber,
        extraInfo: extraInfo,
      }),
    }).then((res) => res.json())
      .then(data => {
        console.log("success!", data)
      }).catch((err) => {
        console.log("Error: " + err);
      });
  }
  return (
    <div className="App">
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <h3>Interested in Learing more? Put your info below</h3>
        <p>Name</p>
        <input
          type="text"
          id="name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <p>phoneNumber</p>
        <input
          type="text"
          id="phoneNumber"
          onChange={(e) => {
            setPhoneNumber(e.target.value);
          }}
        />
        <p>anything Else?</p>
        <textarea
          onChange={(e) => {
            setExtraInfo(e.target.value);
          }}
          rows={10}
          cols={25}
        />
        <div>
          <button onClick={submitFormToNotion}>submit</button>
        </div>
      </div>
    </div>
  );
}

export default App;
