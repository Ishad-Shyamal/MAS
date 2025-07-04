import React, { useState } from 'react';
import axios from 'axios';

export default function InputData() {
  const [formData, setFormData] = useState({
    pname: '',
    ptype: 'mcq',
    marks: ''
  });
  const [message, setMessage] = useState({ type: '', content: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', content: '' }); // Clear any existing messages

    try {
      const response = await axios.post('http://localhost:8000/createmarks', formData);
      console.log('Mark created:', response.data);
      setMessage({ type: 'success', content: 'Mark created successfully!' });
      // Clear the form only on success
      setFormData({ pname: '', ptype: 'mcq', marks: '' });
      // Clear the success message after 3 seconds
      setTimeout(() => setMessage({ type: '', content: '' }), 3000);
    } catch (error) {
      console.error('Error creating mark:', error);
      setMessage({ 
        type: 'error', 
        content: error.response?.data?.message || 'Error creating mark. Please try again.'
      });
      // Don't clear the form on error
    }
  };

  const handleClear = () => {
    setFormData({ pname: '', ptype: 'mcq', marks: '' });
    setMessage({ type: '', content: '' });
  };

  return (
    <div style={{ padding: '16px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Input Data</h1>
      {message.content && (
        <div style={{
          padding: '16px',
          marginBottom: '16px',
          borderRadius: '8px',
          backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
          color: message.type === 'success' ? '#065f46' : '#b91c1c',
        }}>
          <p style={{ fontWeight: 'bold' }}>{message.type === 'success' ? 'Success' : 'Error'}</p>
          <p>{message.content}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label htmlFor="pname" style={{ display: 'block', marginBottom: '4px' }}>Paper Name</label>
          <input
            type="text"
            id="pname"
            name="pname"
            value={formData.pname}
            onChange={handleChange}
            style={{ width: '20%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
            required
          />
        </div>
        <div>
          <label htmlFor="ptype" style={{ display: 'block', marginBottom: '4px' }}>Paper Type</label>
          <select
            id="ptype"
            name="ptype"
            value={formData.ptype}
            onChange={handleChange}
            style={{ width: '20%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
          >
            <option value="mcq">MCQ</option>
            <option value="essay">Essay</option>
          </select>
        </div>
        <div>
          <label htmlFor="marks" style={{ display: 'block', marginBottom: '4px' }}>Marks</label>
          <input
            type="number"
            id="marks"
            name="marks"
            value={formData.marks}
            onChange={handleChange}
            style={{ width: '20%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
            required
          />
        </div>
        <div style={{ }}>
          <button type="submit" style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            marginRight: '8px'
          }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}>
            Submit
          </button>
          <button type="button" onClick={handleClear} style={{
            padding: '8px 16px',
            backgroundColor: '#d1d5db',
            color: '#374151',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#9ca3af'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#d1d5db'}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
