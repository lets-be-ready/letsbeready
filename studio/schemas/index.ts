import siteSettings from './siteSettings'
import homepage from './homepage'
import nutritionPage from './nutritionPage'
import curriculumPage from './curriculumPage'
import donatePage from './donatePage'
import partnersPage from './partnersPage'
import staffPage from './staffPage'
import classroom from './classroom'
import teamMember from './teamMember'
import staffMember from './staffMember'
import partner from './partner'
import expenseItem from './expenseItem'

export const schemaTypes = [
  // Singletons
  siteSettings,
  homepage,
  nutritionPage,
  curriculumPage,
  donatePage,
  partnersPage,
  staffPage,
  // Collections
  classroom,
  teamMember,
  staffMember,
  partner,
  expenseItem,
  // Form submissions (captured from website forms)
]
