export const styles = /* css */ `
  :host astro-dev-toolbar-window {
    max-height: calc(100vh - 80px);
    overflow-y: auto;
  }

  button {
    background: none;
    color: inherit;
    border: none;
    font: inherit;
    cursor: pointer;
    outline: inherit;
  }

  details {
    margin-block-end: 10px;
  }
  details:last-of-type {
    margin-block-end: 0;
  }

  details[open] summary, .image {
    margin-block-end: 7px;
  }

  .image img {
    transition: max-width 0.1s;
  }
`;
