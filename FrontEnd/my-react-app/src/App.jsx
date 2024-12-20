import React, { useState, useEffect } from 'react';
import AddJobForm from './AddJobForm';

const App = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ company: '', location: '' });

  const fetchJobs = async () => {
    try {
      let query = '';
      if (filters.company) query += `company=${filters.company}&`;
      if (filters.location) query += `location=${filters.location}&`;

      const response = await fetch(`http://localhost:3000/api/jobs?${query}`);
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/jobs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
      } else {
        console.error('Error deleting job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div>
      <h1>Expense Tracker</h1>

      <AddJobForm />
      <h2>Filter Expenses</h2>
      <form onSubmit={handleFilterSubmit}>
        <div>
          <label>Amount:</label>
          <input
            type="text"
            name="company"
            value={filters.company}
            onChange={handleFilterChange}
            placeholder="Enter company name"
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Enter location"
          />
        </div>
        <button type="submit">Apply Filters</button>
      </form>

      <h2>Expense Listings</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job._id}>
            <h3>{job.title}</h3>
            <p>
              <strong>Amount:</strong> {job.company}
            </p>
            <p>
              <strong>Location:</strong> {job.location}
            </p>
            <p>
              <strong>Description:</strong> {job.description}
            </p>
            <button onClick={() => handleDelete(job._id)}>Delete Expense</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
