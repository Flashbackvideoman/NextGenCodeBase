/* TabHighlight.ts */

export const hilightTab = (tabnum: number) => {
  const allTabs = document.getElementsByClassName("tabs");
  // Remove highlighting from all tabs
  Object.keys(allTabs).forEach(function (key) {
    allTabs[key as any].classList.remove("activeTab");
  });
  
  const ele = allTabs[tabnum];
  if (ele) {
    ele.classList.add("activeTab");
  }  
}

