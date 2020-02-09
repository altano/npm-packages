'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var Observer = _interopDefault(require('intersection-spy'));

function useIntersectionSpy(options) {
    React.useEffect(() => {
        const observer = new Observer(options);
        return () => {
            observer.destroy();
        };
    });
}

module.exports = useIntersectionSpy;
