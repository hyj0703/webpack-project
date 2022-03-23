const path = require('path')
module.exports = (name) => {
  return [
    {
      copy: [
        {
          source: path.resolve(__dirname, `../../${name}`),
          destination: path.resolve(__dirname, `../../tmp_for_zip/${name}`),
        },
      ],
    },
    {
      archive: [
        {
          source: path.resolve(__dirname, '../../tmp_for_zip'),
          destination: path.resolve(__dirname, `../../${name}.zip`),
        },
      ],
    },
    {
      delete: [path.resolve(__dirname, '../../tmp_for_zip')],
    },
  ]
}
