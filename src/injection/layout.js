async function layout(language) {
  let obj = {};

  try {
    obj.layout = language;

    return obj;
  } catch (error) {
    console.error(error);
    return obj;
  }
}

module.exports = layout;
