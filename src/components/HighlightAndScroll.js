import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function HighlightAndScroll() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Remove previous highlights
    const unhighlight = () => {
      const marks = document.querySelectorAll('mark.search-highlight');
      marks.forEach(mark => {
        const parent = mark.parentNode;
        parent.replaceChild(document.createTextNode(mark.textContent), mark);
        parent.normalize(); // Merges adjacent text nodes
      });
    };

    unhighlight();
    window.scrollTo(0, 0);

    const params = new URLSearchParams(search);
    const highlightQuery = params.get('highlight');

    if (highlightQuery) {
      const timer = setTimeout(() => {
        const decodedQuery = decodeURIComponent(highlightQuery);
        const regex = new RegExp(`(${decodedQuery.replace(/[.*+?^${}()|[\\\]]/g, '\\$&')})`, 'gi');
        
        const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
          acceptNode: function(node) {
            // Skip script, style, and already highlighted nodes
            const parentTag = node.parentElement.tagName.toLowerCase();
            if (parentTag === 'script' || parentTag === 'style' || parentTag === 'mark') {
              return NodeFilter.FILTER_REJECT;
            }
            if (regex.test(node.nodeValue)) {
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
          }
        }, false);

        const nodesToReplace = [];
        while (treeWalker.nextNode()) {
            nodesToReplace.push(treeWalker.currentNode);
        }

        let firstMatchElement = null;

        nodesToReplace.forEach(node => {
            const parent = node.parentNode;
            if (!parent) return;

            const parts = node.nodeValue.split(regex);
            
            if (parts.length > 1) {
              const fragment = document.createDocumentFragment();
              parts.forEach((part, index) => {
                  if (index % 2 === 1) { // This is the matched part
                      const mark = document.createElement('mark');
                      mark.textContent = part;
                      mark.className = 'search-highlight'; // Add a class for easy removal
                      mark.style.backgroundColor = 'yellow';
                      mark.style.color = 'black';
                      fragment.appendChild(mark);
                      if (!firstMatchElement) {
                          firstMatchElement = mark;
                      }
                  } else if (part) {
                      fragment.appendChild(document.createTextNode(part));
                  }
              });
              parent.replaceChild(fragment, node);
            }
        });

        if (firstMatchElement) {
          firstMatchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

      }, 500); // Delay to allow content to render

      return () => clearTimeout(timer);
    }
  }, [pathname, search]);

  return null; // This component does not render anything
}

export default HighlightAndScroll;
