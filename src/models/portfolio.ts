import * as fs from 'fs';
import * as sh from 'shelljs';
import { CompositeLearningObject, LearningObject } from './learningobjects';
import { publishLos, reapLos } from '../utils/loutils';
import { copyFileToFolder, getCurrentDirectory, verifyFolder, writeFile } from '../utils/futils';
import { Course } from './course';
import { CommandOptions } from '../controllers/commands';

interface CourseGroup {
  title: string;
  description: string;
  outline: string;
  modules: string[];
  courses: Array<Course>;
}

export class Portfolio extends CompositeLearningObject {
  courseGroups: Array<CourseGroup> = [];
  options: CommandOptions;
  subtitle = '';
  homeDir = '';

  constructor(options: CommandOptions, parent?: LearningObject) {
    super(parent);
    this.options = options;
    this.homeDir = getCurrentDirectory();
    this.reap();
    this.lotype = 'portfolio';
  }

  reap(): void {
    // const yamlData = yaml.load('./portfolio.yaml');
    // super.los = reapLos(this);
    // this.title = yamlData.title;
    // this.subtitle = yamlData.subtitle;
    // //this.properties = readPropsFromTree();
    // yamlData.courseGroups.forEach((courseGroup: CourseGroup) => {
    //   courseGroup.courses = new Array<Course>();
    //   if (courseGroup.outline) {
    //     courseGroup.description = courseGroup.outline;
    //   }
    //   if (courseGroup.modules) {
    //     courseGroup.modules.forEach((module: string) => {
    //       if (fs.existsSync(module)) {
    //         sh.cd(module);
    //         const course = new Course(this.options, this);
    //         if (course) {
    //           course.folder = module;
    //           courseGroup.courses.push(course);
    //         }
    //         sh.cd(this.homeDir);
    //       } else {
    //         console.log('- could not find ' + module);
    //       }
    //     });
    //   }
    //   this.courseGroups.push(courseGroup);
    // });
  }

  publish(path: string): void {
    const absPath = this.homeDir + '/' + path;

    for (let courseGroup of this.courseGroups) {
      for (let course of courseGroup.courses) {
        const coursePath = absPath + '/' + course.folder;
        sh.cd(course.folder!);
        if (course.properties!.submodule! != 'true') {
          course.link = course.properties!.courseurl!;
        } else {
          course.link = course.folder + '/index.html';
          verifyFolder(coursePath);
          course.publish(coursePath);
        }
        sh.cd(this.homeDir);
      }
    }
    console.log('test');
    //publishTemplate(absPath, 'index.html', 'portfolio.njk', this);
    publishLos(path, this.los);
    if (this.properties!!.favicon) {
      copyFileToFolder(this.properties!!.favicon, path);
    }
    if (this.properties!!.crest) {
      copyFileToFolder(this.properties!!.crest, path);
    }

    copyFileToFolder('favicon.ico', absPath);

    let courseUrl = this.properties!.courseurl;
    let courseJson: any = {};
    this.toJson(courseUrl, courseJson);
    writeFile(path, 'tutors.json', JSON.stringify(courseJson));
  }
}
