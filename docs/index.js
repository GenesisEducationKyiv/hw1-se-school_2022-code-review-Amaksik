const basicInfo = require('./basicInfo');
const components = require('./components');
const tags = require('./tags');
const paths = require('./paths');

module.exports = {
    ...basicInfo,
    ...components,
    ...tags,
    ...paths
};