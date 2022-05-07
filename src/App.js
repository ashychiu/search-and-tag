import "./styles/global.scss";
import { useEffect, useState } from "react";
import React from "react";

const App = () => {
  const [students, setStudents] = useState([]);
  const [tagged, setTagged] = useState([]);
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

  useEffect(() => {
    const filterName = (query) => {
      const searchTerm = query.toLowerCase();
      console.log(filtered);
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
      });
      setFiltered(filteredList);
    };
    filterName(query);
  }, [query]);

  useEffect(() => {
    const filterTag = (tagQuery) => {
      console.log(filtered);
      const list = tagQuery && filtered.length ? filtered : students;
      const filteredList = list.filter((student) => {
        if (!tagQuery && !filtered.length) {
          return null;
        } else if (!tagQuery && filtered.length) {
          return filtered;
        } else if (student.tags) {
          const lowercased = student.tags.map((tag) => tag.toLowerCase());
          const searchTerm = new RegExp(tagQuery.toLowerCase());
          if (searchTerm.test(lowercased)) return student;
        }
      });
      setFiltered(filteredList);
    };
    filterTag(tagQuery);
  }, [tagQuery]);

  const listToRender =
    query || tagQuery ? filtered : tagged.length ? tagged : students;

  const getAverage = (grades) => {
    let sum = grades
      .map((grade) => Number(grade))
      .reduce((prev, curr) => prev + curr);
    return sum / grades.length;
  };

  const handleClick = (index) => {
    setShowGrades(showGrades === index ? null : index);
  };

  const handleAddTag = (e, index) => {
    e.preventDefault();
    const newTag = e.target.tag.value;
    students[index].tags = students[index].tags ? students[index].tags : [];
    students[index].tags.push(newTag);
    setTagged([...students]);
    e.target.reset();
  };

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
              <form onSubmit={(e) => handleAddTag(e, index)}>
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
