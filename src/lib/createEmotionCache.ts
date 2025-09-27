import createCache from '@emotion/cache';

const isBrowser = typeof document !== 'undefined';

// On the client side, Create a meta tag at the top of the <head> and set it as insertionPoint.
// This assures that MUI styles are loaded first.
// It allows developers to easily override MUI styles with other styling solutions, like CSS modules.
export default function createEmotionCache() {
  let insertionPoint;

  if (isBrowser) {
    try {
      const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
        'meta[name="emotion-insertion-point"]',
      );
      insertionPoint = emotionInsertionPoint ?? undefined;
    } catch (error) {
      console.warn('Could not find emotion insertion point:', error);
    }
  }

  return createCache({ 
    key: 'mui-style', 
    insertionPoint,
    // Prepend styles to ensure they load before other styles
    prepend: true,
  });
}
