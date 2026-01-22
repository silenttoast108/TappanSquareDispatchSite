import {defineField, defineType} from 'sanity'
// import axios from 'axios'
// import { createClient } from '@sanity/client'
// //changing type names will result in data deletion

// export const client = createClient({
//   projectId: "p9bsktqy",
//   dataset: "production",
//   apiVersion: "2024-01-01",
//   useCdn: false,
// });

export const header = defineType({
  name: 'header',
  title: 'header',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
        name: 'siteLogo', //figure out how this can be added to tab icon later
        type: 'image'
    }),
    defineField({
        name: 'subTitle',
        type: 'string'
    }),
  ],
});

export const floatingText = defineType({
    name: 'floatingText',
    title: 'FloatingText',
    type: 'document',
    fields: [
        defineField({
            name: 'text',
            type: 'array',
            of: [{type: 'block'}]
        })
    ]
});

export const collectionOrb = defineType({
    name: 'collectionOrb',
    title: 'CollectionOrb',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            options: {source: 'title'},
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'image',
            type: 'image',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'description',
            type: 'array',
            of: [{type: 'block'}],
            validation: (rule) => rule.required(),
        }),
    ]
});

export const story = defineType({
    name: 'story',
    title: 'Story',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({//this works for now
            name: 'AssociatedCollection',
            type: 'reference',
            to: [{type: 'collectionOrb'}],
            // 
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'storySlug',
            type: 'slug',
            options: {source: 'title'},
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'contributors',
            type: 'string',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'description',
            type: 'array',
            of: [{type: 'block'}]
        }),
        defineField({
            name: 'script',
            type: 'array',
            of: [{type: 'block'}]
        }),
        defineField({
            name: 'images',
            type: 'array',
            of: [{type: 'image'}],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'spotifyURL',
            type: 'url'
        }),
        defineField({
            name: 'audioFile',
            type: 'file',
            options: {
                accept: 'audio/*'
            },
            validation: (rule) => rule.required().assetRequired()
        }),
    ]
});

export const theme = defineType({ //may or may not use this
    name: 'theme',
    title: 'Theme',
    type: 'document',
    fields: [
        defineField({
            name: 'font1',
            type: 'string'
        }),
        defineField({
            name: 'font2',
            type: 'string'
        }),
        defineField({
            name: 'font3',
            type: 'string'
        }),
        defineField({
            name: 'color1',
            type: 'string'
        }),
        defineField({
            name: 'color2',
            type: 'string'
        }),
        defineField({
            name: 'color3',
            type: 'string'
        }),
    ]
});