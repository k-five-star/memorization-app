// src/App.js

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Button from './components/ui/Button';
import Textarea from './components/ui/Textarea';
import Alert from './components/ui/Alert';

function App() {
  const [originalText, setOriginalText] = useState('');
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [correctInput, setCorrectInput] = useState('');
  const [showOriginal, setShowOriginal] = useState(true);
  const [showError, setShowError] = useState(false);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const [isHintVisible, setIsHintVisible] = useState(false);

  useEffect(() => {
    setLines(originalText.split('\n').filter((line) => line.trim() !== ''));
    setCurrentLine(0);
    setCorrectInput('');
    setUserInput('');
    setShowError(false);
    setMistakeCount(0);
    setHintCount(0);
    setIsHintVisible(false);
  }, [originalText]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
    setIsHintVisible(false); // 사용자가 입력을 변경하면 힌트 표시를 숨깁니다.
  };

  const checkInput = () => {
    if (userInput.trim() === lines[currentLine]?.trim()) {
      setCorrectInput((prev) => prev + (prev ? '\n' : '') + userInput);
      setUserInput('');
      setCurrentLine((prev) => prev + 1);
      setShowError(false);
      setIsHintVisible(false);
    } else {
      setShowError(true);
      setMistakeCount((prev) => prev + 1);
    }
  };

  const showHint = () => {
    setIsHintVisible(true);
    setHintCount((prev) => prev + 1);
    setShowError(true); // 힌트를 볼 때에도 오류 메시지를 표시합니다.
  };

  const resetAll = () => {
    setOriginalText('');
    setLines([]);
    setCurrentLine(0);
    setUserInput('');
    setCorrectInput('');
    setShowError(false);
    setMistakeCount(0);
    setHintCount(0);
    setIsHintVisible(false);
  };

  // 입력 초기화 기능 추가
  const resetInput = () => {
    setUserInput('');
    setCorrectInput('');
    setCurrentLine(0);
    setShowError(false);
    setMistakeCount(0);
    setHintCount(0);
    setIsHintVisible(false);
  };

  // 역순으로 만들기 기능
  const reverseLines = () => {
    const reversedText = originalText.split('\n').reverse().join('\n');
    setOriginalText(reversedText);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white">
      {/* 왼쪽 섹션 */}
      <div className="md:w-1/2 p-4 border-b md:border-b-0 md:border-r border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">원본 텍스트</h2>
          <div className="flex space-x-2">
            {/* 역순으로 만들기 버튼 */}
            <Button onClick={reverseLines} variant="outline" size="sm">
              역순으로 만들기
            </Button>
            <Button
              onClick={() => setShowOriginal(!showOriginal)}
              variant="outline"
              size="icon"
            >
              {showOriginal ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        {/* 안내문구 추가 */}
        <p className="text-sm text-gray-500 mt-2">
          복붙할 수 있는 내용체계와 성취기준은 옆의 링크에 있어요 !!{' '}
          <a
            href="https://drive.google.com/drive/folders/1PnYm_iEh1qUCoE4EsBfCLUHivblZEOu3?usp=sharing"
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            링크로 이동
          </a>
        </p>
        {showOriginal && (
          <div className="h-5/6 mt-2">
            <Textarea
              className="w-full h-full bg-gray-800 text-white resize-none"
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="암기하고자 하는 원본 텍스트를 여기에 입력하세요. 여러 줄로 입력할 수 있습니다."
            />
          </div>
        )}
      </div>

      {/* 오른쪽 섹션 */}
      <div className="md:w-1/2 p-4 flex flex-col">
        {/* 오른쪽 상단: 정확한 입력 표시 */}
        <div className="flex-1 mb-4 overflow-auto">
          <h2 className="text-xl font-bold mb-2">
            정확한 입력
            <span className="text-sm font-normal ml-2">
              (틀린 횟수: {mistakeCount}, 힌트 사용 횟수: {hintCount})
            </span>
          </h2>
          <div className="bg-gray-800 p-2 h-full">
            {correctInput ? (
              correctInput.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))
            ) : (
              <p className="text-gray-500">답을 맞춘 입력은 여기에 표시됩니다..</p>
            )}
          </div>
        </div>

        {/* 오른쪽 하단: 사용자 입력 영역 */}
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">사용자 입력</h2>
          <Textarea
            className="w-full h-24 bg-gray-800 text-white mb-2 resize-none"
            value={userInput}
            onChange={handleUserInput}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                checkInput();
              }
            }}
            placeholder="암기한 내용을 한 줄씩 입력하고 Enter 키를 누르세요. 띄어쓰기조차도 틀려선 안됩니다 !!"
          />
          {/* 버튼 그룹 */}
          <div className="flex space-x-2">
            <Button onClick={resetAll} className="mr-2">
              전체 초기화
            </Button>
            {/* 입력 초기화 버튼 추가 */}
            <Button onClick={resetInput} variant="success" className="mr-2">
              입력 초기화
            </Button>
          </div>
          {showError && (
            <Alert variant="destructive" className="mt-2">
              {isHintVisible ? (
                <div>
                  <p>입력 : {userInput}</p>
                  <p>정답 : {lines[currentLine]}</p>
                </div>
              ) : (
                <div>
                  입력이 정확하지 않습니다.{' '}
                  <Button variant="link" onClick={showHint}>
                    힌트를 보시겠습니까?
                  </Button>
                </div>
              )}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
