import React, { useState } from 'react';
import './App.css';

function App() {
  // 할 일 목록을 관리할 상태
  const [todos, setTodos] = useState([]);
  // 입력 필드의 값을 관리할 상태
  const [inputValue, setInputValue] = useState('');

  // 할 일 추가 함수
  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = {
        id: Date.now(), // 간단한 ID 생성
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date()
      };
      setTodos([...todos, newTodo]);
      setInputValue(''); // 입력 필드 초기화
    }
  };

  // Enter 키 입력 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="App">
      <h1 className="app-title">📝 나의 Todo List</h1>
      
      <div className="todo-container">
        {/* 할 일 입력 영역 */}
        <div className="input-container">
          <input
            type="text"
            className="todo-input"
            placeholder="할 일을 입력하세요..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            className="add-button"
            onClick={addTodo}
            disabled={inputValue.trim() === ''}
          >
            추가
          </button>
        </div>

        {/* 할 일 목록 영역 */}
        <div className="todo-list-container">
          {todos.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-emoji">📝</span>
              아직 할 일이 없습니다.<br />
              위에서 새로운 할 일을 추가해보세요!
            </div>
          ) : (
            <ul className="todo-list">
              {todos.map(todo => (
                <li key={todo.id} className="todo-item">
                  <span className="todo-text">{todo.text}</span>
                  <span className="todo-date">
                    {todo.createdAt.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
