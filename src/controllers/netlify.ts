import * as fs from 'fs';
import { writeFile } from '../utils/futils';

const netlifyToml = `#
# The following redirect is intended for use with most SPAs that handle
# routing internally.
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  # Define which paths this specific [[headers]] block will cover.
  for = "/*"
    [headers.values]
    Access-Control-Allow-Origin = "*"
`;

function redirectHtmlFile(url: string): string {
  const netlifyHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title> Tutors Reader </title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href='https://fonts.googleapis.com/css?family=Open+Sans' type='text/css'>
    <script src="https://use.fontawesome.com/releases/v5.8.2/js/all.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.1.5/css/uikit.min.css" rel="stylesheet"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.1.5/js/uikit.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.1.5/js/uikit-icons.min.js"></script>
  </head>
  <body>
    <div class="uk-flex uk-flex-center uk-flex-middle uk-text-center uk-container-expand uk-padding-small" uk-grid>
      <div class="uk-width-3-4@m  uk-card uk-card-default uk-padding-small">
        <div uk-grid>
          <div class="uk-width-1-5@m">
            <i class="fas fa-chalkboard-teacher fa-4x"></i>
          </div>
          <div class="uk-width-expand@m uk-text-left">
            <div class="uk-heading-small">Tutors</div>
            <div class="uk-text-muted uk-text-small">
              Tuition System created by Eamonn de Leastar.
            </div>
            <div class="uk-text">
              Course deployed here: <a href="https://tutors.design/course/${url}"> https://tutors.design/course/${url} </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`;

  return netlifyHtml;
}

export function generateNetlifyToml(site: string, url: string) {
  writeFile(site, 'netlify.toml', netlifyToml);
  let baseCourseUrl = url.substring(url.indexOf('//') + 2);
  writeFile(site, 'index.html', redirectHtmlFile(baseCourseUrl));
}
