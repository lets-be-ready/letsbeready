import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'staffMember',
  title: 'Staff Member',
  type: 'document',
  description: 'Working staff (teachers, field coordinators, etc.) — separate from leadership team. Shown on the Staff page.',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      description: 'e.g. "Lead Teacher", "Field Coordinator", "Cook"',
    }),
    defineField({
      name: 'region',
      title: 'Region / Department',
      type: 'string',
      description: 'Optional — e.g. "Chimaltenango"',
    }),
    defineField({
      name: 'bio',
      title: 'Bio (optional, HTML allowed)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: {previews: [{title: 'Staff page circle', aspectRatio: 1}]}},
      description:
        'Shows as a small circle on the staff page. Open the crop tool on the photo to see exactly how it will show.',
    }),
    defineField({
      name: 'active',
      title: 'Active (show on staff page)',
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
    select: {name: 'name', role: 'role', region: 'region', media: 'photo', active: 'active'},
    prepare: ({name, role, region, media, active}) => ({
      title: name + (active === false ? ' (hidden)' : ''),
      subtitle: [role, region].filter(Boolean).join(' — '),
      media,
    }),
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Region',
      name: 'regionAsc',
      by: [{field: 'region', direction: 'asc'}, {field: 'name', direction: 'asc'}],
    },
  ],
})
