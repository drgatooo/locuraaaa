const colors = require('colors/safe');
const ms = require('./ms');

ms(2, {})

module.exports = {
  // COMO TE AMO CHATGPT CTM AAAAAA
  applyColors(text) {
    // Expresión regular para buscar el patrón {color} y {/color}
    return text.replace(
      /\{(yellow|red|blue|white|green|magenta|gray|random|eval)\}(.*?)\{\/\1\}/g,
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
          case 'magenta':
            return colors.magenta(innerText);
          case 'gray':
            return colors.gray(innerText);
          case 'random':{
            const colorKeys = ['red', 'blue', 'yellow', 'magenta', 'rainbow']
            return colors[colorKeys[~~(Math.random()*colorKeys.length)]](innerText)
          }
          case 'eval': {
            const evaled = eval(innerText)
            return `${evaled}`
          }
          default:
            return innerText; // Si no coincide, devuelve el texto sin cambios
        }
      }
    );
  }
};
