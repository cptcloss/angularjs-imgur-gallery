module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    assetpush: {
        options:{
          overwrite: true
        },
        dev: {
          files: {
            "<%= pkg.templatesRoot %>/global.head.html": ["<%= pkg.staticRoot %>/js/**/*.js","<%= pkg.staticRoot %>/css/**/*.css"]
          }
        },
        prod: {
          files: {
            "<%= pkg.templatesRoot %>/global.head.html": ["<%= pkg.staticRoot %>/js/app.js","<%= pkg.staticRoot %>/css/app.css"]
          }
        }
    },
    concat: {
      options: {
        separator: ''
      },
      prod:{
        files:{
          '<%= pkg.staticRoot %>/js/app.js': '<%= pkg.staticRoot %>/js/**/*.js',
          '<%= pkg.staticRoot %>/css/app.css': '<%= pkg.staticRoot %>/css/**/*.css'
        }
      }
    },
    uglify: {
      prod:{  
        files: {
          '<%= pkg.staticRoot %>/js/app.js': '<%= pkg.staticRoot %>/js/app.js'
        }
      }
    },
    less: {
      dev:{  
        files: [{
            expand: true,
            cwd: '<%= pkg.staticRoot %>/less',
            src: ['**/*.less'],
            dest: '<%= pkg.staticRoot %>/css/less',
            ext: '.css'
        }]
      },
      prod:{  
        files: {
          '<%= pkg.staticRoot %>/css/app.css': '<%= pkg.staticRoot %>/less/**/*.less'
        }
      }
    },
    clean: {
      dev: {
        src: ['<%= pkg.app %>/<%= pkg.css %>/less/**/*.css','<%= pkg.app %>/<%= pkg.js %>/app.js','<%= pkg.app %>/<%= pkg.js %>/head.js']
      }
    },
    cssmin: {
      prod:{
        files: {
          '<%= pkg.staticRoot %>/css/app.css': '<%= pkg.staticRoot %>/css/app.css'
        }
      }
    },
    imageEmbed: {
      prod: {
        src: ['<%= pkg.staticRoot %>/css/app.css'],
        dest: '<%= pkg.staticRoot %>/css/app.css',
        options: {
          deleteAfterEncoding : false,
          maxImageSize: 32768,
          baseDir: ''
        }
      }
    }
  });
  
  grunt.loadNpmTasks("grunt-assetpush");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-image-embed');
  
  // Development Packaging
  grunt.registerTask('package:dev',['clean:dev','less:dev','assetpush:dev']);

  // Production Packaging
  grunt.registerTask('package:prod',['clean:prod','less:prod','concat:prod','uglify:prod','imageEmbed:prod','cssmin:prod','assetpush:prod']);
  
};