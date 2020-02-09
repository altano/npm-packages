'use strict';

function getSectionGivenCurrentState(sections, { isAnythingSelectedYet, isAnything100PctVisible, getSectionsWithLargestVisibleTargetRect, getSectionToMostRecentlyBecome100PctVisible, }) {
    if (!isAnythingSelectedYet()) {
        return getSectionsWithLargestVisibleTargetRect();
    }
    else if (isAnything100PctVisible()) {
        return getSectionToMostRecentlyBecome100PctVisible();
    }
    else {
        return getSectionsWithLargestVisibleTargetRect();
    }
}

const getAnchorsFromHash = (hash) => Array.from(document.querySelectorAll(`a[href="${hash}"]`));
class Observer {
    constructor({ rootMargin, getTarget, navigationLinksSelector, }) {
        this.sections = [];
        this.listenerRemovalFunctions = [];
        // @TODO replace this with something that snapshots the scroll position and
        // doesn't get reset until the scroll position changes?
        //
        // Use this mechanism to not activate the scroll spy until the scroll position
        // has changed at all (don't highlight anything on page load unless the hash
        // matches!)
        this.ignoreNextIntersectionObserverCallback = false;
        this.rootMargin = rootMargin;
        this.observer = new IntersectionObserver(this.onIntersectionChange.bind(this), {
            rootMargin: this.rootMargin,
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        });
        this.setupSections(getTarget, navigationLinksSelector);
        this.observeHashChange();
        this.observeSectionIntersection();
        if (globalThis.location.hash) {
            this.onHashChange();
        }
    }
    destroy() {
        this.listenerRemovalFunctions.forEach(fn => fn());
        this.listenerRemovalFunctions.length = 0;
        this.removeAllSelections();
        this.sections.length = 0;
    }
    setupSections(getTarget, navigationLinksSelector) {
        const navLinks = Array.from(document.querySelectorAll(navigationLinksSelector));
        navLinks.forEach(navLink => {
            if (!navLink) {
                console.warn(`Heading did not have a sibling element.`);
                return;
            }
            const hash = navLink.hash;
            const heading = document.querySelector(hash);
            if (!heading) {
                console.warn(`Anchor hash '${hash}' doesn't reference a valid DOM node, cannot continue`);
                return;
            }
            const target = getTarget(heading);
            if (!target) {
                console.warn(`Heading did not have a sibling element.`);
                return;
            }
            this.sections.push({
                hash,
                heading,
                intersectionRatio: 0,
                intersectionRectArea: 0,
                isSelected: false,
                lastIntersectionObservationTime: 0,
                navLink,
                target,
            });
        });
    }
    // tslint:disable-next-line:no-any
    filterElements(arr) {
        return arr.filter(v => v instanceof Element);
    }
    removeAllSelections() {
        this.sections
            .filter(section => section.isSelected)
            .forEach(section => {
            this.filterElements(Object.values(section)).forEach(element => element.classList.remove('active'));
            section.isSelected = false;
        });
    }
    observeHashChange() {
        // console.log('Observing hashchange');
        globalThis.addEventListener('hashchange', this.onHashChange.bind(this));
        this.listenerRemovalFunctions.push(() => {
            globalThis.removeEventListener('hashchange', this.onHashChange.bind(this));
        });
    }
    selectSection(section) {
        this.filterElements(Object.values(section)).forEach(element => element.classList.add('active'));
        section.isSelected = true;
    }
    onHashChange() {
        // console.log('hashchange', globalThis.location.hash);
        this.ignoreNextIntersectionObserverCallback = true;
        this.removeAllSelections();
        const anchors = getAnchorsFromHash(globalThis.location.hash);
        anchors.forEach(anchor => {
            const sectionsToSelect = this.sections.filter(section => section.navLink === anchor);
            sectionsToSelect.forEach(this.selectSection.bind(this));
        });
    }
    observeSectionIntersection() {
        // console.log('Observing Sections');
        this.sections.forEach(({ target }) => this.observer.observe(target));
        this.listenerRemovalFunctions.push(() => {
            this.sections.forEach(({ target }) => this.observer.disconnect());
        });
    }
    onIntersectionChange(entries) {
        entries.forEach(entry => {
            this.sections
                .filter(s => s.target === entry.target)
                .forEach(s => {
                s.lastIntersectionObservationTime = entry.time;
                s.intersectionRatio = entry.intersectionRatio;
                s.intersectionRectArea = this.getVisibleRectArea(entry);
            });
        });
        if (this.ignoreNextIntersectionObserverCallback) {
            this.ignoreNextIntersectionObserverCallback = false;
            // console.log('ignoring intersection observer callback once');
        }
        else {
            if (window.loggging === true) {
                console.table(entries);
            }
            const newlySelectedSection = this.getSectionToSelect();
            if (newlySelectedSection != null) {
                this.removeAllSelections();
                this.selectSection(newlySelectedSection);
            }
        }
    }
    getVisibleRectArea(entry) {
        const { top, left, right, bottom } = entry.intersectionRect;
        return (right - left) * (bottom - top);
    }
    getSectionToSelect() {
        const sectionToSelect = getSectionGivenCurrentState(this.sections, {
            getSectionToMostRecentlyBecome100PctVisible: () => this.sections
                .filter(s => s.intersectionRatio === 1)
                .reduce((toReturn, next) => {
                return next.lastIntersectionObservationTime >
                    toReturn.lastIntersectionObservationTime
                    ? next
                    : toReturn;
            }),
            getSectionsWithLargestVisibleTargetRect: () => this.sections.reduce((mostVisible, next) => {
                return next.intersectionRectArea > mostVisible.intersectionRectArea
                    ? next
                    : mostVisible;
            }),
            isAnything100PctVisible: () => this.sections.some(s => s.intersectionRatio === 1),
            isAnythingSelectedYet: () => this.sections.some(s => s.isSelected),
        });
        return sectionToSelect.isSelected ? null : sectionToSelect;
    }
}

module.exports = Observer;
