import * as fs from "fs";
import { writeFile } from '../utils/futils';

const netlify = `#
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
`


export function generateNetlifyToml(site:string) {
  writeFile (site, "netlify.toml", netlify)
}
