import { useState } from 'react';
import TaskCounter from './exams/Exam 1 - Smart Task Counter/TaskCounter.jsx';
import LiveSearch from './exams/Exam 2 - Live Search and Timer/LiveSearch.jsx';
import RegistrationForm from './exams/Exam 3 - Accessible Form Toolkit/RegistrationForm.jsx';
import PreferencesApp from './exams/Exam 4 - Application Preferences/PreferencesApp.jsx';
import ProductExplorer from './exams/Exam 5 - Product Explorer Performance Repair/ProductExplorer.jsx';
import IssueTracker from './exams/Exam 6 - Issue Tracker State Engine/IssueTracker.jsx';

const EXAMS = [
  { id: 1, label: 'Task Counter', hook: 'useState', Component: TaskCounter },
  { id: 2, label: 'Live Search', hook: 'useEffect', Component: LiveSearch },
  { id: 3, label: 'Form Toolkit', hook: 'useRef', Component: RegistrationForm },
  { id: 4, label: 'Preferences', hook: 'useContext', Component: PreferencesApp },
  { id: 5, label: 'Product Explorer', hook: 'useMemo / useCallback', Component: ProductExplorer },
  { id: 6, label: 'Issue Tracker', hook: 'useReducer', Component: IssueTracker }
];

export default function App() {
  const [activeId, setActiveId] = useState(1);
  const active = EXAMS.find((exam) => exam.id === activeId);
  const ActiveExam = active.Component;

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          React Hooks <span>Practical Exam</span>
        </h1>
        <nav aria-label="Exam selection">
          <ul className="tabs">
            {EXAMS.map((exam) => (
              <li key={exam.id}>
                <button
                  type="button"
                  className={exam.id === activeId ? 'tab active' : 'tab'}
                  aria-current={exam.id === activeId ? 'page' : undefined}
                  aria-label={`Exam ${exam.id}: ${exam.label}`}
                  onClick={() => setActiveId(exam.id)}
                >
                  <span className="tab-num" aria-hidden="true">
                    {String(exam.id).padStart(2, '0')}
                  </span>
                  <span className="tab-label" aria-hidden="true">
                    {exam.label}
                  </span>
                  <span className="tab-hook" aria-hidden="true">
                    {exam.hook}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="exam-panel">
        <ActiveExam />
      </main>
    </div>
  );
}
