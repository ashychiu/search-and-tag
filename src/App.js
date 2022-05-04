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

  const getAverage = (grades) => {
    let sum = grades
      .map((grade) => Number(grade))
      .reduce((prev, curr) => prev + curr);
    return sum / grades.length;
  };

  return (
    <div className="container">
      {students.map((student) => {
        return (
          <div key={student.id}>
            <img src={student.pic} alt="profile pic" />
            <p>
              {student.firstName} {student.lastName}
            </p>
            <p>Email: {student.email}</p>
            <p>Company: {student.company}</p>
            <p>Skill: {student.skill}</p>
            <p>Average: {getAverage(student.grades)}%</p>
          </div>
        );
      })}
    </div>
  );
};

export default App;
