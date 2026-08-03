import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'curriculumPage',
  title: 'Curriculum Page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'intro', title: 'Intro'},
    {name: 'pillars', title: 'Pillars'},
    {name: 'garden', title: 'Gardening'},
    {name: 'nuted', title: 'Nutritional Education'},
    {name: 'supplement', title: 'Supplement Highlight'},
    {name: 'cta', title: 'CTA'},
  ],
  fields: [
    // HERO
    defineField({
      name: 'curriculum_hero_image',
      title: 'Hero Image',
      type: 'image',
      options: {hotspot: true},
      group: 'hero',
    }),
    defineField({
      name: 'curriculum_hero_image_alt',
      title: 'Hero Image Alt',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'curriculum_headline',
      title: 'Headline (HTML allowed)',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),
    defineField({
      name: 'curriculum_subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),

    // INTRO
    defineField({
      name: 'curriculum_intro_lead',
      title: 'Intro Lead (HTML allowed)',
      type: 'text',
      rows: 3,
      group: 'intro',
    }),
    defineField({name: 'curriculum_intro_sub', title: 'Intro Subtext', type: 'text', rows: 3, group: 'intro'}),

    // PILLARS
    defineField({name: 'curriculum_pillar1_title', title: 'Pillar 1 Title', type: 'string', group: 'pillars'}),
    defineField({name: 'curriculum_pillar1_desc', title: 'Pillar 1 Desc', type: 'text', rows: 2, group: 'pillars'}),
    defineField({name: 'curriculum_pillar2_title', title: 'Pillar 2 Title', type: 'string', group: 'pillars'}),
    defineField({name: 'curriculum_pillar2_desc', title: 'Pillar 2 Desc', type: 'text', rows: 2, group: 'pillars'}),
    defineField({name: 'curriculum_pillar3_title', title: 'Pillar 3 Title', type: 'string', group: 'pillars'}),
    defineField({name: 'curriculum_pillar3_desc', title: 'Pillar 3 Desc', type: 'text', rows: 2, group: 'pillars'}),
    defineField({name: 'curriculum_pillar4_title', title: 'Pillar 4 Title', type: 'string', group: 'pillars'}),
    defineField({name: 'curriculum_pillar4_desc', title: 'Pillar 4 Desc', type: 'text', rows: 2, group: 'pillars'}),

    // GARDENING
    defineField({name: 'curriculum_garden_eyebrow', title: 'Eyebrow', type: 'string', group: 'garden'}),
    defineField({name: 'curriculum_garden_heading', title: 'Heading', type: 'text', rows: 2, group: 'garden'}),
    defineField({name: 'curriculum_garden_text', title: 'Body Text', type: 'text', rows: 4, group: 'garden'}),
    defineField({
      name: 'curriculum_garden_image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      group: 'garden',
    }),
    defineField({name: 'curriculum_garden_image_alt', title: 'Image Alt', type: 'string', group: 'garden'}),
    defineField({
      name: 'curriculum_garden_gallery',
      title: 'Photo Gallery',
      description:
        'Add extra photos — the photo box scrolls through them automatically. If empty, only the single Image above shows.',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      group: 'garden',
    }),
    defineField({name: 'curriculum_garden_point1', title: 'Bullet Point 1', type: 'string', group: 'garden'}),
    defineField({name: 'curriculum_garden_point2', title: 'Bullet Point 2', type: 'string', group: 'garden'}),
    defineField({name: 'curriculum_garden_point3', title: 'Bullet Point 3', type: 'string', group: 'garden'}),

    // NUTRITIONAL EDUCATION
    defineField({name: 'curriculum_nuted_eyebrow', title: 'Eyebrow', type: 'string', group: 'nuted'}),
    defineField({name: 'curriculum_nuted_heading', title: 'Heading', type: 'text', rows: 2, group: 'nuted'}),
    defineField({name: 'curriculum_nuted_text', title: 'Body Text', type: 'text', rows: 4, group: 'nuted'}),
    defineField({
      name: 'curriculum_nuted_image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      group: 'nuted',
    }),
    defineField({name: 'curriculum_nuted_image_alt', title: 'Image Alt', type: 'string', group: 'nuted'}),
    defineField({
      name: 'curriculum_nuted_gallery',
      title: 'Photo Gallery',
      description:
        'Add extra photos — the photo box scrolls through them automatically. If empty, only the single Image above shows.',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      group: 'nuted',
    }),
    defineField({name: 'curriculum_nuted_point1', title: 'Bullet Point 1', type: 'string', group: 'nuted'}),
    defineField({name: 'curriculum_nuted_point2', title: 'Bullet Point 2', type: 'string', group: 'nuted'}),
    defineField({name: 'curriculum_nuted_point3', title: 'Bullet Point 3', type: 'string', group: 'nuted'}),

    // SUPPLEMENT HIGHLIGHT
    defineField({
      name: 'curriculum_supplement_badge',
      title: 'Badge Text',
      type: 'string',
      group: 'supplement',
    }),
    defineField({
      name: 'curriculum_supplement_heading',
      title: 'Heading (HTML allowed)',
      type: 'text',
      rows: 2,
      group: 'supplement',
    }),
    defineField({
      name: 'curriculum_supplement_text',
      title: 'Body Text',
      type: 'text',
      rows: 5,
      group: 'supplement',
    }),
    defineField({
      name: 'curriculum_supplement_note',
      title: 'Italic Note',
      type: 'text',
      rows: 2,
      group: 'supplement',
    }),
    defineField({
      name: 'curriculum_supplement_stat1_value',
      title: 'Stat 1 Value',
      type: 'string',
      group: 'supplement',
    }),
    defineField({
      name: 'curriculum_supplement_stat1_label',
      title: 'Stat 1 Label',
      type: 'string',
      group: 'supplement',
    }),
    defineField({
      name: 'curriculum_supplement_stat2_value',
      title: 'Stat 2 Value',
      type: 'string',
      group: 'supplement',
    }),
    defineField({
      name: 'curriculum_supplement_stat2_label',
      title: 'Stat 2 Label',
      type: 'string',
      group: 'supplement',
    }),
    defineField({
      name: 'curriculum_supplement_stat3_value',
      title: 'Stat 3 Value',
      type: 'string',
      group: 'supplement',
    }),
    defineField({
      name: 'curriculum_supplement_stat3_label',
      title: 'Stat 3 Label',
      type: 'string',
      group: 'supplement',
    }),

    // CTA
    defineField({
      name: 'curriculum_cta_heading',
      title: 'CTA Heading (HTML allowed)',
      type: 'text',
      rows: 2,
      group: 'cta',
    }),
    defineField({name: 'curriculum_cta_text', title: 'CTA Body', type: 'text', rows: 3, group: 'cta'}),
    defineField({name: 'curriculum_cta_button', title: 'Button Text', type: 'string', group: 'cta'}),
  ],
  preview: {
    prepare: () => ({title: 'Curriculum Page'}),
  },
})
