import Section from './Section';

interface Options {
  isAnythingSelectedYet: () => boolean;
  isAnything100PctVisible: () => boolean;
  getSectionsWithLargestVisibleTargetRect: () => Section;
  getSectionToMostRecentlyBecome100PctVisible: () => Section;
}

export function getSectionGivenCurrentState({
  isAnythingSelectedYet,
  isAnything100PctVisible,
  getSectionsWithLargestVisibleTargetRect,
  getSectionToMostRecentlyBecome100PctVisible,
}: Options): Section {
  if (!isAnythingSelectedYet()) {
    return getSectionsWithLargestVisibleTargetRect();
  } else if (isAnything100PctVisible()) {
    return getSectionToMostRecentlyBecome100PctVisible();
  } else {
    return getSectionsWithLargestVisibleTargetRect();
  }
}
