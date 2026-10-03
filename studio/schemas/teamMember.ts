import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio (HTML allowed)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: {previews: [{title: 'Featured card', aspectRatio: 1}, {title: 'Board card', aspectRatio: 0.91}]}},
      description:
        'Square in the large featured cards, a little taller in the board cards. Open the crop tool on the photo to see both.',
    }),
    defineField({
      name: 'active',
      title: 'Active (show on site)',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {name: 'name', role: 'role', media: 'photo', active: 'active'},
    prepare: ({name, role, media, active}) => ({
      title: name + (active === false ? ' (hidden)' : ''),
      subtitle: role,
      media,
    }),
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
})
