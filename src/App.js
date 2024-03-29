import "./styles/global.scss";
import { useEffect, useState, useMemo } from "react";
import React from "react";

const App = () => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState("");
  const [tagQuery, setTagQuery] = useState("");
  const [showGrades, setShowGrades] = useState(null);

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

  const filterName = (query) => {
    const searchTerm = query.toLowerCase();
    console.log(searchTerm);
    const list = query && filtered.length ? filtered : students;
    const filteredList = list.filter((student) => {
      if (!query && !filtered.length) {
        return null;
      } else if (!query && filtered.length) {
        return filtered;
      } else if (
        student.firstName.toLowerCase().includes(searchTerm) ||
        student.lastName.toLowerCase().includes(searchTerm)
      ) {
        return student;
      }
      return null;
    });
    setFiltered(filteredList);
  };

  useMemo(() => {
    filterName(query);
  }, [query]);

  const filterTag = (tagQuery) => {
    const list = tagQuery && filtered.length ? filtered : students;
    const filteredList = list.filter((student) => {
      if (!tagQuery && !filtered.length) {
        return null;
      } else if (!tagQuery && filtered.length) {
        return filtered;
      } else if (student.tags) {
        const lowercaseTags = student.tags.map((tag) => tag.toLowerCase());
        const searchTerm = new RegExp(tagQuery.toLowerCase());
        return searchTerm.test(lowercaseTags) ? student : null;
      }
      return null;
    });
    setFiltered(filteredList);
  };

  useMemo(() => {
    filterTag(tagQuery);
  }, [tagQuery]);

  const getAverage = (grades) => {
    let sum = grades
      .map((grade) => Number(grade))
      .reduce((prev, curr) => prev + curr);
    return sum / grades.length;
  };

  const handleClick = (index) => {
    setShowGrades(showGrades === index ? null : index);
  };

  const handleAddTag = (e, id) => {
    e.preventDefault();
    const newTag = e.target.tag.value;
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === id) {
          const studentCopy = { ...student };
          studentCopy.tags = student.tags
            ? [...student.tags, newTag]
            : [newTag];
          console.log(studentCopy);
          return studentCopy;
        } else {
          return student;
        }
      })
    );
    e.target.reset();
  };

  const listToRender = query || tagQuery ? filtered : students;

  return (
    <main className="container">
      <div>
        <label htmlFor="searchByName">
          <input
            className="search-input"
            name="searchbyName"
            type="text"
            placeholder="Search by name"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
        </label>
        <label htmlFor="searchByTag">
          <input
            className="search-input"
            name="searchByTag"
            type="text"
            placeholder="Search by tag"
            onChange={(e) => {
              setTagQuery(e.target.value);
            }}
          />
        </label>
      </div>
      {listToRender.map((student, index) => {
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
                Email: <a href={`mailto:${student.email}`}>{student.email}</a>
              </p>
              <p>Company: {student.company}</p>
              <p>Skill: {student.skill}</p>
              <p>Average: {getAverage(student.grades)}%</p>
              {showGrades === index && (
                <div>
                  {student.grades.map((grade) => {
                    return (
                      <p className="grades">
                        Test {student.grades.indexOf(grade) + 1}: &nbsp;&nbsp;{" "}
                        {grade}%
                      </p>
                    );
                  })}
                </div>
              )}
              {student.tags && (
                <div className="tag-container">
                  {student.tags.map((tag) => {
                    return (
                      <span key={student.tags.indexOf(tag)} className="tag">
                        {tag}
                      </span>
                    );
                  })}
                </div>
              )}
              <form onSubmit={(e) => handleAddTag(e, student.id)}>
                <label htmlFor="tag">
                  <input
                    type="text"
                    name="tag"
                    className="tag-input"
                    placeholder="Add a tag"
                  />
                </label>
              </form>
            </div>
            <button onClick={() => handleClick(index)}>
              {showGrades === index ? "-" : "+"}
            </button>
          </div>
        );
      })}
    </main>
  );
};

export default App;
