import "./styles/global.scss";
import { useEffect, useState } from "react";
import React from "react";

const App = () => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://api.hatchways.io/assessment/students");
        const data = await res.json();
        setStudents(data.students);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filterStudentList = (query) => {
      const searchTerm = query.toLowerCase();
      const filtered = [...students].filter((student) => {
        if (!query) {
          return null;
        } else if (
          student.firstName.toLowerCase().includes(searchTerm) ||
          student.lastName.toLowerCase().includes(searchTerm)
        ) {
          return student;
        }
      });
      setFiltered(filtered);
    };
    filterStudentList(query);
  }, [query]);

  const listToRender = query ? filtered : students;

  const getAverage = (grades) => {
    let sum = grades
      .map((grade) => Number(grade))
      .reduce((prev, curr) => prev + curr);
    return sum / grades.length;
  };

  return (
    <main className="container">
      <div>
        <input
          className="search-input"
          placeholder="Search by name"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
      </div>
      {listToRender.map((student) => {
        return (
          <div key={student.id} className="student-card">
            <img
              src={student.pic}
              alt="profile pic"
              className="student-card__avatar"
            />
            <div className="student-card__details">
              <h1>
                {student.firstName} {student.lastName}
              </h1>
              <p>
                Email: <a href={student.email}>{student.email}</a>
              </p>
              <p>Company: {student.company}</p>
              <p>Skill: {student.skill}</p>
              <p>Average: {getAverage(student.grades)}%</p>
            </div>
          </div>
        );
      })}
    </main>
  );
};

export default App;
