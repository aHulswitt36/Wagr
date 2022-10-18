import nodePolyfills from 'rollup-plugin-node-polyfills';

export default {
    plugins: [
        ['@snowpack/plugin-optimize', {
            minifyJS: false
        }]
    ],

    packageOptions: {
        polyfillNode: true,
        rollup: {
            plugins: [nodePolyfills({ crypto: true })]
        }
    },

    exclude: ['**/*.cs', '**/*.razor', '**/*.razor.css'],

    buildOptions: {
        out: 'wwwroot/js/',
        clean: true
    },

    mount: {
        'Pages': '/Pages',
        'Shared': '/Shared',
        'Scripts': '/Scripts'
    }
};