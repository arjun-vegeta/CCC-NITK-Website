export function extractHeadingsFromElement(element) {
  if (!element) return [];

  const headingElements = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  console.log('Found headings:', headingElements.length);

  const extractedHeadings = Array.from(headingElements).map((heading) => {
    const text = heading.innerText;
    const level = parseInt(heading.tagName.charAt(1));
    const id = text.toLowerCase().replace(/\s+/g, "-");
    heading.id = id;

    console.log('Extracted heading:', {
      text,
      level,
      id,
      tagName: heading.tagName
    });

    return `${'#'.repeat(level)} ${text}`;
  });

  console.log('Final extracted headings:', extractedHeadings);
  return extractedHeadings;
}
