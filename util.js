const colors = require('colors/safe');

module.exports = {
  // COMO TE AMO CHATGPT CTM AAAAAA
  applyColors(text) {
    // Expresión regular para buscar el patrón {color} y {/color}
    return text.replace(
      /\{(yellow|red|blue|white|green)\}(.*?)\{\/\1\}/g,
      (match, color, innerText) => {
        // Mapea el color a la función correspondiente en `colors`
        switch (color) {
          case 'yellow':
            return colors.yellow(innerText);
          case 'red':
            return colors.red(innerText);
          case 'blue':
            return colors.blue(innerText);
          case 'white':
            return colors.white(innerText);
          case 'green':
            return colors.green(innerText);
          default:
            return innerText; // Si no coincide, devuelve el texto sin cambios
        }
      }
    );
  }
};
