// NoteContextProvider.jsx
import React, { useState ,useEffect} from 'react';
import QuestionContext from './QuestionContext';

const QuestionContextProvider = (props) => {
    const [questions, setQuestions] = useState(() => {
        const savedQuestions = localStorage.getItem('interviewQuestions');
        return savedQuestions ? JSON.parse(savedQuestions) : [];
    });
    const [jd,setJd] = useState();
    useEffect(() => {
        localStorage.setItem('interviewQuestions', JSON.stringify(questions));
    }, [questions]);

    return (
        <QuestionContext.Provider value={{ questions, setQuestions,jd,setJd }}>
            {props.children}
        </QuestionContext.Provider>
    );
};

export default QuestionContextProvider;
