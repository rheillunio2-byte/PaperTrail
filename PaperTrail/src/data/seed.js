// DEMONSTRATION DATA — these records are illustrative samples written for this demo.
// Titles, authors, journals, DOIs and citation counts do not refer to real publications.
// `cites` lists the ids of other papers in this demo collection that a paper references.

export const CLUSTERS = {
  sage: { label: 'Learning design', color: '#3f6b52' },
  clay: { label: 'Student experience', color: '#c4683f' },
  blue: { label: 'Digital contexts', color: '#4f7686' },
  gold: { label: 'Wellbeing & pressure', color: '#b08a2e' },
  lavender: { label: 'Metacognition', color: '#7d6b94' },
};

export const seedPapers = [
  { id: 1, demo: true, title: 'The hidden architecture of collaborative learning', authors: ['M. Chen', 'A. Rivera', 'S. Patel'], year: 2024, journal: 'Journal of Learning Sciences', doi: '10.1080/10508406.2024.1182', topic: 'Collaborative learning', citations: 128, color: 'sage', keywords: ['Peer learning', 'Digital education'], cites: [2, 3, 6], abstract: 'A longitudinal study of how peer interaction patterns shape knowledge construction in digitally mediated classrooms. The findings suggest that the quality of shared reasoning matters more than group size.' },
  { id: 2, demo: true, title: 'Cognitive load in self-directed online environments', authors: ['L. Okafor', 'J. Kim'], year: 2023, journal: 'Computers & Education', doi: '10.1016/j.compedu.2023.104812', topic: 'Cognitive load', citations: 94, color: 'clay', keywords: ['Self-directed learning', 'Cognition'], cites: [4], abstract: 'Examines how learners allocate attention and manage intrinsic cognitive load when navigating open-ended online coursework, with implications for scaffolding independent study.' },
  { id: 3, demo: true, title: 'Beyond screen time: measuring meaningful digital engagement', authors: ['R. Williams', 'N. Das'], year: 2025, journal: 'Learning, Media and Technology', doi: '10.1080/17439884.2025.2031', topic: 'Digital engagement', citations: 67, color: 'blue', keywords: ['Digital education', 'Measurement'], cites: [2, 5], abstract: 'Proposes a multidimensional framework for understanding digital engagement that distinguishes passive exposure from purposeful participation and reflective use.' },
  { id: 4, demo: true, title: 'Academic pressure and student wellbeing: a systems view', authors: ['E. Santos', 'P. Müller', 'H. Lee'], year: 2022, journal: 'Educational Review', doi: '10.1080/00131911.2022.7721', topic: 'Student wellbeing', citations: 211, color: 'gold', keywords: ['Wellbeing', 'Academic workload'], cites: [6], abstract: 'Maps the institutional and interpersonal factors that contribute to academic pressure, arguing for interventions that address workload design alongside individual coping strategies.' },
  { id: 5, demo: true, title: 'Metacognitive prompts for deeper independent study', authors: ['A. Ibrahim', 'T. Foster'], year: 2024, journal: 'Instructional Science', doi: '10.1007/s11251-024-09621', topic: 'Metacognition', citations: 53, color: 'lavender', keywords: ['Self-directed learning', 'Metacognition'], cites: [2, 6], abstract: 'Tests brief reflective prompts across independent study sessions and finds that structured self-questioning can improve transfer when prompts are timed to moments of uncertainty.' },
  { id: 6, demo: true, title: 'When feedback travels: peer networks and knowledge retention', authors: ['C. Park', 'D. Osei'], year: 2021, journal: 'Higher Education Research', doi: '10.1007/s10734-021-00622', topic: 'Collaborative learning', citations: 176, color: 'sage', keywords: ['Peer learning', 'Feedback'], cites: [], abstract: 'Uses social network analysis to explore how feedback moves through student groups and how network position relates to durable learning outcomes.' },
];

// Featured collections group papers by topic or keyword. Counts are computed live.
export const collections = [
  { id: 'peer', title: 'Peer learning & feedback', note: 'How students learn from and with one another.', image: 'collection-learning.svg', match: (p) => p.keywords.includes('Peer learning') || p.topic === 'Collaborative learning' },
  { id: 'self', title: 'Self-directed study', note: 'Attention, reflection and independent work.', image: 'collection-cognition.svg', match: (p) => p.keywords.includes('Self-directed learning') || p.topic === 'Metacognition' },
  { id: 'wellbeing', title: 'Pressure & wellbeing', note: 'Workload, institutions and student health.', image: 'collection-wellbeing.svg', match: (p) => p.keywords.includes('Wellbeing') || p.keywords.includes('Academic workload') },
];

// Exploratory research directions. These are hypotheses to investigate, NOT verified findings.
// `between` names two topics; the app counts real citation links in the current collection.
export const gapSeeds = [
  { id: 'workload-engagement', title: 'The missing bridge between workload and digital engagement', between: ['Student wellbeing', 'Digital engagement'], support: [4, 3], why: 'Academic pressure and digital participation are discussed in separate papers here. A study linking the structure of online tasks to perceived workload could connect them.', signal: 'High potential' },
  { id: 'peer-overload', title: 'Peer learning as a buffer for cognitive overload', between: ['Collaborative learning', 'Cognitive load'], support: [1, 6, 2], why: 'Collaborative learning and cognitive load are both represented, yet the collection says little about whether peer networks reduce overload.', signal: 'Worth exploring' },
  { id: 'meta-wellbeing', title: 'Longitudinal evidence on metacognition and wellbeing', between: ['Metacognition', 'Student wellbeing'], support: [5, 4], why: 'Reflective study habits and wellbeing appear in separate threads. Whether the two relate over a full academic term is not addressed by these papers.', signal: 'Early signal' },
];
