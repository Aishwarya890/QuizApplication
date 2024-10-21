// // src/QuizList.js
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './QuizList.css'
// const QuizList = () => {
//     const [quizzes, setQuizzes] = useState([]);

//     useEffect(() => {
//         const fetchQuizzes = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8080/api/admin/quizzes');
//                 setQuizzes(response.data);
//             } catch (error) {
//                 console.error('Error fetching quizzes:', error);
//             }
//         };

//         fetchQuizzes();
//     }, []);

//     return (
//         <div className="container3 mt-5">
//             <h2 className="text-center mb-4">Scheduled Quizzes</h2>
//             <ul className="list-group">
//                 {quizzes.map((quiz) => (
//                     <li key={quiz.id} className="list-group-item d-flex justify-content-between align-items-center">
//                         <Link to={`/quizzes/${quiz.id}`} className="btn btn-link">
//                             {quiz.subject}
//                         </Link>
//                         <span className="badge bg-primary rounded-pill">{quiz.deadline}</span>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };
// export default QuizList;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './QuizList.css';
import QuizAccess from './QuizAccess';
const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null); // Store the selected quiz
    const [accessCode, setAccessCode] = useState(''); // Store the user's access code
    const [error, setError] = useState(null); // Store any error messages
    const navigate = useNavigate(); // For navigation
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    var currentUserId;
    const startQuiz = (quizId) => {
        // Redirect to quiz page or show the quiz
        console.log("Starting quiz with ID:", quizId);
        // You can add logic to navigate to the quiz page
    };
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

    const handleTakeQuiz = (quizId) => {
        // Ask user for access code
        const enteredAccessCode = prompt('Please enter the access code for this quiz:');
        
        if (enteredAccessCode) {
            // Verify the access code by sending it to the backend
            verifyAccessCode(quizId, enteredAccessCode);
        }
    };

    const verifyAccessCode = async (quizId, enteredAccessCode) => {
        const userData = JSON.parse(localStorage.getItem('user')); // or sessionStorage.getItem('user')
        console.log("user Data  :",userData);
        const userId = userData ? userData.userId : null; // Extract user ID
       console.log("userId",userData);
       console.log("Stored User Data:", userId);
       console.log("quizId",quizId);
       if (!userId) {
        setError("User not logged in or invalid.");
        return;
    }
        
        try {
            const response = await axios.post('http://localhost:8080/api/user/verify-quiz-access', {
                quizId,
                accessCode: enteredAccessCode,
                userId
            });

            // If the access code is correct, navigate to the quiz page
            if (response.status === 200) {
                navigate(`/quizzes/${quizId}`);
            }
        } catch (error) {
            // Handle any error (e.g., invalid access code)
            setError('Invalid access code or you have already taken this quiz.');
        }
    };
   

    return (
        <div className="container3 mt-5">
            <h2 className="text-center mb-4">Scheduled Quizzes</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <ul className="list-group">
                {quizzes.map((quiz) => (
                    <li key={quiz.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <button
                            onClick={() => handleTakeQuiz(quiz.id)}
                            className="btn btn-link"
                        >
                            {quiz.subject}
                        </button>
                        <span className="badge bg-primary rounded-pill">{quiz.deadline}</span>
                    </li>
                ))}
            
             {selectedQuizId && (
                <QuizAccess
                    quizId={selectedQuizId}
                    currentUserId={currentUserId}
                    startQuiz={startQuiz}
                />
            )}
            </ul>
        </div>
    );
};

export default QuizList;

