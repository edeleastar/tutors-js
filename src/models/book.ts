import * as fs from 'fs';

const glob = require('glob');
import { LearningObject } from './learningobjects';
import * as path from 'path';
import { copyFolder, getDirectories, getImageFile, initEmptyPath, readFile, readWholeFile, writeFile } from '../utils/futils';
import * as sh from 'shelljs';
const nunjucks = require('nunjucks');

export class Chapter {
  title = '';
  shortTitle = '';
  contentMd = '';
}

export class Book extends LearningObject {
  directories: Array<string> = [];
  chapters: Array<Chapter> = [];

  constructor(parent: LearningObject) {
    super(parent);
    this.reap();
    this.link = 'index.html';
    this.lotype = 'lab';
    if (fs.existsSync('videoid')) {
      this.videoid = readFile('videoid');
    }
  }

  reapChapters(mdFiles: Array<string>): Array<Chapter> {
    const chapters: Array<Chapter> = [];
    mdFiles.forEach(chapterName => {
      const wholeFile = readWholeFile(chapterName);
      let theTitle = wholeFile.substr(0, wholeFile.indexOf('\n'));
      theTitle = theTitle.replace('\r', '');
      const chapter = {
        file: chapterName,
        title: theTitle,
        shortTitle: chapterName.substring(chapterName.indexOf('.') + 1, chapterName.lastIndexOf('.')),
        contentMd: JSON.stringify(wholeFile)
      };
      chapters.push(chapter);
    });
    return chapters;
  }

  reap(): void {
    let mdFiles = glob.sync('*.md').sort();
    if (mdFiles.length === 0) {
      mdFiles = ['error: missing lab'];
      return;
    }
    const resourceName = path.parse(mdFiles[0]).name;
    super.reap(resourceName);
    this.directories = getDirectories('.');
    this.chapters = this.reapChapters(mdFiles);
    this.title = this.chapters[0].shortTitle;
    this.img = getImageFile('img/main');
  }

  publish(path: string): void {
    sh.cd(this.folder!);
    const labPath = path + '/' + this.folder;
    initEmptyPath(labPath);
    this.directories.forEach(directory => {
      copyFolder(directory, labPath);
    });
    writeFile(labPath, 'index.json', nunjucks.render('lab-json.njk', { lo: this }));
    sh.cd('..');
  }
}
