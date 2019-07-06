import * as fs from 'fs';

const glob = require('glob');
import { LearningObject } from './learningobjects';
import * as path from 'path';
import {
  copyFolder,
  getDirectories,
  getImageFile,
  initEmptyPath,
  initPath,
  readFile,
  readWholeFile,
  writeFile
} from '../utils/futils';
import * as sh from 'shelljs';

export class Chapter {
  title = '';
  shortTitle = '';
  contentMd = '';
  route = '';
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
        contentMd: wholeFile,
        route:''
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
    initPath(labPath);
    this.directories.forEach(directory => {
      copyFolder(directory, labPath);
    });

    let jsonLab: any = {};
    this.toJsonLab(jsonLab, labPath);
    writeFile(labPath, 'index.json', JSON.stringify(jsonLab));

    sh.cd('..');
  }
  
  toJsonLab(jsonObj: any, url:string) {
    jsonObj.type = this.lotype;
    jsonObj.chapters = [];
    this.chapters.forEach(chapter => {
      let jsonChapter: any = {};
      jsonChapter.title = chapter.title;
      jsonChapter.shortTitle = chapter.shortTitle;
      jsonChapter.contentMd = chapter.contentMd;
      jsonChapter.route = `${url}/${chapter.shortTitle}`;
      jsonObj.chapters.push(jsonChapter);
    });
  }

  toJson(url: string, jsonObj: any) {
    super.toJson(url, jsonObj);
    jsonObj.route = `#lab/${url}`;
    // let labJson: any = {};
    // this.toJsonLab(labJson, jsonObj.route)
    // jsonObj.lo = labJson;
    jsonObj.los = [];
    this.chapters.forEach(chapter => {
      let jsonChapter: any = {};
      jsonChapter.title = chapter.title;
      jsonChapter.shortTitle = chapter.shortTitle;
      jsonChapter.contentMd = chapter.contentMd;
      jsonChapter.route = `${jsonObj.route}/${chapter.shortTitle}`;
      jsonObj.los.push(jsonChapter);
    });

  }
}
