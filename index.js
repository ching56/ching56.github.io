import './index.scss';
import { PROFILE, PROJS} from './src/content';

import $ from 'jquery';

function concat(a, b) {
  return a + b;
}

const title = `<h1>${PROFILE.name}</h1>`
const subtitle = `<h3>${PROFILE.title} in ${PROFILE.place}</h3>`
const intro = `<p>${PROFILE.intro}</p>`
const experience = `<ul>${PROFILE.experience.map(d => `<li><p>${d}</p></li>`).reduce(concat, '')}</ul>`
const links = `${PROFILE.links.map(d => `<a href="${d.link}"><strong>${d.text}</strong></a>`).reduce(concat, '')}`
$('body').append('<hr>')
const projectTitle = `<h3>${PROJS.title}</h3>`
const projects = `<ul>
                  ${PROJS.list.map(d => `
                    <li>
                      <a href="${d.link}">
                        <strong>${d.name}</strong>
                      </a>
                      ${d.honor.map(d => `<div>${d}</div>`).reduce(concat, '')}
                    </li>
                  `).reduce(concat, '')}
                  </ul>`
const contact = `<a href="mailto:${PROFILE.contact.mail}"><strong>${PROFILE.contact.text}</strong></a>`

const content = `
  <section>
    <div>
      ${title}
      ${subtitle}
      ${intro}
    </div>
  </section>
  <section>
    ${experience}
    ${links}
  </section>
  <section>
    ${projectTitle}
    ${projects}
    ${contact}
  </sectio>
`

$('body').html(content)