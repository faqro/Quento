import { School_O } from './schools'

// --------------------------SUBJECTS--------------------------
export const SubjectGroups = {
  Sciences: ['Physics', 'Chemistry', 'Biology', 'Math'],
  Languages: ['English', 'French', 'Spanish'],
  Arts: ['Visual Arts', 'Music', 'Dance', 'Drama', 'Film'],
  'Social Sciences': ['TOK', 'Geography', 'History', 'Business'],
  Technology: ['ICS', 'ITGS', 'ComTech'],
  Other : ["Phys Ed", "General"]
} as const
export const AllSubjectList = [
  'Physics', 'Chemistry', 'Biology', 'Math',
  'English', 'French', 'Spanish', 
  'Visual Arts', 'Music', 'Dance', 'Drama', 'Film',
  'TOK', 'Geography', 'History', 'Business',
  'ICS', 'ITGS', 'ComTech',
  'Phys Ed'
]

//Individual Subjects
//Any item of this type is in AllSubjectList
export type Subject_O = typeof SubjectList[number]
//Actual list with subject complying with 
export const SubjectList = Object.entries(SubjectGroups).flatMap(
  (group) => group[1]
)
//Subject booleans
export const SubjectOptions: {
  [index in Subject_O]?: boolean
} = SubjectList.reduce((o, key) => ({ ...o, [key]: false }), {})
// Icons for subjects
export const SubjectIconList: { [index in Subject_O | SubjectGroup_O]: string } = {
  Sciences: 'bx-bulb',
  Languages: 'bx-pen',
  Arts: 'bx-palette',
  'Social Sciences': 'bx-world',
  Technology: 'bx-server',
  Other: "bx-list-plus",

  Math: 'bx-brain',
  Physics: 'bx-atom',
  Chemistry: 'bxs-flask',
  Biology: 'bx-dna',
  English: 'bx-book-bookmark',
  French: 'bx-book',
  Spanish: 'bx-bible',
  'Visual Arts': 'bxs-brush',
  Music: 'bxs-music',
  Dance: 'bxs-guitar-amp',
  Drama: 'bx-mask',
  Film: 'bx-camera-movie',
  TOK: 'bx-network-chart',
  Geography: 'bx-globe',
  History: 'bxs-landmark',
  Business: 'bx-briefcase',
  ICS: 'bx-code-alt',
  ITGS: 'bx-data',
  ComTech: 'bxs-component',
  "Phys Ed": "bxs-basketball",
  General: "bx-slider-alt"
} as const


//Subject Groups
//Any item of this type is in "Sciences" | "Languages" | "Arts" | "Social Sciences" | "Technology" | "Other"
export type SubjectGroup_O = keyof typeof SubjectGroups
//empty array that accepts type that matches SubjectGroup_O
export const SubjectGroupList: SubjectGroup_O[] = Object.keys(
  SubjectGroups
) as SubjectGroup_O[]


//PS why there is two ways of creating dependancies based on these objects is beyond me

//--------------------------Some Interfaces--------------------------
//Individual Subject interface
export interface SubjectItem {
  name: Subject_O
  iconClass: typeof SubjectIconList[SubjectItem['name']]
}
//Group Subject Interface
export interface SubjectGroup {
  name: SubjectGroup_O
  iconClass: string
  items: SubjectItem[]
}


//--------------------------FILTERING--------------------------

//All filters together
export interface FilterOptions {
  filterSubjects: Subject_O[]
  filterGrades: Grade_O
  filterSchools: School_O | 'All Schools'
  sortSelect: SortOptions_O
}


export const SortOptionsList = [
  {name: 'Up Votes',value: 'upVotes'},
  {name: 'Views',value: 'views'},
  {name: 'Recent',value: 'createdAt'},
  {name : "Popular",value : "magicRank"}
] as const
export type SortOptions_O = typeof SortOptionsList[number]['value']


//--------------------------Grade--------------------------

export const GradeList = [7, 8, 9, 10, 11, 12, 'ALL'] as const
export type Grade_O = typeof GradeList[number]



export const NestedSubjectList: SubjectGroup[] = Object.entries(SubjectGroups).map((subjectGroup, index) => {
  const key = subjectGroup[0] as SubjectGroup_O
  const subjects = SubjectGroups[key] as readonly Subject_O[]
  return {
    name: key,
    iconClass: SubjectIconList[key],
    items: [
      ...subjects.map((name) => ({
        name,
        iconClass: SubjectIconList[name]
      }))
    ]
  }
})

//--------------------------ALL KEYWORDS--------------------------
export type Keyword_O = Subject_O | SubjectGroup_O | Grade_O
export const KeywordList = [...SubjectList, ...GradeList, ...SubjectGroupList]