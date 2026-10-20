import { useRef, useState } from 'react';
import DebugNotes from '../../components/DebugNotes.jsx';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY_VALUES = { name: '', email: '', password: '' };

function validate({ name, email, password }) {
  const errors = {};

  if (!name.trim()) {
    errors.name = 'Name is required.';
  }

  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Enter a valid email address, such as name@example.com.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  return errors;
}

function ClickDemo() {
  const [clicks, setClicks] = useState(0);
  return (
    <div>
      <button type="button" className="secondary" onClick={() => setClicks((c) => c + 1)}>
        Clicked {clicks} times
      </button>
    </div>
  );
}

const DEBUG_CASES = [
  {
    title: 'a ref value displayed in the interface never updates',
    broken: `const clicks = useRef(0);

function handleClick() {
  clicks.current = clicks.current + 1;   // no render is scheduled
}

return <button onClick={handleClick}>Clicked {clicks.current} times</button>;`,
    fixed: `const [clicks, setClicks] = useState(0);

function handleClick() {
  setClicks((current) => current + 1);   // schedules a render
}

return <button onClick={handleClick}>Clicked {clicks} times</button>;`,
    explanation:
      'A ref is a plain mutable object, { current }, that React keeps between renders. Writing to ref.current is an ordinary property assignment, and React has no way to observe it, so it never schedules a render. The screen keeps showing the old output until something else triggers a render. Data that appears in the interface belongs in state, because calling a state setter tells React to render again. Refs are for values that must not affect the output, such as DOM nodes or the previous submitted email below.'
  }
];

export default function RegistrationForm() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [submission, setSubmission] = useState(null);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const previousEmailRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    const orderedFields = [
      { key: 'name', ref: nameRef },
      { key: 'email', ref: emailRef },
      { key: 'password', ref: passwordRef }
    ];
    const firstInvalid = orderedFields.find((field) => nextErrors[field.key]);

    if (firstInvalid) {
      setSubmission(null);
      firstInvalid.ref.current.focus();
      return;
    }

    const email = values.email.trim();
    const previousEmail = previousEmailRef.current;
    previousEmailRef.current = email;

    setSubmission({ name: values.name.trim(), email, previousEmail });
    setValues(EMPTY_VALUES);
  };

  return (
    <div>
      <h2>Exam 3: Accessible Form Toolkit</h2>
      <p className="hint">Hook focus: useRef with useState</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="reg-name">Name</label>
          <input
            id="reg-name"
            name="name"
            type="text"
            ref={nameRef}
            value={values.name}
            onChange={handleChange}
            autoComplete="name"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'reg-name-error' : undefined}
          />
          {errors.name && (
            <p id="reg-name-error" className="error" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            name="email"
            type="email"
            ref={emailRef}
            value={values.email}
            onChange={handleChange}
            autoComplete="email"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'reg-email-error' : undefined}
          />
          {errors.email && (
            <p id="reg-email-error" className="error" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="reg-password">Password (at least 8 characters)</label>
          <input
            id="reg-password"
            name="password"
            type="password"
            ref={passwordRef}
            value={values.password}
            onChange={handleChange}
            autoComplete="new-password"
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'reg-password-error' : undefined}
          />
          {errors.password && (
            <p id="reg-password-error" className="error" role="alert">
              {errors.password}
            </p>
          )}
        </div>

        <button type="submit">Register</button>
      </form>

      {submission && (
        <div className="success" role="status" style={{ marginTop: 16 }}>
          <p style={{ margin: 0 }}>
            Registered <strong>{submission.name}</strong> with {submission.email}.
          </p>
          <p style={{ margin: 0 }}>
            Previous submitted email:{' '}
            {submission.previousEmail ? submission.previousEmail : 'none yet (first submission)'}
          </p>
        </div>
      )}

      <hr />
      <h3>Debugging demo: visible data in state</h3>
      <ClickDemo />

      <DebugNotes cases={DEBUG_CASES} title="Required debugging case" />
    </div>
  );
}
