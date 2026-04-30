export default {
  extends: ["@commitlint/config-conventional"],
  ignores: [
    (message) => /^Merge/.test(message),
    (message) => /\(#\d+\)$/.test(message),
  ],
  rules: {
    "header-max-length": [0, "always", 100],
    "body-max-line-length": [0, "always", 100],
    "footer-max-line-length": [0, "always", 100],
  },
};
