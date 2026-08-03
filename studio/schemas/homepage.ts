import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Home Page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'disparity', title: 'The Reality'},
    {name: 'turn', title: 'The Turn'},
    {name: 'model', title: 'Our Model'},
    {name: 'proof', title: 'Proof / Stats'},
    {name: 'map', title: 'Map'},
    {name: 'cost', title: 'Cost'},
    {name: 'allocation', title: 'Where Money Goes'},
    {name: 'transparency', title: 'Transparency'},
    {name: 'team', title: 'Team Section'},
    {name: 'quote', title: 'Founder Quote'},
    {name: 'instagram', title: 'Instagram'},
    {name: 'finalCta', title: 'Final CTA'},
  ],
  fields: [
    // ============ INSTAGRAM ============
    defineField({
      name: 'instagram_posts',
      title: 'Instagram Post Links',
      description:
        'Paste links to 2-3 Instagram posts or reels. They appear in the "From the Classroom" section on the homepage. Leave empty to hide the section.',
      type: 'array',
      of: [{type: 'url'}],
      group: 'instagram',
    }),

    // ============ HERO ============
    defineField({name: 'hero_headline', title: 'Headline', type: 'text', rows: 2, group: 'hero'}),
    defineField({name: 'hero_sub', title: 'Subheadline', type: 'text', rows: 2, group: 'hero'}),
    defineField({name: 'hero_cta_text', title: 'CTA Button Text', type: 'string', group: 'hero'}),
    defineField({
      name: 'hero_image',
      title: 'Hero Image',
      type: 'image',
      options: {hotspot: true},
      group: 'hero',
    }),
    defineField({name: 'hero_image_alt', title: 'Hero Image Alt Text', type: 'string', group: 'hero'}),

    // ============ DISPARITY ============
    defineField({name: 'disparity_eyebrow', title: 'Eyebrow', type: 'string', group: 'disparity'}),
    defineField({
      name: 'disparity_headline',
      title: 'Headline (HTML allowed)',
      type: 'text',
      rows: 3,
      group: 'disparity',
    }),
    defineField({name: 'disparity_stat1_value', title: 'Stat 1 Value', type: 'string', group: 'disparity'}),
    defineField({name: 'disparity_stat1_text', title: 'Stat 1 Text', type: 'text', rows: 2, group: 'disparity'}),
    defineField({name: 'disparity_stat2_value', title: 'Stat 2 Value', type: 'string', group: 'disparity'}),
    defineField({name: 'disparity_stat2_text', title: 'Stat 2 Text', type: 'text', rows: 2, group: 'disparity'}),
    defineField({name: 'disparity_stat3_value', title: 'Stat 3 Value', type: 'string', group: 'disparity'}),
    defineField({name: 'disparity_stat3_text', title: 'Stat 3 Text', type: 'text', rows: 2, group: 'disparity'}),

    // ============ TURN ============
    defineField({name: 'turn_word', title: 'Turn Word', type: 'string', group: 'turn'}),
    defineField({
      name: 'turn_question',
      title: 'Turn Question (HTML allowed)',
      type: 'text',
      rows: 2,
      group: 'turn',
    }),

    // ============ MODEL — STEP 1 ============
    defineField({
      name: 'model_step1_image',
      title: 'Step 1 Image',
      type: 'image',
      options: {hotspot: true},
      group: 'model',
    }),
    defineField({name: 'model_step1_image_alt', title: 'Step 1 Image Alt', type: 'string', group: 'model'}),
    defineField({name: 'model_step1_title', title: 'Step 1 Title', type: 'text', rows: 2, group: 'model'}),
    defineField({name: 'model_step1_text', title: 'Step 1 Text', type: 'text', rows: 4, group: 'model'}),

    // ============ MODEL — STEP 2 ============
    defineField({
      name: 'model_step2_image',
      title: 'Step 2 Image',
      type: 'image',
      options: {hotspot: true},
      group: 'model',
    }),
    defineField({name: 'model_step2_image_alt', title: 'Step 2 Image Alt', type: 'string', group: 'model'}),
    defineField({name: 'model_step2_title', title: 'Step 2 Title', type: 'text', rows: 2, group: 'model'}),
    defineField({name: 'model_step2_text', title: 'Step 2 Text', type: 'text', rows: 4, group: 'model'}),

    // ============ MODEL — STEP 3 ============
    defineField({
      name: 'model_step3_image',
      title: 'Step 3 Image',
      type: 'image',
      options: {hotspot: true},
      group: 'model',
    }),
    defineField({name: 'model_step3_image_alt', title: 'Step 3 Image Alt', type: 'string', group: 'model'}),
    defineField({name: 'model_step3_title', title: 'Step 3 Title', type: 'text', rows: 2, group: 'model'}),
    defineField({name: 'model_step3_text', title: 'Step 3 Text', type: 'text', rows: 4, group: 'model'}),

    // ============ PROOF ============
    defineField({name: 'proof_eyebrow', title: 'Eyebrow', type: 'string', group: 'proof'}),
    defineField({name: 'proof_heading', title: 'Heading', type: 'string', group: 'proof'}),
    defineField({name: 'stat_pass_rate', title: 'Pass Rate (number, no %)', type: 'string', group: 'proof'}),
    defineField({name: 'stat_pass_rate_label', title: 'Pass Rate Label', type: 'string', group: 'proof'}),
    defineField({
      name: 'stat_pass_rate_context',
      title: 'Pass Rate Context',
      type: 'text',
      rows: 2,
      group: 'proof',
    }),
    defineField({name: 'stat_children', title: 'Children Count', type: 'string', group: 'proof'}),
    defineField({name: 'stat_children_label', title: 'Children Label', type: 'string', group: 'proof'}),
    defineField({
      name: 'stat_children_context',
      title: 'Children Context',
      type: 'text',
      rows: 2,
      group: 'proof',
    }),
    defineField({name: 'stat_graduation_value', title: 'Graduation Value', type: 'string', group: 'proof'}),
    defineField({name: 'stat_graduation_label', title: 'Graduation Label', type: 'string', group: 'proof'}),
    defineField({
      name: 'stat_graduation_context',
      title: 'Graduation Context',
      type: 'text',
      rows: 2,
      group: 'proof',
    }),
    defineField({name: 'stat_years_value', title: 'Years Value', type: 'string', group: 'proof'}),
    defineField({name: 'stat_years_label', title: 'Years Label', type: 'string', group: 'proof'}),
    defineField({
      name: 'stat_years_context',
      title: 'Years Context',
      type: 'text',
      rows: 2,
      group: 'proof',
    }),

    // ============ MAP ============
    defineField({name: 'map_eyebrow', title: 'Eyebrow', type: 'string', group: 'map'}),
    defineField({name: 'map_heading', title: 'Heading (HTML allowed)', type: 'text', rows: 2, group: 'map'}),
    defineField({name: 'map_description', title: 'Description', type: 'text', rows: 3, group: 'map'}),

    // ============ COST ============
    defineField({name: 'cost_eyebrow', title: 'Eyebrow', type: 'string', group: 'cost'}),
    defineField({name: 'cost_per_classroom', title: 'Cost Per Classroom', type: 'string', group: 'cost'}),
    defineField({name: 'cost_per_child', title: 'Cost Per Child', type: 'string', group: 'cost'}),
    defineField({
      name: 'cost_classroom_desc',
      title: 'Classroom Description',
      type: 'text',
      rows: 2,
      group: 'cost',
    }),
    defineField({name: 'cost_context', title: 'Context', type: 'text', rows: 4, group: 'cost'}),
    defineField({name: 'cost_cta_text', title: 'CTA Button Text', type: 'string', group: 'cost'}),

    // ============ ALLOCATION ============
    defineField({name: 'allocation_heading', title: 'Heading', type: 'string', group: 'allocation'}),
    defineField({name: 'allocation_subheading', title: 'Subheading', type: 'string', group: 'allocation'}),
    defineField({name: 'allocation_item1_title', title: 'Item 1 Title', type: 'string', group: 'allocation'}),
    defineField({name: 'allocation_item1_desc', title: 'Item 1 Description', type: 'text', rows: 2, group: 'allocation'}),
    defineField({name: 'allocation_item2_title', title: 'Item 2 Title', type: 'string', group: 'allocation'}),
    defineField({name: 'allocation_item2_desc', title: 'Item 2 Description', type: 'text', rows: 2, group: 'allocation'}),
    defineField({name: 'allocation_item3_title', title: 'Item 3 Title', type: 'string', group: 'allocation'}),
    defineField({name: 'allocation_item3_desc', title: 'Item 3 Description', type: 'text', rows: 2, group: 'allocation'}),
    defineField({name: 'allocation_item4_title', title: 'Item 4 Title', type: 'string', group: 'allocation'}),
    defineField({name: 'allocation_item4_desc', title: 'Item 4 Description', type: 'text', rows: 2, group: 'allocation'}),

    // ============ TRANSPARENCY ============
    defineField({
      name: 'transparency_image',
      title: 'Transparency Image',
      type: 'image',
      options: {hotspot: true},
      group: 'transparency',
    }),
    defineField({name: 'transparency_image_alt', title: 'Image Alt', type: 'string', group: 'transparency'}),
    defineField({name: 'transparency_eyebrow', title: 'Eyebrow', type: 'string', group: 'transparency'}),
    defineField({
      name: 'transparency_heading',
      title: 'Heading (HTML allowed)',
      type: 'text',
      rows: 2,
      group: 'transparency',
    }),
    defineField({name: 'transparency_text', title: 'Body Text', type: 'text', rows: 5, group: 'transparency'}),
    defineField({name: 'finance_year', title: 'Finance Year', type: 'string', group: 'transparency'}),
    defineField({name: 'finance_total_donated', title: 'Total Donated', type: 'string', group: 'transparency'}),
    defineField({name: 'finance_total_spent', title: 'Total Spent', type: 'string', group: 'transparency'}),
    defineField({name: 'finance_note', title: 'Finance Note', type: 'text', rows: 2, group: 'transparency'}),

    // ============ TEAM SECTION ============
    defineField({name: 'team_eyebrow', title: 'Eyebrow', type: 'string', group: 'team'}),
    defineField({
      name: 'team_heading',
      title: 'Heading (HTML allowed)',
      type: 'text',
      rows: 2,
      group: 'team',
    }),
    defineField({name: 'team_footer_text', title: 'Footer Text', type: 'text', rows: 3, group: 'team'}),

    // ============ FOUNDER QUOTE ============
    defineField({name: 'founder_quote', title: 'Quote (HTML allowed)', type: 'text', rows: 4, group: 'quote'}),
    defineField({name: 'founder_quote_cite', title: 'Citation', type: 'string', group: 'quote'}),

    // ============ FINAL CTA ============
    defineField({
      name: 'final_cta_heading',
      title: 'Heading (HTML allowed)',
      type: 'text',
      rows: 2,
      group: 'finalCta',
    }),
    defineField({name: 'final_cta_text', title: 'Body Text', type: 'text', rows: 3, group: 'finalCta'}),
    defineField({name: 'final_cta_button', title: 'Button Text', type: 'string', group: 'finalCta'}),
  ],
  preview: {
    prepare: () => ({title: 'Home Page'}),
  },
})
