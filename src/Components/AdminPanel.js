import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css';

const AdminPanel = () => {
    const [subject, setSubject] = useState('');
    const [deadline, setDeadline] = useState('');
    const [questions, setQuestions] = useState(['']);
    const [options, setOptions] = useState([['']]);
    const [correctAnswers, setCorrectAnswers] = useState(['']);
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            const response = await axios.get('http://localhost:8080/api/admin/quizzes');
            setQuizzes(response.data);
        };
        fetchQuizzes();
    }, []);

    const handleAddQuestion = () => {
        setQuestions([...questions, '']);
        setOptions([...options, ['']]);
        setCorrectAnswers([...correctAnswers, '']);
    };

    const handleDeleteQuestion = (index) => {
        setQuestions(questions.filter((_, qIndex) => qIndex !== index));
        setOptions(options.filter((_, oIndex) => oIndex !== index));
        setCorrectAnswers(correctAnswers.filter((_, cIndex) => cIndex !== index));
    };

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const newOptions = [...options];
        newOptions[questionIndex][optionIndex] = value;
        setOptions(newOptions);
    };

    const handleCorrectAnswerChange = (index, value) => {
        const newCorrectAnswers = [...correctAnswers];
        newCorrectAnswers[index] = value;
        setCorrectAnswers(newCorrectAnswers);
    };

    const handleAddOption = (questionIndex) => {
        const newOptions = [...options];
        newOptions[questionIndex].push('');
        setOptions(newOptions);
    };

    const handleDeleteQuiz = async (quizId) => {
        await axios.delete(`http://localhost:8080/api/admin/quizzes/${quizId}`);
        setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
        alert('Quiz deleted successfully!');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const quiz = {
            subject,
            deadline,
            questions,
            options,
            correctAnswers,
        };

        const response = await axios.post('http://localhost:8080/api/admin/quizzes', quiz, {
          withCredentials: true // Include credentials in the request
      });
        const adminName = response.data.name;
        localStorage.setItem('adminName', adminName);

        alert('Quiz created successfully!');
        setSubject('');
        setDeadline('');
        setQuestions(['']);
        setOptions([['']]);
        setCorrectAnswers(['']);
    };

    return (
        <div className="admin-panel container mt-5">
            <h2 className="text-center mb-4">Admin Panel</h2>
            <form onSubmit={handleSubmit} className="admin-form shadow-lg p-4 rounded">
                <div className="form-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Quiz Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <input
                        type="datetime-local"
                        className="form-control"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        required
                    />
                </div>

                {questions.map((question, qIndex) => (
                    <div key={qIndex} className="question-section mb-4 p-3 rounded shadow-sm">
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder={`Question ${qIndex + 1}`}
                            value={question}
                            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                            required
                        />
                        {options[qIndex].map((option, oIndex) => (
                            <input
                                key={oIndex}
                                type="text"
                                className="form-control mb-2"
                                placeholder={`Option ${oIndex + 1}`}
                                value={option}
                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                required
                            />
                        ))}
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Correct Answer"
                            value={correctAnswers[qIndex]}
                            onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                            required
                        />
                        <div className="d-flex justify-content-between">
                            <button type="button" className="btn btn-info" onClick={() => handleAddOption(qIndex)}>
                                Add Option
                            </button>
                            <button type="button" className="btn btn-danger" onClick={() => handleDeleteQuestion(qIndex)}>
                                Delete Question
                            </button>
                        </div>
                    </div>
                ))}

                <div className="d-flex justify-content-between">
                    <button type="button" className="btn btn-primary" onClick={handleAddQuestion}>
                        Add Question
                    </button>
                    <button type="submit" className="btn btn-success">
                        Create Quiz
                    </button>
                </div>
            </form>

            <h3 className="text-center mt-5">Delete Quiz</h3>
            <ul className="list-group mt-3 shadow-sm">
                {quizzes.map((quiz) => (
                    <li key={quiz.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {quiz.subject}
                        <button className="btn btn-danger" onClick={() => handleDeleteQuiz(quiz.id)}>
                            Delete Quiz
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;
