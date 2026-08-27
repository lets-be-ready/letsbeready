import type {StructureResolver} from 'sanity/structure'

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // ==================== PAGES ====================
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('Home Page')
                .id('homepage')
                .child(S.document().schemaType('homepage').documentId('homepage')),
              S.listItem()
                .title('Curriculum Page')
                .id('curriculumPage')
                .child(S.document().schemaType('curriculumPage').documentId('curriculumPage')),
              S.listItem()
                .title('Nutrition Page')
                .id('nutritionPage')
                .child(S.document().schemaType('nutritionPage').documentId('nutritionPage')),
              S.listItem()
                .title('Donate Page')
                .id('donatePage')
                .child(S.document().schemaType('donatePage').documentId('donatePage')),
              S.listItem()
                .title('Partners Page')
                .id('partnersPage')
                .child(S.document().schemaType('partnersPage').documentId('partnersPage')),
              S.listItem()
                .title('Staff Page')
                .id('staffPage')
                .child(S.document().schemaType('staffPage').documentId('staffPage')),
            ]),
        ),

      S.divider(),

      // ==================== COLLECTIONS ====================
      S.listItem()
        .title('Classrooms')
        .schemaType('classroom')
        .child(S.documentTypeList('classroom').title('Classrooms')),
      S.listItem()
        .title('Team Members (leadership)')
        .schemaType('teamMember')
        .child(S.documentTypeList('teamMember').title('Team Members')),
      S.listItem()
        .title('Staff Members (full staff)')
        .schemaType('staffMember')
        .child(S.documentTypeList('staffMember').title('Staff Members')),
      S.listItem()
        .title('Partners')
        .schemaType('partner')
        .child(S.documentTypeList('partner').title('Partners')),
      S.listItem()
        .title('Expense Allocation')
        .schemaType('expenseItem')
        .child(S.documentTypeList('expenseItem').title('Expense Allocation')),

      S.divider(),

      // ==================== GLOBAL SETTINGS ====================
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ])
