// App.js

import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Save, Upload, BookOpen, Trash2 } from 'lucide-react'; // Trash2 아이콘 추가
import Button from './components/ui/Button';
import Textarea from './components/ui/Textarea';
import Alert from './components/ui/Alert';
import Modal from './components/ui/Modal';
import Confetti from './components/ui/Confetti';

function App() {
  // 상태 변수들
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
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [showMistakeNote, setShowMistakeNote] = useState(false);
  const [savedDocuments, setSavedDocuments] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const maxDocuments = 50;
  const [sessionMistakes, setSessionMistakes] = useState({});
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const correctInputRef = useRef(null);

  useEffect(() => {
    // 앱 시작 시 로컬 스토리지에서 문서 목록 불러오기
    const docs = JSON.parse(localStorage.getItem('savedDocuments') || '[]');
    setSavedDocuments(docs);
  }, []);

  useEffect(() => {
    // originalText가 변경될 때마다 lines 업데이트
    setLines(originalText.split('\n').filter((line) => line.trim() !== ''));
    setCurrentLine(0);
    setCorrectInput('');
    setUserInput('');
    setShowError(false);
    setMistakeCount(0);
    setHintCount(0);
    setIsHintVisible(false);
    setSessionMistakes({});
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
    setIsHintVisible(false);
  };

  const checkInput = () => {
    if (userInput.trim() === lines[currentLine]?.trim()) {
      setCorrectInput((prev) => prev + (prev ? '\n' : '') + userInput);
      setUserInput('');
      setCurrentLine((prev) => prev + 1);
      setShowError(false);
      setIsHintVisible(false);

      // 현재 라인에 대한 오답 기록 초기화
      setSessionMistakes((prev) => {
        const updated = { ...prev };
        delete updated[currentLine + 1];
        return updated;
      });

      // 모든 줄을 완료하면 축하 팝업 표시
      if (currentLine + 1 === lines.length) {
        setShowCongratulations(true);
        saveMistakeRecord();
      }
    } else {
      setShowError(true);
      setMistakeCount((prev) => prev + 1);
      // 현재 회차의 오답 기록 저장 (최대 3개)
      setSessionMistakes((prev) => {
        const updated = { ...prev };
        const lineNumber = currentLine + 1;
        if (!updated[lineNumber]) {
          updated[lineNumber] = [];
        }
        if (updated[lineNumber].length < 3) {
          updated[lineNumber].push(userInput);
        }
        return updated;
      });
    }
  };

  const showHint = () => {
    setIsHintVisible(true);
    setHintCount((prev) => prev + 1);
    setShowError(true);
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
    setSessionMistakes({});
    setShowCongratulations(false);
    setShowMistakeNote(false);
    setSelectedDocument(null);
  };

  const resetInput = () => {
    setCurrentLine(0);
    setUserInput('');
    setCorrectInput('');
    setShowError(false);
    setMistakeCount(0);
    setHintCount(0);
    setIsHintVisible(false);
    setSessionMistakes({});
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
        swappedLines.push(originalLines[i + 1]);
        swappedLines.push(originalLines[i]);
      } else {
        swappedLines.push(originalLines[i]);
      }
    }
    const swappedText = swappedLines.join('\n');
    setOriginalText(swappedText);
  };

  // 문서 저장하기
  const saveDocument = () => {
    if (savedDocuments.length >= maxDocuments) {
      alert('최대 저장 개수를 초과했습니다.');
      return;
    }
    const timestamp = new Date().toISOString();
    const newDoc = {
      name: documentName || `문서 ${savedDocuments.length + 1}`,
      content: originalText,
      createdAt: timestamp,
      stats: [],
    };
    const updatedDocs = [...savedDocuments, newDoc];
    setSavedDocuments(updatedDocs);
    localStorage.setItem('savedDocuments', JSON.stringify(updatedDocs));
    setShowSaveModal(false);
    setDocumentName('');
    alert('문서가 저장되었습니다.');
  };

  // 문서 불러오기
  const loadDocument = (doc) => {
    setOriginalText(doc.content);
    setSelectedDocument(doc);
    setShowLoadModal(false);
  };

  // 문서 삭제하기
  const deleteDocument = (docToDelete) => {
    const updatedDocs = savedDocuments.filter((doc) => doc.name !== docToDelete.name);
    setSavedDocuments(updatedDocs);
    localStorage.setItem('savedDocuments', JSON.stringify(updatedDocs));
    alert('문서가 삭제되었습니다.');
  };

  // 오답 기록 저장
  const saveMistakeRecord = () => {
    if (!selectedDocument) return;
    const newRecord = {
      timestamp: new Date().toISOString(),
      mistakeCount,
      hintCount,
      sessionMistakes,
    };
    const updatedDocs = savedDocuments.map((doc) => {
      if (doc.name === selectedDocument.name) {
        const updatedStats = [newRecord, ...doc.stats].slice(0, 10); // 최대 10회차 저장
        return { ...doc, stats: updatedStats };
      }
      return doc;
    });
    setSavedDocuments(updatedDocs);
    localStorage.setItem('savedDocuments', JSON.stringify(updatedDocs));
  };

  // 컴포넌트 언마운트 시 로컬 스토리지에 데이터 저장
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('savedDocuments', JSON.stringify(savedDocuments));
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      handleBeforeUnload();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [savedDocuments]);

  // 자주 틀리는 줄 경고
  useEffect(() => {
    if (selectedDocument && selectedDocument.stats) {
      const lineNumber = currentLine + 1;
      let mistakeFrequency = 0;
      selectedDocument.stats.forEach((record) => {
        if (record.sessionMistakes[lineNumber]) {
          mistakeFrequency++;
        }
      });
      if (mistakeFrequency > 0) {
        alert(`경고: 최근 ${mistakeFrequency}번 틀렸던 부분입니다.`);
      }
    }
  }, [currentLine, selectedDocument]);

  // 오답 기록 확인
  const viewMistakeHistory = () => {
    if (selectedDocument) {
      setShowStatsModal(true);
    } else {
      alert('먼저 문서를 불러와 주세요.');
    }
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
              오답 노트 보기
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
            {Object.keys(sessionMistakes).length > 0 ? (
              Object.keys(sessionMistakes).map((lineNumber) => {
                const mistakes = sessionMistakes[lineNumber];
                return (
                  <div key={lineNumber} className="mb-4">
                    <p className="font-bold">- 라인 {lineNumber}:</p>
                    {mistakes.map((mistake, index) => (
                      <p key={index} className="text-red-400">
                        오답{index + 1}: {mistake}
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
            <Button onClick={() => setShowMistakeNote(false)}>닫기</Button>
          </div>
        </Modal>
      )}

      {/* 오답 기록 확인 모달 */}
      {showStatsModal && (
        <Modal onClose={() => setShowStatsModal(false)}>
          <h2 className="text-xl font-bold mb-4">오답 기록 확인</h2>
          {selectedDocument ? (
            <div className="overflow-auto max-h-64 mb-4">
              <p className="font-bold mb-2">{selectedDocument.name}</p>
              {selectedDocument.stats.length > 0 ? (
                selectedDocument.stats.map((record, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-sm text-gray-400">
                      회차 {index + 1} - {new Date(record.timestamp).toLocaleString()}
                    </p>
                    <p className="text-sm">
                      틀린 횟수: {record.mistakeCount}, 힌트 사용 횟수: {record.hintCount}
                    </p>
                    {/* 각 라인별 오답 횟수 시각화 */}
                    {Object.keys(record.sessionMistakes).map((lineNumber) => (
                      <div key={lineNumber} className="ml-2">
                        <p className="text-sm text-red-400">
                          라인 {lineNumber}: {record.sessionMistakes[lineNumber].length}회 오답
                        </p>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p>오답 기록이 없습니다.</p>
              )}
            </div>
          ) : (
            <p>문서를 먼저 선택하세요.</p>
          )}
          <div className="flex justify-end">
            <Button onClick={() => setShowStatsModal(false)}>닫기</Button>
          </div>
        </Modal>
      )}

      {/* 문서 저장 모달 */}
      {showSaveModal && (
        <Modal onClose={() => setShowSaveModal(false)}>
          <h2 className="text-xl font-bold mb-4">문서 저장하기</h2>
          <input
            type="text"
            className="w-full p-2 mb-4 bg-gray-800 rounded-md"
            placeholder="문서 이름을 입력하세요"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setShowSaveModal(false)} variant="outline">
              취소
            </Button>
            <Button onClick={saveDocument}>저장</Button>
          </div>
        </Modal>
      )}

      {/* 문서 불러오기 모달 */}
      {showLoadModal && (
        <Modal onClose={() => setShowLoadModal(false)}>
          <h2 className="text-xl font-bold mb-4">문서 불러오기</h2>
          {savedDocuments.length > 0 ? (
            <div className="overflow-auto max-h-64 mb-4">
              {savedDocuments.map((doc, index) => (
                <div
                  key={index}
                  className="p-2 mb-2 bg-gray-800 rounded-md"
                >
                  <div
                    className="cursor-pointer hover:bg-gray-700 p-2 rounded-md"
                    onClick={() => loadDocument(doc)}
                  >
                    <p className="font-bold">{doc.name}</p>
                    <p className="text-sm text-gray-400">
                      생성일: {new Date(doc.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400">
                      최근 3회의 평균 틀린 횟수: {calculateAverage(doc, 'mistakeCount')}
                    </p>
                    <p className="text-sm text-gray-400">
                      최근 3회의 평균 힌트 사용 횟수: {calculateAverage(doc, 'hintCount')}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => deleteDocument(doc)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      삭제
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>저장된 문서가 없습니다.</p>
          )}
          <div className="flex justify-end">
            <Button onClick={() => setShowLoadModal(false)}>닫기</Button>
          </div>
        </Modal>
      )}

      {/* 왼쪽 섹션 */}
      <div className="md:w-1/2 p-4 border-b md:border-b-0 md:border-r border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">원본 텍스트</h2>
          <div className="flex space-x-2">
            {/* 문서 저장하기 버튼 */}
            <Button onClick={() => setShowSaveModal(true)} variant="outline" size="sm">
              <Save className="h-4 w-4 mr-1" />
              저장하기
            </Button>
            {/* 문서 불러오기 버튼 */}
            <Button onClick={() => setShowLoadModal(true)} variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-1" />
              불러오기
            </Button>
            {/* 오답 기록 확인 버튼 */}
            <Button onClick={viewMistakeHistory} variant="outline" size="sm">
              <BookOpen className="h-4 w-4 mr-1" />
              오답 기록
            </Button>
            {/* 홀수-짝수 라인 교환 버튼 */}
            <Button onClick={swapOddEvenLines} variant="outline" size="sm">
              홀수라인↔짝수라인
            </Button>
            {/* 역순으로 만들기 버튼 */}
            <Button onClick={reverseLines} variant="outline" size="sm">
              역순으로 만들기
            </Button>
            {/* 원본 텍스트 보기/숨기기 버튼 */}
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
            <p className="text-gray-500">답을 맞춘 입력은 여기에 표시됩니다.</p>
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
            placeholder="암기한 내용을 한 줄씩 입력하고 Enter 키를 누르세요. 띄어쓰기조차도 틀려선 안됩니다!"
          />
          {/* 버튼 그룹 */}
          <div className="flex space-x-2">
            <Button onClick={resetAll} className="mr-2">
              전체 초기화
            </Button>
            <Button onClick={resetInput} variant="success" className="mr-2">
              입력 초기화
            </Button>
            <Button onClick={showHint} className="mr-2">
              힌트 보기
            </Button>
          </div>
          {showError && (
            <Alert variant="destructive" className="mt-2">
              {isHintVisible ? (
                <div>
                  <p>입력: {userInput}</p>
                  <p>정답: {lines[currentLine]}</p>
                </div>
              ) : (
                <div>
                  입력이 정확하지 않습니다.
                </div>
              )}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );

  // 평균 계산 함수
  function calculateAverage(doc, key) {
    const recentStats = doc.stats.slice(0, 3);
    if (recentStats.length === 0) return 0;
    const sum = recentStats.reduce((acc, curr) => acc + curr[key], 0);
    return (sum / recentStats.length).toFixed(2);
  }
}

export default App;
