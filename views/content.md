---
layout: content.njk
date: Last Modified

pagination:
    data: content
    size: 1
    alias: item
    addAllPagesToCollections: true

permalink: "{{ item.type }}/{{ item.slug }}/"

eleventyComputed:
    title: "{{ item.name }}"
    description: "{{ item.description }}"

title: "{{ eleventyComputed.title }}"
description: "{{ eleventyComputed.description }}"
---
