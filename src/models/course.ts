import { CompositeLearningObject, LearningObject } from './learningobjects';
import { Topic } from './topic';
import { publishLos, reapLos } from '../utils/loutils';
import { copyFileToFolder, getCurrentDirectory, readEnrollment, readYaml, writeFile } from '../utils/futils';
import { CommandOptions } from '../controllers/commands';
import { Properties } from '../utils/properties';
import * as fs from 'fs';
const version = require('../../package.json').version;

export class Course extends CompositeLearningObject {
  options: CommandOptions;
  enrollment?: Properties;

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
    const ignoreList = this.properties!.ignore;
    if (ignoreList) {
      const los = this.los.filter(lo => ignoreList.indexOf(lo.folder!) >= 0);
      los.forEach(lo => {
        lo.hide = true;
      });
    }
    this.insertCourseRef(this.los);
    if (fs.existsSync('enrollment.yaml')) {
      this.enrollment = readEnrollment('enrollment.yaml');
      if (this.enrollment) {
        console.log(`Enrolment file detected with ${this.enrollment.students.length} students`);
      }
    }
  }

  publish(path: string): void {
    console.log(':: ', this.title);
    if (path.charAt(0) !== '/' && path.charAt(1) !== ':') {
      path = getCurrentDirectory() + '/' + path;
    }
    copyFileToFolder(this.img!, path);
    publishLos(path, this.los);

    let courseJson: any = {};
    this.toJson('{{COURSEURL}}/', courseJson);
    writeFile(path, 'tutors.json', JSON.stringify(courseJson));
  }

  toJson(url: string, jsonObj: any) {
    super.toJson(url, jsonObj);
    jsonObj.version = version;
    jsonObj.los = [];
    this.los.forEach(lo => {
      let topicObj: any = {};
      lo.toJson(url, topicObj);
      jsonObj.los.push(topicObj);
    });
    jsonObj.enrollment = this.enrollment;
  }
}
