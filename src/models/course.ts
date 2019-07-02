import { CompositeLearningObject, LearningObject } from './learningobjects';
import { Topic } from './topic';
import { publishLos, reapLos } from '../utils/loutils';
import { copyFileToFolder, getCurrentDirectory, getIgnoreList, writeFile } from '../utils/futils';
import { CommandOptions } from '../controllers/commands';

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
    const ignoreList = getIgnoreList();
    if (!options) {
      this.los = this.los.filter(lo => ignoreList.indexOf(lo.folder!) < 0);
    } else if (!options.private) {
      this.los = this.los.filter(lo => ignoreList.indexOf(lo.folder!) < 0);
    }
    this.insertCourseRef(this.los);
  }

  publish(path: string): void {
    console.log(':: ', this.title);
    if (path.charAt(0) !== '/' && path.charAt(1) !== ':') {
      path = getCurrentDirectory() + '/' + path;
    }
    copyFileToFolder(this.img!, path);
    publishLos(path, this.los);

    let courseUrl = this.course!.properties!.courseurl;
    let courseJson: any = {};
    this.toJson(courseUrl, courseJson);
    writeFile(path, 'tutors.json', JSON.stringify(courseJson));
  }

  toJson(url: string, jsonObj: any) {
    let baseCourseUrl = url.substring(url.indexOf('//') + 2);
    super.toJson(baseCourseUrl, jsonObj);

    jsonObj.los = [];
    this.los.forEach(lo => {
      let topicObj: any = {};
      lo.toJson(baseCourseUrl, topicObj);
      jsonObj.los.push(topicObj);
    });
  }
}
