import { useIsomorphicLayoutEffect } from ".";

// https://usehooks-ts.com/react-hook/use-document-title
export function useDocumentTitle(title: string): void {
  useIsomorphicLayoutEffect(() => {
    window.document.title = title;
  }, [title]);
}
