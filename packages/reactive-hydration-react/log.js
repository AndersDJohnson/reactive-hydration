exports.logRender = (msg, type) => {
  // typeof type === "string" && type === type.toLowerCase()
  //   ? undefined
  //   : console.log(
  //       `*** logRender ${msg} type = `,
  //       type?.displayName ??
  //         type?.name ??
  //         (type._context?.displayName
  //           ? [type.$$typeof, `${type._context?.displayName}`]
  //           : undefined) ??
  //         type?.$$typeof ??
  //         type,
  //       type._context ? type : undefined
  //     );
};
