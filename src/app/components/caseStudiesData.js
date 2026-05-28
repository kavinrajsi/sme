export const caseStudies = [];

export function getCaseStudy(slug) {
  return caseStudies.find((c) => c.slug === slug) || null;
}
