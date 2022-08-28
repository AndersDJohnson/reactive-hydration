const React = require("_react");

console.log("*** reactive-hydration-react index _react id", React.id);

const { useContext } = React;

React.useContext = (init) => {
  console.log(
    "*** reactive-hydration-react/index useContext _react id",
    React.id
  );

  return useContext(init);
};

module.exports = React;
