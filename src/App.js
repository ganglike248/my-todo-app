import React, { useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState(null); // 현재 수정 중인 할 일의 id
  const [editingText, setEditingText] = useState(''); // 수정 중인 텍스트
  // 통계 계산 함수들
  const getTotalCount = () => todos.length;
  const getCompletedCount = () => todos.filter(todo => todo.completed).length;
  const getPendingCount = () => todos.filter(todo => !todo.completed).length;
  const getCompletionRate = () => {
    if (todos.length === 0) return 0;
    return Math.round((getCompletedCount() / getTotalCount()) * 100);
  };

  // 할 일 추가 함수
  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false, // 기본값은 완료되지 않은 상태
        createdAt: new Date()
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  // 할 일 완료 상태 토글 함수
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      // 클릭한 할 일의 id와 같으면 completed 상태를 반대로 변경
      todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo // 다른 할 일들은 그대로 유지
    ));
  };

  // 할 일 삭제 함수
  const deleteTodo = (id) => {
    // filter를 사용해서 삭제할 id와 다른 할 일들만 새 배열로 만들기
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  // 수정 모드 시작 함수
  const startEdit = (id, text) => {
    setEditingId(id); // 수정할 할 일의 id 저장
    setEditingText(text); // 현재 텍스트를 수정용 input에 설정
  };

  // 수정 완료 함수
  const finishEdit = () => {
    if (editingText.trim() !== '') {
      setTodos(todos.map(todo =>
        todo.id === editingId
          ? { ...todo, text: editingText.trim() } // 수정된 텍스트로 업데이트
          : todo
      ));
    }
    // 수정 모드 종료
    setEditingId(null);
    setEditingText('');
  };

  // 수정 취소 함수
  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  // 수정 중 Enter 키 처리
  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      finishEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <div className="App">
      <h1 className="app-title">📝 나의 Todo List</h1>
      
      <div className="todo-container">
        {/* 입력 영역 */}
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
            <>
              {/* 개선된 통계 표시 */}
              <div className="todo-stats">
                <div className="stat-item">
                  <span className="stat-label">전체</span>
                  <span className="stat-value">{getTotalCount()}개</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">완료</span>
                  <span className="stat-value completed">{getCompletedCount()}개</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">미완료</span>
                  <span className="stat-value pending">{getPendingCount()}개</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">완료율</span>
                  <span className="stat-value rate">{getCompletionRate()}%</span>
                </div>
              </div>

              <ul className="todo-list">
                {todos.map(todo => (
                  <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                    <div className="todo-content">
                      <input
                        type="checkbox"
                        className="todo-checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                      />

                      {/* 수정 모드인지 확인 */}
                      {editingId === todo.id ? (
                        // 수정 모드일 때: input 표시
                        <input
                          type="text"
                          className="edit-input"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyPress={handleEditKeyPress}
                          onBlur={finishEdit} // 포커스를 잃으면 수정 완료
                          autoFocus // 자동으로 포커스 설정
                        />
                      ) : (
                        // 일반 모드일 때: 텍스트 표시
                        <span
                          className="todo-text"
                          onDoubleClick={() => startEdit(todo.id, todo.text)} // 더블클릭으로 수정 모드 시작
                          title="더블클릭하여 수정"
                        >
                          {todo.text}
                        </span>
                      )}
                    </div>

                    <div className="todo-actions">
                      <span className="todo-date">
                        {todo.createdAt.toLocaleString()}
                      </span>

                      {/* 수정 모드일 때는 저장/취소 버튼, 아닐 때는 삭제 버튼 */}
                      {editingId === todo.id ? (
                        <div className="edit-buttons">
                          <button
                            className="save-button"
                            onClick={finishEdit}
                            title="저장"
                          >
                            ✅
                          </button>
                          <button
                            className="cancel-button"
                            onClick={cancelEdit}
                            title="취소"
                          >
                            ❌
                          </button>
                        </div>
                      ) : (
                        <button
                          className="delete-button"
                          onClick={() => deleteTodo(todo.id)}
                          title="삭제"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
