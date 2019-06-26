import { CompositeLearningObject, LearningObject } from './learningobjects';
import { Topic } from './topic';
import { findLos, publishLos, publishTemplate, reapLos } from './loutils';
import { copyFileToFolder, getCurrentDirectory, getIgnoreList, writeFile } from '../utils/futils';
import { CommandOptions } from '../controllers/commands';
const nunjucks = require('nunjucks');

export class Course extends CompositeLearningObject {
  options: CommandOptions;

  insertCourseRef(los: Array<LearningObject>): void {
    los.forEach(lo => {
      lo.course = this;
      if (lo instanceof Topic) {
        this.insertCourseRef(lo.los);
      }
    });
    this.course = this;
  }

  constructor(options?: CommandOptions, parent?: LearningObject) {
    super(parent);
    this.options = options!!;

    this.los = reapLos(this);
    this.lotype = 'course';
    this.reap('course');
    //  this.link = 'index.html';
    const ignoreList = getIgnoreList();
    if (!options) {
      this.los = this.los.filter(lo => ignoreList.indexOf(lo.folder!) < 0);
    } else if (!options.private) {
      this.los = this.los.filter(lo => ignoreList.indexOf(lo.folder!) < 0);
    }
    this.insertCourseRef(this.los);
    if (this.properties!.courseurl) {
      let domain = this.properties!.courseurl.substring(this.properties!.courseurl.indexOf('//') + 2);
      this.properties!.basecourseurl = domain;
    }
  }

  publish(path: string): void {
    console.log(':: ', this.title);
    if (path.charAt(0) !== '/' && path.charAt(1) !== ':') {
      path = getCurrentDirectory() + '/' + path;
    }
    copyFileToFolder(this.img!, path);
    publishLos(path, this.los);
    writeFile(path, 'tutors.json', nunjucks.render('course-json.njk', { lo: this }));
    if (this.properties!!.favicon) {
      copyFileToFolder(this.properties!!.favicon, path);
    }
    if (this.properties!!.crest) {
      copyFileToFolder(this.properties!!.crest, path);
    }
  }
}
