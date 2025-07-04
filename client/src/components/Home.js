import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Home() {
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/marks');
        setMarks(response.data);
      } catch (err) {
        console.error('Error fetching marks:', err);
      }
    };

    fetchMarks();
  }, []);

  const mcqMarks = marks.filter((mark) => mark.ptype === 'mcq');
  const essayMarks = marks.filter((mark) => mark.ptype === 'essay');

  const totalMarks = marks.reduce((acc, mark) => {
    const existingStudent = acc.find((item) => item.pname === mark.pname);
    if (existingStudent) {
      existingStudent.marks += mark.marks;
    } else {
      acc.push({ pname: mark.pname, marks: mark.marks });
    }
    return acc;
  }, []);

  const chartData = {
    labels: mcqMarks.map((mark) => mark.pname),
    datasets: [
      {
        label: 'MCQ Marks',
        data: mcqMarks.map((mark) => mark.marks),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Essay Marks',
        data: essayMarks.map((mark) => mark.marks),
        borderColor: 'rgba(192, 75, 192, 1)',
        backgroundColor: 'rgba(192, 75, 192, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Total Marks',
        data: totalMarks.map((mark) => mark.marks),
        borderColor: 'rgba(192, 192, 75, 1)',
        backgroundColor: 'rgba(192, 192, 75, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Marks of Students',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Combine MCQ and Essay marks for each student
  const combinedMarks = mcqMarks.map((mcq) => {
    const essay = essayMarks.find((e) => e.pname === mcq.pname);
    const total = totalMarks.find((t) => t.pname === mcq.pname);
    return {
      pname: mcq.pname,
      mcqMarks: mcq.marks,
      essayMarks: essay ? essay.marks : 0,
      totalMarks: total ? total.marks : mcq.marks + (essay ? essay.marks : 0),
    };
  });

  // Find highest marks
  const highestTotal = combinedMarks.reduce(
    (max, student) =>
      student.totalMarks > max.marks ? { name: student.pname, marks: student.totalMarks } : max,
    { name: '', marks: 0 }
  );

  const highestMCQ = mcqMarks.reduce(
    (max, mark) => (mark.marks > max.marks ? { name: mark.pname, marks: mark.marks } : max),
    { name: '', marks: 0 }
  );

  const highestEssay = essayMarks.reduce(
    (max, mark) => (mark.marks > max.marks ? { name: mark.pname, marks: mark.marks } : max),
    { name: '', marks: 0 }
  );

  // Function to export data to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(combinedMarks);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Marks');
    XLSX.writeFile(wb, 'Student_Marks.xlsx');
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Marks Dashboard</h1>

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ flex: '1', border: '1px solid #ccc', display: 'flex', justifyContent: 'center' }}>
          <div style={{ height: '500px', width: '800px' }}>
            <Line data={chartData} options={chartOptions} height={500} width={800} />
          </div>
        </div>

        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginLeft: '1rem' }}>
          <div style={{ backgroundColor: '#ebf8ff', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Highest Total Marks</h2>
            <p>
              <span style={{ fontWeight: 'bold' }}>{highestTotal.name}</span>: {highestTotal.marks}
            </p>
          </div>
          <div style={{ backgroundColor: '#f0fff4', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Highest MCQ Marks</h2>
            <p>
              <span style={{ fontWeight: 'bold' }}>{highestMCQ.name}</span>: {highestMCQ.marks}
            </p>
          </div>
          <div style={{ backgroundColor: '#f5f3ff', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Highest Essay Marks</h2>
            <p>
              <span style={{ fontWeight: 'bold' }}>{highestEssay.name}</span>: {highestEssay.marks}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={exportToExcel}
        style={{
          backgroundColor: '#4a5568',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
      >
        Export to Excel
      </button>

      <div style={{ overflowX: 'auto', marginTop: '2rem' }}>
        <table style={{ minWidth: '100%', backgroundColor: 'white', border: '1px solid #d1d5db', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#e5e7eb', color: '#374151', textTransform: 'uppercase', fontSize: '0.875rem', lineHeight: '1.25rem' }}>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', border: '1px solid #d1d5db' }}>Student Name</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', border: '1px solid #d1d5db' }}>MCQ Marks</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', border: '1px solid #d1d5db' }}>Essay Marks</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', border: '1px solid #d1d5db' }}>Total Marks</th>
            </tr>
          </thead>
          <tbody>
            {combinedMarks.map((student) => (
              <tr key={student.pname} style={{ borderBottom: '1px solid #d1d5db' }}>
                <td style={{ padding: '0.75rem 1.5rem', border: '1px solid #d1d5db' }}>{student.pname}</td>
                <td style={{ padding: '0.75rem 1.5rem', border: '1px solid #d1d5db' }}>{student.mcqMarks}</td>
                <td style={{ padding: '0.75rem 1.5rem', border: '1px solid #d1d5db' }}>{student.essayMarks}</td>
                <td style={{ padding: '0.75rem 1.5rem', border: '1px solid #d1d5db' }}>{student.totalMarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
