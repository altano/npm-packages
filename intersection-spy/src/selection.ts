import Section from './Section';

interface Options {
  isAnythingSelectedYet: () => boolean;
  isAnything100PctVisible: () => boolean;
  getAlreadySelectedSectionIfNoLessVisible: () => Section | null;
  getSectionsWithLargestVisibleTargetRect: () => Section;
  getSectionToMostRecentlyBecome100PctVisible: () => Section;
}

export function getSectionGivenCurrentState({
  isAnythingSelectedYet,
  isAnything100PctVisible,
  getAlreadySelectedSectionIfNoLessVisible,
  getSectionsWithLargestVisibleTargetRect,
  getSectionToMostRecentlyBecome100PctVisible,
}: Options): Section {
  if (!isAnythingSelectedYet()) {
    return getSectionsWithLargestVisibleTargetRect();
  }

  const selectedSection = getAlreadySelectedSectionIfNoLessVisible();
  if (isAnything100PctVisible()) {
    // If the most recently 100% visible thing became 100% visible before we
    // last observed the currently selected section, then stick with the current
    // section
    const newlyVisibleSection = getSectionToMostRecentlyBecome100PctVisible();
    return selectedSection == null ||
      newlyVisibleSection.lastIntersectionObservationTime >
        selectedSection.lastIntersectionObservationTime
      ? newlyVisibleSection
      : selectedSection;
  } else {
    return getSectionsWithLargestVisibleTargetRect();
  }
}
