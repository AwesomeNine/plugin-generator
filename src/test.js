import chalk from "chalk"

function heading(title) {
    console.log( chalk.bold.green( 'Ⓞ ' + title ) )
}

heading( 'Installing Webpack' )
heading( 'Installing Tailwind CSS' )
heading( 'Installing Postcss' )
heading( 'Installing Autoprefixer' )
