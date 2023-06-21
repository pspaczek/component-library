import * as child from 'child_process';
import {
  writeFileSync,
  existsSync,
  mkdirSync,
} from 'fs';

const githubURL = 'https://github.com/infermedica/component-library/pull/';
const releaseDate = new Date().toLocaleString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const commitTypes = [
  {
    type: 'breakingChanges',
    icon: '⛔️',
    name: 'Breaking Changes',
  },
  {
    type: 'feat',
    icon: '🚀',
    name: 'Feature',
  },
  {
    type: 'refactor',
    icon: '📝',
    name: 'Refactors',
  },
  {
    type: 'fix',
    icon: '🐛',
    name: 'Fixes',
  },
  {
    type: 'test',
    icon: '🔍',
    name: 'Tests',
  },
  {
    type: 'chore',
    icon: '🧹',
    name: 'Chores',
  },
  {
    type: 'docs',
    icon: '📄',
    name: 'Docs',
  },
];

const saveFile = (version, content) => {
  const [
    major,
    minor,
  ] = version.split('.');
  const releaseVersion = `v${version}`;
  const releaseDirRootPath = `./docs/releases/v${major}.${minor}.x`;
  const releaseDirPath = `${releaseDirRootPath}/${releaseVersion}`;

  if (!existsSync(releaseDirRootPath)) {
    mkdirSync(releaseDirRootPath);
  }

  if (!existsSync(releaseDirPath)) {
    mkdirSync(releaseDirPath);
  }

  try {
    writeFileSync(`${releaseDirPath}/changelog.stories.mdx.mdx`, content[0]);
    console.log(`🚀 Release ${releaseVersion} file has been created!`);
  } catch (err) {
    console.error(`⛔️ Something goes wrong and the Release ${releaseVersion} file hasn't been created!`, err);
  }
};

const createChangelogSections = (commits) => {
  const groupedCommits = commits.reduce(
    (object, commit) => {
      const [ match, type ] = commit.match(/(.*):/);
      const formattedCommit = commit.replace(
        /.+: (.*?)(?:\(#(.*)\))?$/gm,
        (match, description, hash) => {
          if( description && hash ) {
            return `${description} ([#${hash}](${githubURL}${hash}))`
          }
          return '';
        });
      if(formattedCommit) {
        object[type] = [
          ...object[type] || [],
          formattedCommit
        ]
      }
      return object;
    },
    {}
  )

  return commitTypes.reduce(
    (content, { type, icon, name } ) => {
      if(groupedCommits[type]) {
        return content
          + `\n## ${icon} ${name}
* ${groupedCommits[type].join('\n* ')}\n`;
      }
      return content;
    },
    ''
  );
};

const createChangelogMdx = (version, commits) => {
  const [
    major,
    minor,
  ] = version.split('.');
  let doc = `import { Meta } from '@storybook/blocks';

<Meta title="Releases/v${major}.${minor}.x/v${version}/Changelog"/>
  
# ${version} (${releaseDate})
${createChangelogSections(commits)}
`;
  saveFile(version, [ doc ]);
  return doc;
};

const createReleaseChangelog = (version) => {
  child.exec('git log --pretty=format:"%s" --no-merges $(git describe --tags --abbrev=0 @^)..@', (error, stdout, stderr) => {
    if (error) {
      console.error(`GIT LOG Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`GIT LOG stdError: ${stderr.message}`);
      return;
    }
    const commits = stdout.split(/\n/);
    createChangelogMdx(version, commits);
  });
};

export default createReleaseChangelog;
