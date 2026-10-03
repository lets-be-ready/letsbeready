import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'nutritionPage',
  title: 'Nutrition Page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'stats', title: 'Stats'},
    {name: 'turn', title: 'The Turn'},
    {name: 'quote', title: 'Quote'},
    {name: 'cta', title: 'CTA'},
  ],
  fields: [
    // HERO
    defineField({
      name: 'nutrition_hero_image',
      title: 'Hero Image',
      type: 'image',
      options: {hotspot: {previews: [{title: 'Home page, Our Programs', aspectRatio: 1.55}]}},
      description:
        'Shows on the home page, beside Nutrition in the Our Programs section. Open the crop tool on the photo to see exactly how it will show.',
      group: 'hero',
    }),
    defineField({name: 'nutrition_hero_image_alt', title: 'Hero Image Alt', type: 'string', group: 'hero'}),
    defineField({
      name: 'nutrition_headline',
      title: 'Headline (HTML allowed)',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),
    defineField({
      name: 'nutrition_subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),

    // STATS
    defineField({name: 'nutrition_stat1_value', title: 'Stat 1 Value', type: 'string', group: 'stats'}),
    defineField({
      name: 'nutrition_stat1_context',
      title: 'Stat 1 Context',
      type: 'text',
      rows: 2,
      group: 'stats',
    }),
    defineField({name: 'nutrition_stat2_value', title: 'Stat 2 Value', type: 'string', group: 'stats'}),
    defineField({
      name: 'nutrition_stat2_context',
      title: 'Stat 2 Context',
      type: 'text',
      rows: 2,
      group: 'stats',
    }),

    // TURN
    defineField({
      name: 'nutrition_turn_image',
      title: 'Turn Image',
      type: 'image',
      options: {hotspot: {previews: [{title: 'Programs page', aspectRatio: 1.55}]}},
      description:
        'Shows in the nutrition section of the Programs page. Open the crop tool on the photo to see exactly how it will show.',
      group: 'turn',
    }),
    defineField({name: 'nutrition_turn_image_alt', title: 'Turn Image Alt', type: 'string', group: 'turn'}),
    defineField({
      name: 'nutrition_turn_heading',
      title: 'Heading (HTML allowed)',
      type: 'text',
      rows: 2,
      group: 'turn',
    }),
    defineField({name: 'nutrition_turn_text', title: 'Body Text', type: 'text', rows: 4, group: 'turn'}),
    defineField({name: 'nutrition_feed_stat1_value', title: 'Feed Stat 1 Value', type: 'string', group: 'turn'}),
    defineField({name: 'nutrition_feed_stat1_label', title: 'Feed Stat 1 Label', type: 'string', group: 'turn'}),
    defineField({name: 'nutrition_feed_stat2_value', title: 'Feed Stat 2 Value', type: 'string', group: 'turn'}),
    defineField({name: 'nutrition_feed_stat2_label', title: 'Feed Stat 2 Label', type: 'string', group: 'turn'}),
    defineField({name: 'nutrition_feed_stat3_value', title: 'Feed Stat 3 Value', type: 'string', group: 'turn'}),
    defineField({name: 'nutrition_feed_stat3_label', title: 'Feed Stat 3 Label', type: 'string', group: 'turn'}),

    // QUOTE
    defineField({
      name: 'nutrition_quote',
      title: 'Quote (HTML allowed)',
      type: 'text',
      rows: 4,
      group: 'quote',
    }),
    defineField({name: 'nutrition_quote_cite', title: 'Citation', type: 'string', group: 'quote'}),

    // CTA
    defineField({
      name: 'nutrition_cta_heading',
      title: 'CTA Heading (HTML allowed)',
      type: 'text',
      rows: 2,
      group: 'cta',
    }),
    defineField({name: 'nutrition_cta_button', title: 'CTA Button Text', type: 'string', group: 'cta'}),
  ],
  preview: {
    prepare: () => ({title: 'Nutrition Page'}),
  },
})
