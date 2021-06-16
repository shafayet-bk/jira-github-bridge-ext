console.log("Processor script loaded.");

const INITIAL_DELAY = 1000;
const SECONDARY_DELAY = 2000;
const MAX_ATTEMPTS = 3;
const QUERY_STRING =
  "a.Link--primary.text-bold.js-navigation-open.markdown-title";

const extractStoryId = (el) => {
  let text = el.innerHTML;
  let index = text.indexOf("ID-");
  if (index == -1) return false;
  let index2 = text.indexOf(":", index);
  if (index2 == -1) return false;
  return text.slice(index, index2);
};

const makeJiraLinkUrl = (storyId) => {
  return `https://bkash-tech.atlassian.net/browse/${storyId}`;
};

const makeAnchor = (storyId) => {
  let href = makeJiraLinkUrl(storyId);

  let newEl = document.createElement("a");
  newEl.innerHTML = "Open Jira Story";
  newEl.href = href;
  newEl.target = "_blank";

  return newEl;
};

let attemptCount = 0;
const createJiraLinks = () => {
  attemptCount += 1;

  let elList = document.querySelectorAll(QUERY_STRING);

  // retry if initial attempt failed.
  if (elList.length == 0) {
    console.log("Attempt failed");

    if (attemptCount >= MAX_ATTEMPTS) {
      console.log("All attempts failed. Stopping.");
      return;
    }

    setTimeout(() => {
      createJiraLinks();
    }, SECONDARY_DELAY);
    return;
  }

  for (let el of elList) {
    let storyId = extractStoryId(el);
    if (!storyId) continue;

    let anchor = makeAnchor(storyId);
    el.parentNode.appendChild(anchor);
  }
};

setTimeout(() => {
  createJiraLinks();
}, INITIAL_DELAY);
