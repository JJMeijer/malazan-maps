---
layout: map.njk
date: Last Modified

pagination:
    data: books
    size: 1
    alias: item
    addAllPagesToCollections: true

permalink: "books/{{ item.slug }}/"

eleventyComputed:
    title: "{{ item.name }}"
    description: "{{ item.description }}"

title: "{{ eleventyComputed.title }}"
description: "{{ eleventyComputed.description }}"
---
