/** @type {import('relay-compiler/lib/bin/RelayCompilerMain').Config}*/
module.exports = {
    src: './src',
    schema: './src/schema.gql',
    language: 'typescript',
    artifactDirectory: './src/__relay__',
}
