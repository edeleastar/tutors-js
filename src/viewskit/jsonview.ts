import { Course } from '../models/course';
import { LearningObject } from '../models/learningobjects';
import { writeFile } from '../utils/futils';

export class JsonView {
  constructor(private path: string, private course: Course) {}

  base(json: any, lo: LearningObject, url: string): void {
    json.properties = lo.properties;

    json.type = lo.lotype;
    json.img = `https://${url}/${lo.img}`;
    if (lo.videoid) {
      json.video = `#video/${url}/${lo.videoid}`;
    }
    json.summary = lo.objectivesMd;
    json.id = lo.folder;
  }

  publish(): void {
    let courseJson: any = {};

    let courseUrl = this.course!.properties!.courseurl;
    let baseCourseUrl = courseUrl.substring(courseUrl.indexOf('//') + 2);
    this.base(courseJson, this.course, courseUrl);
    courseJson.los = [];
    this.course.los.forEach(lo => {
      let topicJson: any = {};
      this.base(topicJson, lo, baseCourseUrl);
      courseJson.los.push(topicJson);
    });
    writeFile(this.path, 'course.json', JSON.stringify(courseJson));
  }
}
