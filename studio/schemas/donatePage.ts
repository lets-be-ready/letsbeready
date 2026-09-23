import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'donatePage',
  title: 'Donate Page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'givelively', title: 'GiveLively Widget'},
    {name: 'lifetime', title: 'Lifetime Impact'},
    {name: 'sponsor', title: 'Sponsor Block'},
    {name: 'transparency', title: 'Where Donation Goes'},
    {name: 'mail', title: 'Mail / Other'},
    {name: 'contact', title: 'Contact'},
  ],
  fields: [
    // HERO
    defineField({
      name: 'donate_headline',
      title: 'Headline (HTML allowed)',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),
    defineField({name: 'donate_sub', title: 'Subheadline', type: 'text', rows: 3, group: 'hero'}),
    defineField({
      name: 'donate_image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      group: 'hero',
    }),
    defineField({name: 'donate_image_alt', title: 'Image Alt', type: 'string', group: 'hero'}),
    defineField({
      name: 'donate_quote',
      title: 'Quote (HTML allowed)',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),
    defineField({name: 'donate_quote_cite', title: 'Quote Citation', type: 'string', group: 'hero'}),
    defineField({name: 'donate_stat1_value', title: 'Stat 1 Value', type: 'string', group: 'hero'}),
    defineField({name: 'donate_stat1_label', title: 'Stat 1 Label', type: 'string', group: 'hero'}),
    defineField({name: 'donate_stat2_value', title: 'Stat 2 Value', type: 'string', group: 'hero'}),
    defineField({name: 'donate_stat2_label', title: 'Stat 2 Label', type: 'string', group: 'hero'}),
    defineField({name: 'donate_stat3_value', title: 'Stat 3 Value', type: 'string', group: 'hero'}),
    defineField({name: 'donate_stat3_label', title: 'Stat 3 Label', type: 'string', group: 'hero'}),

    // GIVELIVELY WIDGET — paste the full embed snippet from
    // GiveLively dashboard → Donation Widgets → Get Embed Code
    defineField({
      name: 'givelively_widget',
      title: 'GiveLively Embed Code (HTML)',
      type: 'text',
      rows: 8,
      description:
        'Paste the entire <script>...</script><div>...</div> embed snippet from your GiveLively dashboard (Donation Widgets → Get Embed Code). Updating this field will change the donation widget on the live site.',
      group: 'givelively',
    }),

    // LIFETIME IMPACT — manually updated annually from annual report
    defineField({
      name: 'lifetime_eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'Since 2008',
      group: 'lifetime',
    }),
    defineField({
      name: 'lifetime_heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Lifetime Impact',
      group: 'lifetime',
    }),
    defineField({
      name: 'lifetime_stat1_value',
      title: 'Stat 1 Value',
      type: 'string',
      description: 'Placeholder — replace with real number from annual report',
      group: 'lifetime',
    }),
    defineField({
      name: 'lifetime_stat1_label',
      title: 'Stat 1 Label',
      type: 'string',
      group: 'lifetime',
    }),
    defineField({
      name: 'lifetime_stat2_value',
      title: 'Stat 2 Value',
      type: 'string',
      description: 'Placeholder — replace with real number from annual report',
      group: 'lifetime',
    }),
    defineField({
      name: 'lifetime_stat2_label',
      title: 'Stat 2 Label',
      type: 'string',
      group: 'lifetime',
    }),
    defineField({
      name: 'lifetime_stat3_value',
      title: 'Stat 3 Value',
      type: 'string',
      description: 'Placeholder — replace with real number from annual report',
      group: 'lifetime',
    }),
    defineField({
      name: 'lifetime_stat3_label',
      title: 'Stat 3 Label',
      type: 'string',
      group: 'lifetime',
    }),

    // SPONSOR
    defineField({name: 'sponsor_badge', title: 'Sponsor Badge', type: 'string', group: 'sponsor'}),
    defineField({name: 'sponsor_heading', title: 'Heading', type: 'string', group: 'sponsor'}),
    defineField({name: 'sponsor_price', title: 'Price', type: 'string', group: 'sponsor'}),
    defineField({
      name: 'sponsor_description',
      title: 'Description',
      type: 'text',
      rows: 3,
      group: 'sponsor',
    }),
    defineField({name: 'sponsor_button_text', title: 'Button Text', type: 'string', group: 'sponsor'}),

    // TRANSPARENCY BARS
    defineField({
      name: 'donate_transparency_heading',
      title: 'Transparency Heading',
      type: 'string',
      description:
        'Bars 1–5 below power the current Donate page. The redesigned Donate page reads Expense Items instead (the same list as the About chart), so these five boxes retire when the redesign ships.',
      group: 'transparency',
    }),
    // Retire on ship day: the redesign renders one bar per Expense Item.
    defineField({name: 'donate_bar1_label', title: 'Bar 1 Label', type: 'string', group: 'transparency'}),
    defineField({name: 'donate_bar1_amount', title: 'Bar 1 Amount', type: 'string', group: 'transparency'}),
    defineField({name: 'donate_bar2_label', title: 'Bar 2 Label', type: 'string', group: 'transparency'}),
    defineField({name: 'donate_bar2_amount', title: 'Bar 2 Amount', type: 'string', group: 'transparency'}),
    defineField({name: 'donate_bar3_label', title: 'Bar 3 Label', type: 'string', group: 'transparency'}),
    defineField({name: 'donate_bar3_amount', title: 'Bar 3 Amount', type: 'string', group: 'transparency'}),
    defineField({name: 'donate_bar4_label', title: 'Bar 4 Label', type: 'string', group: 'transparency'}),
    defineField({name: 'donate_bar4_amount', title: 'Bar 4 Amount', type: 'string', group: 'transparency'}),
    defineField({name: 'donate_bar5_label', title: 'Bar 5 Label', type: 'string', group: 'transparency'}),
    defineField({name: 'donate_bar5_amount', title: 'Bar 5 Amount', type: 'string', group: 'transparency'}),
    defineField({name: 'fee_note', title: 'Fee Note (HTML allowed)', type: 'text', rows: 2, group: 'transparency'}),

    // MAIL
    defineField({name: 'mail_heading', title: 'Mail Heading', type: 'string', group: 'mail'}),
    defineField({
      name: 'mail_address',
      title: 'Mail Address (HTML allowed)',
      type: 'text',
      rows: 4,
      group: 'mail',
    }),
    defineField({
      name: 'other_platforms_heading',
      title: 'Other Platforms Heading',
      type: 'string',
      group: 'mail',
    }),
    defineField({
      name: 'other_platforms_note',
      title: 'Other Platforms Note',
      type: 'text',
      rows: 2,
      group: 'mail',
    }),

    // CONTACT
    defineField({name: 'contact_eyebrow', title: 'Contact Eyebrow', type: 'string', group: 'contact'}),
    defineField({name: 'contact_heading', title: 'Contact Heading', type: 'string', group: 'contact'}),
  ],
  preview: {
    prepare: () => ({title: 'Donate Page'}),
  },
})
