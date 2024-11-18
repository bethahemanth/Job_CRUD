import React, { useState } from 'react';

const AddJobForm = () => {
  const [job, setJob] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/jobs/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Job added successfully!');
        setJob({ title: '', company: '', location: '', description: '' });
      } else {
        alert('Failed to add job');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding job');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a Job</h2>
      <div>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={job.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Company:</label>
        <input
          type="text"
          name="company"
          value={job.company}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Location:</label>
        <input
          type="text"
          name="location"
          value={job.location}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          name="description"
          value={job.description}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      <button type="submit">Add Job</button>
    </form>
  );
};

export default AddJobForm;
