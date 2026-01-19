import DOMPurify from 'isomorphic-dompurify';
import { QuestionType } from './types';

// Deterministic seeded random generator (Mulberry32)
export function seededRandom(seed: number) {
  let t = seed;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function groupBySection(questions: QuestionType[]): Map<string, QuestionType[]> {
  const map = new Map<string, QuestionType[]>();
  for (const q of questions) {
    if (!map.has(q.section)) map.set(q.section, []);
    map.get(q.section)!.push(q);
  }

  // Sort questions within each section by their number
  for (const [section, qs] of map.entries()) {
    map.set(
      section,
      qs.sort((a, b) => a.number - b.number)
    );
  }
  return map;
}

export function formatRichText(text?: string): { __html: string } {
  if (!text) return { __html: '' };
  const withLineBreaks = text.replace(/\n/g, '<br>');
  const sanitized = DOMPurify.sanitize(withLineBreaks, {
    ADD_TAGS: ['table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'br'],
    ADD_ATTR: ['colspan', 'rowspan', 'style'],
  });
  return { __html: sanitized };
}
