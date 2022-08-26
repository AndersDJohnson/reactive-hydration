exports.logRender = (msg, type) =>
  console.log(
    `*** ${msg} type = `,
    type?.displayName ?? type?.name ?? type?.$$typeof ?? type
  );
