/*
 * Copyright 2016 resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

module.exports = {

  subjectParser: 'angular',

  getGitReferenceFromVersion: 'v-prefix',

  editChangelog: true,

  editVersion: true,

  addEntryToChangelog: {
    preset: 'prepend',
    fromLine: 5
  },

  includeCommitWhen: 'has-changelog-entry',

  getIncrementLevelFromCommit: (commit) => {
    if (/none/i.test(commit.footer['Change-type'])) {
      return null
    }
    return commit.footer['Change-type'] &&
      commit.footer['Change-type'].toLowerCase()
  },

  transformTemplateData: (data) => {
    if (data.commits.length === 0) {
      throw new Error('No commits annotated with Changelog-entry')
    }
    data.features = data.commits.filter((commit) => {
      return commit.subject.type === 'feat'
    })

    data.fixes = data.commits.filter((commit) => {
      return commit.subject.type === 'fix'
    })

    data.misc = data.commits.filter((commit) => {
      return !([ 'fix', 'feat' ].includes(commit.subject.type))
    })

    return data
  },

  template: [
    '## v{{version}} - {{moment date "Y-MM-DD"}}',
    '{{#if features.length}}',
    '',
    '### Features',
    '',
    '{{#each features}}',
    '{{#with footer}}',
    '- {{capitalize Changelog-entry}}',
    '{{/with}}',
    '{{/each}}',
    '{{/if}}',
    '{{#if fixes.length}}',
    '',
    '### Fixes',
    '',
    '{{#each fixes}}',
    '{{#with footer}}',
    '- {{capitalize Changelog-entry}}',
    '{{/with}}',
    '{{/each}}',
    '{{/if}}',
    '{{#if misc.length}}',
    '',
    '### Misc',
    '',
    '{{#each misc}}',
    '{{#with footer}}',
    '- {{capitalize Changelog-entry}}',
    '{{/with}}',
    '{{/each}}',
    '{{/if}}'
  ].join('\n')

}
