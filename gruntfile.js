module.exports = function (grunt) {
    grunt.initConfig({
        pkgFile: 'package.json',
        clean: ['build'],
        babel: {
            dist: {
                files: [{
                    expand: true,
                    cwd: './lib',
                    src: ['**/*.js', '!browser/*.js'],
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
                files: ['lib/*.js', 'lib/helpers/*.js'],
                tasks: ['babel'],
                options: { spawn: false }
            },
            browserscripts: {
                files: ['lib/browser/*.js'],
                tasks: ['copy:browserscripts'],
                options: { spawn: false }
            }
        },
        copy: {
            browserscripts: {
                files: [{
                    expand: true,
                    cwd: 'lib',
                    src: 'browser/*.js',
                    dest: 'build'
                }]
            }
        }
    })

    require('load-grunt-tasks')(grunt)
    grunt.registerTask('default', ['build'])
    grunt.registerTask('build', 'Build webdriverrtc', function () {
        grunt.task.run([
            'eslint',
            'clean',
            'babel',
            'copy'
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
