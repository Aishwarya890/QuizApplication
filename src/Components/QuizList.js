// src/QuizList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './QuizList.css'
const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/admin/quizzes');
                setQuizzes(response.data);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };

        fetchQuizzes();
    }, []);

    return (
        <div className="container3 mt-5">
            <h2 className="text-center mb-4">Scheduled Quizzes</h2>
            <ul className="list-group">
                {quizzes.map((quiz) => (
                    <li key={quiz.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <Link to={`/quizzes/${quiz.id}`} className="btn btn-link">
                            {quiz.subject}
                        </Link>
                        <span className="badge bg-primary rounded-pill">{quiz.deadline}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuizList;
