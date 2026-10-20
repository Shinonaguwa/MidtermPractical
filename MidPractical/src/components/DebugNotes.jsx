export default function DebugNotes({ cases, title = 'Required debugging cases' }) {
  return (
    <section className="debug-notes" aria-label={title}>
      <h3>{title}</h3>
      {cases.map((item, index) => (
        <details key={item.title}>
          <summary>
            Case {index + 1}: {item.title}
          </summary>
          {item.broken && (
            <>
              <p className="debug-label">Faulty code</p>
              <pre>
                <code>{item.broken}</code>
              </pre>
            </>
          )}
          {item.fixed && (
            <>
              <p className="debug-label">Repaired code</p>
              <pre>
                <code>{item.fixed}</code>
              </pre>
            </>
          )}
          <p>{item.explanation}</p>
        </details>
      ))}
    </section>
  );
}
