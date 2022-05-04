import "./App.css";
import { useEffect, useState } from "react";
import React from "react";

const App = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://api.hatchways.io/assessment/students");
        const response = await res.json();
        setStudents(response.students);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div key={students.number} className="container">
      {students.map((student) => {
        return (
          <div>
            <img src={student.pic} alt="profile pic" />
            <p>
              {student.firstName} {student.lastName}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default App;
