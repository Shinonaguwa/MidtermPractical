import { usePreferences } from './usePreferences.js';

export default function ArticlePreview() {
  const { theme, fontSize } = usePreferences();

  return (
    <section aria-label="Article preview">
      <h3>Article preview</h3>
      <article className={`article article--${theme}`} style={{ fontSize: `${fontSize}px` }}>
        <h4 style={{ marginTop: 0 }}>Why context beats prop drilling</h4>
        <p>
          Preferences such as the theme and font size are needed by components at several
          depths. Context lets any descendant read them directly, so the components in between
          do not have to accept and forward props they never use.
        </p>
      </article>
    </section>
  );
}
