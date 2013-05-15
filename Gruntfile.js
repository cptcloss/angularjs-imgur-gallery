module.exports = function(grunt) {

  grunt.initConfig({
    bowerConfig: grunt.file.readJSON('.bowerrc'),
    uglify: {
      options: {
        mangle: false
      },
      prod:{  
        files: {
          // Bundle order can be acheived with globbing patterns.
          // See: https://github.com/gruntjs/grunt/wiki/Configuring-tasks#globbing-patterns
          'build/production/js/app.js':['build/_compile/js/jquery.min.js',
                                        'build/_compile/js/angular.js',
                                        'build/_compile/js/angular-resource.js',
                                        'build/_compile/js/*.js',],
        }
      }
    },
    less: {
      dev:{
        options: {
          paths: ["build/_compile/less"],
          yuicompress: true,
        },
        files: {
          'build/development/css/app.css': 'build/_compile/less/app.less'
        }
      },
      prod:{
        options: {
          paths: ["build/_compile/less"],
          yuicompress: true,
        },
        files: {
          'build/production/css/app.css': 'build/_compile/less/app.less'
        }
      }
    },
    clean: {
      dev: {
        src: [
          ['build/_compile','build/development/**']
        ]
      },
      prod: {
        src: [
          ['build/_compile','build/production/**']
        ]
      },
      compile: {
        src: [
          ['build/_compile']
        ]
      }
    },
    copy: {
      less: {
        files: [
          /* LESS
           * CSS files need to end in .less for @import compilation. */
          
          /* @ /plugins */
          {expand: true, cwd: '<%= bowerConfig.directory %>/bootstrap/less/', src: ['*'], dest: 'build/_compile/less', filter: 'isFile'}, // includes files ONLY in cwd
          
          /* @ /app    */
          {expand: true, flatten: true, src: ['app/assets/less/**'], dest: 'build/_compile/less', filter: 'isFile'}, //includes files recursively than flattens into same level directory
        ]
      },
      js: {
        files: [
          /* Javascript */
          
          /* @ /plugins */
          {expand: true, cwd: '<%= bowerConfig.directory %>/angular-bootstrap/', src: ['ui-bootstrap.min.js'], dest: 'build/_compile/js'},
          {expand: true, cwd: '<%= bowerConfig.directory %>/angular-resource.min/', src: ['index.js'], dest: 'build/_compile/js/', rename: function(dest, src) {return dest + src.substring(0, src.indexOf('/')) + 'angular-resource.js';}},
          {expand: true, cwd: '<%= bowerConfig.directory %>/angular.min/', src: ['index.js'], dest: 'build/_compile/js/', rename: function(dest, src) {return dest + src.substring(0, src.indexOf('/')) + 'angular.js';}},
          {expand: true, cwd: '<%= bowerConfig.directory %>/jquery/', src: ['jquery.min.js'], dest: 'build/_compile/js'},
          {expand: true, cwd: '<%= bowerConfig.directory %>/jquery-masonry/', src: ['jquery.masonry.min.js'], dest: 'build/_compile/js'},
          {expand: true, cwd: '<%= bowerConfig.directory %>/ng-infinite-scroll.min/', src: ['index.js'], dest: 'build/_compile/js/', rename: function(dest, src) {return dest + src.substring(0, src.indexOf('/')) + 'nginfinitescroll.js';}},
          
          /* @ /app    */
          {expand: true, flatten: true, src: ['app/assets/js/**'], dest: 'build/_compile/js', filter: 'isFile'},
          {expand: true, flatten: true, src: ['app/config/**'], dest: 'build/_compile/js', filter: 'isFile'},
          {expand: true, flatten: true, src: ['app/controllers/**'], dest: 'build/_compile/js', filter: 'isFile'},
          {expand: true, flatten: true, src: ['app/directives/**'], dest: 'build/_compile/js', filter: 'isFile'},
          {expand: true, flatten: true, src: ['app/filters/**'], dest: 'build/_compile/js', filter: 'isFile'},
          {expand: true, flatten: true, src: ['app/services/**'], dest: 'build/_compile/js', filter: 'isFile'},
        ]
      },
      img: {
        files: [
          /* Images */
          
          /* @ /plugins */
          {expand: true, cwd: '<%= bowerConfig.directory %>/bootstrap/img/', src:['*'], dest: 'build/_compile/img'},
          
          /* @ /app    */
          {expand: true, flatten: true, src: ['app/assets/img/*'], dest: 'build/_compile/img', filter: 'isFile'},
        ]      
      },
      dev: {
        files: [
          /* Move templates to development build folder */
          /* Move to indevidual .js to development build folder */
          {expand: true, cwd: 'app', src: ['index.html'], dest: 'build/development'},
          {expand: true, cwd: 'app', src: ['views/*'], dest: 'build/development'},
          {expand: true, cwd: 'app', src: ['data/*'], dest: 'build/development'},
          {expand: true, cwd: 'build/_compile/img', src: ['*'], dest: 'build/development/img'},
          {expand: true, cwd: 'build/_compile/js', src: ['*.js'], dest: 'build/development/js'},
        ]
      },
      prod: {
        files: [
          /* Move templates to production build folder */
          /* Move single concatted compressed app.js to production build folder */
          {expand: true, cwd: 'app', src: ['index.html'], dest: 'build/production'},
          {expand: true, cwd: 'app', src: ['views/*'], dest: 'build/production'},
          {expand: true, cwd: 'app', src: ['data/*'], dest: 'build/production'},
          {expand: true, cwd: 'build/_compile/img', src: ['*'], dest: 'build/production/img'},
          // Being compiled by Uglify and pushed to "build/production/js"
          //{expand: true, cwd: 'build/_compile/js', src: ['app.js'], dest: 'build/production/js'},
        ]
      },
    },
    htmlbuild: {
        dev: {
            src: 'app/index.html',
            dest: 'build/development',
            options: {
                styles: {
                    bundle: [ 
                        'build/development/css/app.css',
                    ]
                },
                scripts: {
                    bundle: [
                        // Bundle order can be acheived with globbing patterns.
                        // See: https://github.com/gruntjs/grunt/wiki/Configuring-tasks#globbing-patterns
                        'build/development/js/jquery.min.js',
                        'build/development/js/angular.js',
                        'build/development/js/angular-resource.js',
                        'build/development/js/*.js',            
                    ]
                },
            }
        },
        prod: {
            src: 'app/index.html',
            dest: 'build/production',
            options: {
                styles: {
                    bundle: [ 
                        'build/production/css/app.css',
                    ]
                },
                scripts: {
                    bundle: [
                        'build/production/js/app.js',            
                    ]
                },
            }
        },
    },
    watch: {
      dev: {
        files: ['app/**'],
        tasks: ['clean:dev',
                'copy:img',
                'copy:less',
                'less:dev',
                'copy:js',
                'copy:dev',
                'htmlbuild:dev',
                'clean:compile']
      },
    },
  });
  
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-html-build');
  grunt.loadNpmTasks('grunt-contrib-watch');
  

  // Development Packaging
  grunt.registerTask('package:dev',['clean:dev',
                                    'copy:img',
                                    'copy:less',
                                    'less:dev',
                                    'copy:js',
                                    'copy:dev',
                                    'htmlbuild:dev',
                                    ]);

  // There is no production "watch" ;)
  grunt.registerTask('package:dev:watch',['watch:dev']);  
  
  // Production Packaging
  grunt.registerTask('package:prod',['clean:prod',
                                     'copy:img',
                                     'copy:less',
                                     'less:prod',
                                     'copy:js',
                                     'uglify:prod',
                                     'copy:prod',
                                     'htmlbuild:prod',
                                     'clean:compile']); 
};