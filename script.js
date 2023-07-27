/*
 * Javascript for https://dcpetty.github.io/cv/
 *
 * Engineer / Educator
 */

/** CLASSES definition and lambda functions using them. */
const CLASSES = [`eng`, `edu`, ],
  valid = (name) => CLASSES.includes(name) ? name : undefined,
  opposite = (name) => valid(name) == `eng` ? `edu` : `eng`,
  stylesheet = (name) => (valid(name) ?? `eng`) == `eng` ? `engineer` : `educator`,
  classes = (name) => (valid(name) ?? `eng`) == `eng` ? CLASSES : CLASSES.toReversed(),
  /** Returns URI query string with leading '?' removed. */
  query = () => window.location.search.replace(/^[?]/, ``);

/** Disable all stylesheet links with title property except one(s) 
 * matching title.
 * @param {string} title - matches enabled stylesheet link title property
 */
function sheet(title) {
  // https://alistapart.com/article/alternate/ was the initial impetus.
  for (const link of document.querySelectorAll(`link`)) {
    if (link.rel?.startsWith(`style`) && link.title) {
      link.disabled = true;
      if (link.title == title) {
        console.log(`CSS: ${title}.css`);
        console.log(link);
        link.disabled = false;
      }
    }
  }
}

/** Collect all parent elements matching selector with an id and collect 
 * all elements with elements matching class names in names (removing 
 * them from the main flow) and append them to parent in groups in 
 * names order.
 * TODO: addRule currently does nothing
 * @param {string[]} names - class names to match elements in this order
 * @param {string} selector - parent element selector
 * @param {boolean=} addRule - if true, add rule element between groups
 */
function arrange(names, selector, addRule=false) {
  for (const parent of document.querySelectorAll(`${selector}`)) {
    const id = parent.id;
    if (id) {
      const elements = new Object();
      for (const cls of names) {
        elements[cls] = new Array();
        for (const element of document.querySelectorAll(`#${id} > .${cls}`)) {
          // console.log(element);
          elements[cls].push(parent.removeChild(element));
        }
      }
      //console.log(elements);
      // TODO: these constants are to help with adding elements between sections
/*
      // All entries of elements have > 0 items and elements length equals CLASSES.length.
      const hasSections = Object.keys(elements).length == CLASSES.length 
        && Object.entries(elements)
          .reduce((b, [k, v]) => b && v.length > 0, true);
      // Initial <hr> border half size of border-bottom styles.
      let style = `border: 1px solid #639;`;
*/
      for (const cls of names) {
        for (const element of elements[cls]) {
          parent.appendChild(element);
        }
        // TODO: adding <hr> in this manner does not work
/*
        // Add rule at the end of multiple sections.
        if (addRule && hasSections) {
          const rule = document.createElement(`hr`);
          rule.style = style;
          parent.appendChild(rule);
          style = `display: none;`;
        }
*/
      }
    }
  }
}

/**
 * @typedef {Object} Rect
 * @property {number} width - width of rectangle
 * @property {number} height - height of rectangle
 */

/** Returns rectangle object w/ width and height of text rendered in font.
 * @param {string} text - characters to render in font
 * @param {string} font - font to render text in
 * @return {Rect} rectangle object
 */
function getTextSize(text, font) {
  // https://stackoverflow.com/questions/31305071/measuring-text-width-height-without-rendering
  const element = document.createElement('canvas');
  const context = element.getContext('2d');  
  context.font = font;
  const tsize = {
      'width': context.measureText(text).width,
      'height': parseInt(context.font)
  };
  return tsize;
}

/** Set <body> selector min-width to accumulated width of selector 
 * '.icons' - which consists of <a> and <img> tags. The <a> text width
 * is calculated w/ getTextSize of font and size. The <img> width is
 * accessed directly. The 'body' selector min-width is set to the sum of
 * accumulated widths, multiplied by adjusted DPI and a fudge factor.
 * @param {string} font - font-family to use in text-width calculation
 * @param {number} size - font-size to use in text-width calculation
 *
 * TODO: apparently, DPI and fudge-factor adjustments are not necessary.
 */
function setIconsWidth(font, size) {
  const fudge = 1.0, icons = document.querySelector(`.icons`);
  let width = 0;
  for (const child of icons.querySelectorAll(`a`)) {
    width += icons.querySelector(`img`).width ?? 0;
    // Remove tags from HTML and parse character entities in text.
    const text = (new DOMParser().parseFromString(
      child.innerHTML.replace(/<.*>/g, ``), "text/html"))
        .documentElement.textContent;
    const rect = getTextSize(` ${text}`,`${size}px "${font}"`);
    console.log(`' ${text}' is ${rect.width}px wide`);
    width += rect.width;
  }
  console.log(`    width= ${width}`);
  /* Adjust node width & height by 3/4 - actual DPI v. canvas DPI */
  //width *= 72 / 96;
  const style = `min-width: ${Math.round(width * fudge)}px;`;
  console.log(`${style}`);
  document.querySelector(`body`).style = style;
}

/** Format document with elements arranged according to classes(name).
 * Use arrange function to arrange <p> (always) and <article> (only when 
 * a valid URI query exists) in CLASSES or CLASSES.toReversed() order, 
 * depending on name. 
 * @param {string} name - name position in CLASSES determines order or reverse 
 */
function format(name) {
  arrange(classes(name), `p`);
  if (valid(query())) {
    arrange(classes(name), `article`, true);
  }
}

/** EventListener for 'click' event. Format document and set stylesheet
 * with opposite(name) when clicked, where name is class name of e.
 * @param {Event} e - event generating callback
 */
function click(e) {
  //console.log(e.currentTarget);
  const name = e?.currentTarget?.className;
  if (name) {
    format(opposite(name));
    sheet(stylesheet(opposite(name)));
  }
}

/** Initialize document by formatting document and setting stylesheet
 * with URI query(), setting <body> minimum width based on '.icons' 
 * total width, and click EvenListener to '#navigation h2' selectors.
 * @returns false
 */ 
function initialize() {
  console.log(`Initialize...`);
  format(query());
  sheet(stylesheet(query()));
  // TODO: assumes default font-size is 16
  setIconsWidth(`Lato`, 16 / 1.2);
  for (const h2 of document.querySelectorAll(`#navigation h2`)) {
    h2.addEventListener(`click`, click, false);
  }
  return false;
}

// http://onwebdevelopment.blogspot.com/2008/07/chaining-functions-in-javascript.html
const chain = function(args) {
  return function() {
    for(var i = 0; i < args.length; i++) {
      args[i]();
    }
  }
};
window.addLoad = function(fn) {
  window.onload = typeof(window.onload) != 'function' 
    ? fn : window.onload.chain([fn]);
};

window.addLoad(initialize);
