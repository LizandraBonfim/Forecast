import * as path from 'path';
import moduleAlias from 'module-alias';

console.log('__dirname', __dirname)
const files = path.resolve(__dirname, '../..');


moduleAlias.addAliases({
    '@src': path.join(files, 'src'),
    '@test': path.join(files, 'test')
})