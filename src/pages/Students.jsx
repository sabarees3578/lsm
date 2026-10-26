import { useMemo, useState } from 'react'
import { studentDate, students } from '../data/students.js'

export default function Students() {
  const [query, setQuery] = useState('')
  const [scoreFilter, setScoreFilter] = useState('all')
  const scoredCount = students.filter(student => student.scorePercent !== null).length
  const averageScore = Math.round(
    students.reduce((total, student) => total + (student.scorePercent ?? 0), 0) / scoredCount
  )
  const filteredStudents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return students.filter(student => {
      const matchesQuery = !normalizedQuery || [
        student.name,
        student.college,
        student.course,
        student.department,
      ].some(value => value.toLowerCase().includes(normalizedQuery))
      const hasScore = student.scorePercent !== null
      const matchesScoreFilter = scoreFilter === 'all'
        || (scoreFilter === 'scored' && hasScore)
        || (scoreFilter === 'unscored' && !hasScore)
      return matchesQuery && matchesScoreFilter
    })
  }, [query, scoreFilter])

  return (
    <div className="wrap students-page">
      <div className="page-title students-title">
        <div>
          <div className="eyebrow">LEARNER DIRECTORY</div>
          <h1>Students</h1>
          <p className="fine">A clear view of your class roster and IoT assessment results.</p>
        </div>
        <span className="students-total">839 learners</span>
      </div>

      <section className="student-metrics" aria-label="Student overview">
        <article className="student-metric">
          <span className="student-metric-icon">♙</span>
          <div><strong>839</strong><span>Total students</span></div>
        </article>
        <article className="student-metric">
          <span className="student-metric-icon">✓</span>
          <div><strong>{scoredCount}</strong><span>Assessment scores recorded</span></div>
        </article>
        <article className="student-metric">
          <span className="student-metric-icon">↗</span>
          <div><strong>{averageScore}%</strong><span>Average among recorded scores</span></div>
        </article>
      </section>

      <section className="student-directory" aria-labelledby="student-list-heading">
        <div className="student-directory-heading">
          <div>
            <h2 id="student-list-heading">Class roster</h2>
            <p>8389 of 839 students</p>
          </div>
          <div className="student-filters">
            <label className="student-search">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search students..."
                aria-label="Search students"
              />
            </label>
            
          </div>
        </div>

        <div className="student-table-scroll">
          <table className="student-table">
            <thead>
              <tr>
                <th scope="col"><h1>Student</h1></th>
                <th scope="col"><h1>Date</h1></th>
                <th scope="col"><h1>Department</h1></th>
                <th scope="col"><h1>Course</h1></th>
                <th scope="col"><h1>IoT assessment</h1></th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.name}>
                  <td>
                    <div className="student-identity">
                      <span className="student-avatar" aria-hidden="true">
                        {student.name.trim().charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <strong> <p3>{student.name}</p3></strong>
                        <span><p3>{student.college}</ p3></span>
                      </div>
                    </div>
                  </td>
                  <td><p3>{studentDate}</p3></td>
                  <td><p3>{student.department}</p3></td>
                  <td><p3>{student.course}</p3  ></td>
                  <td>
                    {student.scorePercent === null ? (
                      <span className="student-score-pending">No score recorded</span>
                    ) : (
                      <span className="student-score">
                        <strong><h3>{student.scorePercent}%</h3></strong>
                        <span><p2>{student.scoreMarks}/50</p2 ></span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td className="student-empty" colSpan="5">
                    No students match your search. Try another name or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
