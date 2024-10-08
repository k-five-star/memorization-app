// src/App.js

import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Button from './components/ui/Button';
import Textarea from './components/ui/Textarea';
import Alert from './components/ui/Alert';
import Modal from './components/ui/Modal'; // 추가된 부분
import Confetti from './components/ui/Confetti'; // 추가된 부분

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
  const [showCongratulations, setShowCongratulations] = useState(false); // 추가된 부분
  const [showMistakeNote, setShowMistakeNote] = useState(false); // 추가된 부분
  const [mistakeLog, setMistakeLog] = useState({}); // 추가된 부분

  // "정확한 입력" 영역에 대한 ref 추가
  const correctInputRef = useRef(null);

  useEffect(() => {
    setLines(originalText.split('\n').filter((line) => line.trim() !== ''));
    setCurrentLine(0);
    setCorrectInput('');
    setUserInput('');
    setShowError(false);
    setMistakeCount(0);
    setHintCount(0);
    setIsHintVisible(false);
    setMistakeLog({});
    setShowCongratulations(false);
    setShowMistakeNote(false);
  }, [originalText]);

  useEffect(() => {
    // correctInput이 변경될 때마다 스크롤을 맨 아래로 이동
    if (correctInputRef.current) {
      correctInputRef.current.scrollTop = correctInputRef.current.scrollHeight;
    }
  }, [correctInput]);

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

      // 모든 줄을 완료하면 축하 팝업 표시
      if (currentLine + 1 === lines.length) {
        setShowCongratulations(true);
      }
    } else {
      setShowError(true);
      setMistakeCount((prev) => prev + 1);

      // 오답 로그 저장
      setMistakeLog((prev) => {
        const lineNumber = currentLine + 1;
        const prevMistakes = prev[lineNumber] ? prev[lineNumber].mistakes : [];
        if (prevMistakes.length < 3) {
          return {
            ...prev,
            [lineNumber]: {
              correctLine: lines[currentLine],
              mistakes: [...prevMistakes, userInput],
            },
          };
        } else {
          return prev;
        }
      });
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
    setMistakeLog({});
    setShowCongratulations(false);
    setShowMistakeNote(false);
  };

  // 입력 초기화 기능
  const resetInput = () => {
    setUserInput('');
    setCorrectInput('');
    setCurrentLine(0);
    setShowError(false);
    setMistakeCount(0);
    setHintCount(0);
    setIsHintVisible(false);
    setMistakeLog({});
    setShowCongratulations(false);
    setShowMistakeNote(false);
  };

  // 역순으로 만들기 기능
  const reverseLines = () => {
    const reversedText = originalText.split('\n').reverse().join('\n');
    setOriginalText(reversedText);
  };

  // 홀수-짝수 라인 교환 기능
  const swapOddEvenLines = () => {
    const originalLines = originalText.split('\n');
    const swappedLines = [];
    for (let i = 0; i < originalLines.length; i += 2) {
      if (i + 1 < originalLines.length) {
        // 짝이 있는 경우 교환
        swappedLines.push(originalLines[i + 1]);
        swappedLines.push(originalLines[i]);
      } else {
        // 마지막 줄이 홀수인 경우 그대로 추가
        swappedLines.push(originalLines[i]);
      }
    }
    const swappedText = swappedLines.join('\n');
    setOriginalText(swappedText);
  };

  // 오답 노트 복사 기능
  const copyMistakeNote = () => {
    let report = '';
    Object.keys(mistakeLog).forEach((lineNumber) => {
      const { correctLine, mistakes } = mistakeLog[lineNumber];
      report += `- 정답 라인 ${lineNumber}:\n${correctLine}\n`;
      mistakes.forEach((mistake, index) => {
        report += `오답${index + 1}: ${mistake}\n`;
      });
      report += '\n';
    });
    navigator.clipboard.writeText(report);
    alert('보고서가 복사되었습니다.');
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white">
      {/* 폭죽 효과 */}
      {showCongratulations && <Confetti />}

      {/* 축하합니다 모달 */}
      {showCongratulations && !showMistakeNote && (
        <Modal onClose={() => setShowCongratulations(false)}>
          <h2 className="text-2xl font-bold mb-4 text-center">🎉 축하합니다! 🎉</h2>
          <p className="text-center mb-4">
            틀린 횟수: {mistakeCount}, 힌트 사용 횟수: {hintCount}
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => setShowMistakeNote(true)} variant="outline">
              오답 노트
            </Button>
            <Button onClick={() => setShowCongratulations(false)}>닫기</Button>
          </div>
        </Modal>
      )}

      {/* 오답 노트 모달 */}
      {showMistakeNote && (
        <Modal onClose={() => setShowMistakeNote(false)}>
          <h2 className="text-2xl font-bold mb-4 text-center">오답 노트</h2>
          <div className="overflow-auto max-h-64 mb-4">
            {Object.keys(mistakeLog).length > 0 ? (
              Object.keys(mistakeLog).map((lineNumber) => {
                const { correctLine, mistakes } = mistakeLog[lineNumber];
                return (
                  <div key={lineNumber} className="mb-4">
                    <p className="font-bold">- 정답 라인 {lineNumber}:</p>
                    <p className="text-green-400">정답: {correctLine}</p>
                    {mistakes.map((mistake, index) => (
                      <p key={index} className="text-red-400">
                        오답: {mistake}
                      </p>
                    ))}
                  </div>
                );
              })
            ) : (
              <p>오답이 없습니다.</p>
            )}
          </div>
          <div className="flex justify-center space-x-4">
            <Button onClick={copyMistakeNote} variant="success">
              Copy
            </Button>
            <Button onClick={() => setShowMistakeNote(false)}>닫기</Button>
          </div>
        </Modal>
      )}

      {/* 기존 내용 */}
      {/* 왼쪽 섹션 */}
      <div className="md:w-1/2 p-4 border-b md:border-b-0 md:border-r border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">원본 텍스트</h2>
          <div className="flex space-x-2">
            {/* 홀수-짝수 라인 교환 버튼 추가 */}
            <Button onClick={swapOddEvenLines} variant="outline" size="sm">
              홀수라인↔짝수라인
            </Button>
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
        <div
          className="flex-1 mb-4 overflow-auto bg-gray-800 p-2"
          ref={correctInputRef}
        >
          <h2 className="text-xl font-bold mb-2">
            정확한 입력
            <span className="text-sm font-normal ml-2">
              (틀린 횟수: {mistakeCount}, 힌트 사용 횟수: {hintCount})
            </span>
          </h2>
          {correctInput ? (
            correctInput.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))
          ) : (
            <p className="text-gray-500">답을 맞춘 입력은 여기에 표시됩니다..</p>
          )}
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
