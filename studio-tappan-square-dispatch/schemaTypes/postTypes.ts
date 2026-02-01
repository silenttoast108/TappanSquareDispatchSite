import {defineField, defineType} from 'sanity'

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
        defineField({
            name: 'date',
            type: 'date',
            validation: (rule) => rule.required()
        })
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
            // validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
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
            name: 'image',
            type: 'image',
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
        defineField({
            name: 'date',
            type: 'date',
            validation: (rule) => rule.required()
        })
    ]
});