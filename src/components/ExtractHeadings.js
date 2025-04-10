export function extractHeadingsFromElement(element) {
  if (!element) return [];

  const headingElements = element.querySelectorAll('h1, h2, h3, h4, h5, h6');

  const extractedHeadings = Array.from(headingElements).map((heading) => {
    const text = heading.innerText;
    const id = text.toLowerCase().replace(/\s+/g, "-"); // Generate a slug ID
    heading.id = id; // Set the ID so it can be linked to
    return text;
  });

  return extractedHeadings;
}
