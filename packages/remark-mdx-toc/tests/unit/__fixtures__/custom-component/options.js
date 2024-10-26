export default {
  name: "toc",
  customTags: [
    {
      name: /^H[1-6]$/,
      depth: (name) => parseInt(name.substring(1)),
    },
  ],
};
