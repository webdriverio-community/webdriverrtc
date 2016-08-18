module.exports = function (grunt) {
    grunt.initConfig({
        pkgFile: 'package.json',
        clean: ['build'],
        babel: {
            dist: {
                files: [{
                    expand: true,
                    cwd: './lib',
                    src: ['**/*.js'],
                    dest: 'build',
                    ext: '.js'
                }]
            }
        },
        mochaTest: {
            unit: {
                src: ['./test/bootstrap.js', './test/spec/**/*'],
                options: {
                    reporter: 'spec',
                    require: ['babel-register'],
                    timeout: 120000
                }
            }
        },
        eslint: {
            options: {
                parser: 'babel-eslint'
            },
            target: ['index.js', 'lib/**/*.js', 'examples/**/*.js', 'test/**/*.js']
        },
        contributors: {
            options: {
                commitMessage: 'update contributors'
            }
        },
        bump: {
            options: {
                commitMessage: 'v%VERSION%',
                pushTo: 'upstream'
            }
        },
        watch: {
            commands: {
                files: ['index.js', 'lib/**/*.js'],
                tasks: ['babel:commands'],
                options: {
                    spawn: false
                }
            }
        }
    })

    require('load-grunt-tasks')(grunt)
    grunt.registerTask('default', ['build'])
    grunt.registerTask('build', 'Build webdriverrtc', function () {
        grunt.task.run([
            'eslint',
            'clean',
            'babel'
        ])
    })
    grunt.registerTask('release', 'Bump and tag version', function (type) {
        grunt.task.run([
            'build',
            'contributors',
            'bump:' + (type || 'patch')
        ])
    })
}
