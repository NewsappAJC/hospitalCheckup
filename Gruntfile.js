module.exports = function(grunt) {
  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    aws: grunt.file.readJSON('config/aws.json'),
    copy: {
      target: {
        files: [
          {
            expand: true,
            src: ['bower/jquery/dist/jquery.min.js'],
            dest: 'build/assets/js/vendor/',
            rename: function (dest, src) {
              return dest + src.substring(src.lastIndexOf('/')).replace('.min','');
            }
          },
          {
            expand: true,
            src: ['bower/underscore/underscore-min.js'],
            dest: 'build/assets/js/vendor/',
            rename: function (dest, src) {
              return dest + src.substring(src.lastIndexOf('/')).replace('-min','');
            }
          },
          {
            expand: true,
            src: ['bower/backbone/backbone-min.js'],
            dest: 'build/assets/js/vendor/',
            rename: function (dest, src) {
              return dest + src.substring(src.lastIndexOf('/')).replace('-min','');
            }
          },
          {
            expand: true,
            src: ['bower/marionette/lib/backbone.marionette.min.js'],
            dest: 'build/assets/js/vendor/',
            rename: function (dest, src) {
              return dest + src.substring(src.lastIndexOf('/')).replace('.min','');
            }
          },
          {
            expand: true,
            src: ['bower/d3/d3.min.js'],
            dest: 'build/assets/js/vendor/',
            rename: function (dest, src) {
              return dest + src.substring(src.lastIndexOf('/')).replace('.min','');
            }
          },
          {
            expand: true,
            src: ['bower/foundation/js/foundation.min.js'],
            dest: 'build/assets/js/vendor/',
            rename: function (dest, src) {
              return dest + src.substring(src.lastIndexOf('/')).replace('.min','');
            }
          },
          {
            expand: true,
            flatten: true,
            src: [
              'src/assets/js/vendor/chroma.js',
              'src/assets/js/vendor/json2.js',
              'src/assets/js/vendor/flatpage_stubs.js',
              'src/assets/js/vendor/modernizr.js',
              'src/assets/js/vendor/fastclick.js',
              'src/assets/js/vendor/backbone.localstorage.js',
              'src/assets/js/vendor/jquery.spin.js',
              'src/assets/js/vendor/spin.js',
              'src/assets/js/vendor/backbone.select.js',
              'src/assets/js/vendor/foundation.topbar.js'
            ],
            dest: 'build/assets/js/vendor/'
          },
          { expand: true, flatten: true, src: ['src/assets/data/*'], dest: 'build/assets/data/' },
          { expand: true, flatten: true, src: ['src/assets/img/*'], dest: 'build/assets/img/' },
          { expand: true, flatten: true, src: ['src/assets/css/fonts/boomer/*'], dest: 'build/assets/css/fonts/boomer/' },
          { expand: true, flatten: true, src: ['src/assets/css/fonts/boomer_cond/*'], dest: 'build/assets/css/fonts/boomer_cond/' },
          { expand: true, flatten: true, src: ['src/assets/css/fonts/boomer_extracond/*'], dest: 'build/assets/css/fonts/boomer_extracond/' },
          { expand: true, flatten: true, src: ['src/assets/css/fonts/boomerslab/*'], dest: 'build/assets/css/fonts/boomerslab/' },
          { expand: true, flatten: true, src: ['src/assets/css/fonts/boomerslab_cond*'], dest: 'build/assets/css/fonts/boomerslab_cond' },
          { expand: true, flatten: true, src: ['src/assets/css/fonts/boomerslab_extracond/*'], dest: 'build/assets/css/fonts/boomerslab_extracond/' },
          { expand: true, flatten: true, src: ['src/assets/css/fonts/publico/*'], dest: 'build/assets/css/fonts/publico/' },
          { expand: true, flatten: true, src: ['src/robots.txt'], dest: 'build/' }
        ]
      }
    },

    jshint: {
      files: [
        'src/assets/js/*.js'
      ],
      options: {
        browser: true,
        curly: true,
        eqeqeq: true,
        latedef: true,
        undef: true,
        unused: true,
        trailing: true,
        smarttabs: true,
        indent: 2,
        globals: {
          jQuery: true,
          $: true,
          _: true
        }
      }
    },

    uglify: {
      options: {
        mangle: { except: ['d3', '_','$'] },
        compress: true,
        report: 'gzip'
      },
      my_target: {
        files: {
          'build/assets/js/app.js'    : ['src/assets/js/app.js'],
          'build/assets/js/apps/config/storage/localstorage.js': ['src/assets/js/apps/config/storage/localstorage.js'],
          'build/assets/js/entities/section.js': ['src/assets/js/entities/section.js'],
          'build/assets/js/apps/sections/section_views.js': ['src/assets/js/apps/sections/section_views.js'],
          'build/assets/js/apps/sections/section_controller.js': ['src/assets/js/apps/sections/section_controller.js'],
          'build/assets/js/apps/sections/hospital/hospital_controller.js': ['src/assets/js/apps/sections/hospital/hospital_controller.js'],
          'build/assets/js/apps/sections/hospital/hospital_views.js': ['src/assets/js/apps/sections/hospital/hospital_views.js'],
          'build/assets/js/apps/sections/section_app.js': ['src/assets/js/apps/sections/section_app.js'],
          'build/assets/js/apps/home/home_app.js': ['src/assets/js/apps/home/home_app.js'],
          'build/assets/js/apps/home/home_controller.js': ['src/assets/js/apps/home/home_controller.js'],
          'build/assets/js/apps/home/home_view.js': ['src/assets/js/apps/home/home_view.js'],
          'build/assets/js/common/views.js': ['src/assets/js/common/views.js'],
          'build/assets/js/entities/common.js': ['src/assets/js/entities/common.js'],
          'build/assets/js/entities/header.js': ['src/assets/js/entities/header.js'],
          'build/assets/js/apps/header/list/list_controller.js': ['src/assets/js/apps/header/list/list_controller.js'],
          'build/assets/js/apps/header/list/list_view.js': ['src/assets/js/apps/header/list/list_view.js'],
          'build/assets/js/apps/header/header_app.js': ['src/assets/js/apps/header/header_app.js'],
          'build/assets/js/apps/sections/chart/chart_base_view.js': ['src/assets/js/apps/sections/chart/chart_base_view.js'],
          'build/assets/js/apps/sections/chart/chart_views.js': ['src/assets/js/apps/sections/chart/chart_views.js'],
          'build/assets/js/common/behaviors.js': ['src/assets/js/common/behaviors.js'],
          'build/assets/js/entities/text.js': ['src/assets/js/entities/text.js']
        }
      }
    },

    processhtml: {
      options: {
        process: true,
        strip: true
      },
      build: {
        files: {
          'tmp/index.html': ['src/index.html']
        }
      }
    },

    sql: grunt.file.readJSON('config/sql.json'),
        sql_bakery: {
          db: {
            options: {
              host: '<%= sql.host %>',
              database: '<%= sql.db %>',
              user: '<%= sql.user %>',
              password: '<%= sql.pw %>',
              tables: '<%= sql.tables %>',
              output_path: 'src/assets/data/src'
            }
          }
        },

    htmlmin: {
      build: {
        options: {
          removeComments: true,
          collapsWhitespace: true,
          useShortDoctype: true
        },
        files: {
          'build/index.html'    : 'src/index.html' /*TODO change this back to tmp/ but right now processhtml is breaking my build*/
        }
      }
    },

    cssmin: {
      compress: {
        options: {
          report: 'gzip'
        },
        files: {
          'build/assets/css/app.css'       : ['src/assets/css/app.css'],
          'build/assets/css/fonts.css'     : ['src/assets/css/fonts.css'],
          'build/assets/css/vendor/normalize.css' : ['src/assets/css/vendor/normalize.css'],
          'build/assets/css/vendor/foundation.css': ['src/assets/css/vendor/foundation.css']
        }
      }
    },

    imagemin: {
      jpg: {
        options: { progressive: true },
        files: [{
          expand: true,
          cwd: "src/assets/img",
          src: ["*.jpg"],
          dest: "build/assets/img"
        }]
      },
      png: {
        options: { optimizationLevel: 3 },
        files: [{
          expand: true,
          cwd: "src/assets/img",
          src: ["*.png"],
          dest: "build/assets/img"
        }]
      },
      gif: {
        options: { interlaced: true },
        files: [{
          expand: true,
          cwd: "src/assets/img",
          src: ["*.gif"],
          dest: "build/assets/img"
        }]
      },
      svg: {
        options: {
          removeViewBox: false,
          removeEmptyAttrs: false
        },
        files: [{
          expand: true,
          cwd: "src/assets/img",
          src: ["*.svg"],
          dest: "build/assets/img"
        }]
      }
    },

    s3: {
      options: {
        accessKeyId: "<%= aws.key %>",
        secretAccessKey: "<%= aws.secret %>",
        bucket: "<%= aws.bucket %>",
        access: "public-read",
        gzip: true,
        cache: false
      },
      build: {
        cwd: "build/",
        src: "**",
        dest:"2015/staging/hospital-checkup/"
      }
    },

    bowercopy: {
      options: {
        // clean: true,
        runBower: true,
        report: true
      },
      test: {
        options: {
          destPrefix: 'test'
        },
        files: {
          "boot.js": "jasmine/lib/jasmine-core/boot.js",
          "console.js": "jasmine/lib/console/console.js",
          "jasmine-html.js": "jasmine/lib/jasmine-core/jasmine-html.js",
          "jasmine.css": "jasmine/lib/jasmine-core/jasmine.css",
          "jasmine.js": "jasmine/lib/jasmine-core/jasmine.js",
          "jasmine_favicon.png": "jasmine/images/jasmine_favicon.png",
          "sinon.js": "sinon/lib/sinon.js"
        }
      },
      lib_scripts: {
        options: {
          destPrefix: 'src/assets/js/vendor'
        },
        files: {
          "jquery.js": "jquery/dist/jquery.js",
          "chroma.js": "chroma-js/chroma.min.js", //colors
          "underscore.js": "underscore/underscore.js",
          "json2.js": "json2/json2.js",
          "backbone.js": "backbone/backbone.js",
          "backbone.marionette.js": "marionette/lib/backbone.marionette.js",
          "d3.js": "d3/d3.js",
          "modernizr.js": "foundation/js/vendor/modernizr.js",
          "fastclick.js": "foundation/js/vendor/fastclick.js",
          "foundation.js": "foundation/js/foundation.js",
          "foundation.topbar.js": "foundation/js/foundation/foundation.topbar.js",
          "backbone.localstorage.js": "backbone.localstorage/backbone.localstorage.js", //local storage adapter
          "spin.js": "spin.js/spin.js", //for page loading spinner
          "jquery.spin.js": "spin.js/jquery.spin.js", //for using ^ with jquery,
          "backbone.select.js": "backbone.select/dist/backbone.select.js" //for handling selecting/deselecting menu options,
        }
      },
      lib_styles: {
        options: {
          destPrefix: 'src/assets/css/vendor'
        },
        files: {
          "normalize.css": "normalize-css/normalize.css",
          "foundation.css": "foundation/css/foundation.min.css"
        }
      },
      fonts: {
        options: {
          destPrefix: "src/assets/css/"
        },
        files: {
          "fonts.css": "ajc-design/build/style/fonts.css",
          "fonts": "ajc-design/build/style/fonts"
        }
      }
    },

    express: {
      dev: {
        options: {
          hostname: '*',
          port: 8000,
          bases: 'src',
          livereload: true,
          showStack: true
        }
      },
      test: {
        options: {
          hostname: '*',
          port: 8080,
          bases: '.',
          livereload: true
        }
      }
    },

    open: {
      dev: {
        path: 'http://localhost:<%= express.dev.options.port %>',
        app: "Google Chrome"
      },
      test: {
        path: 'http://localhost:<%= express.test.options.port %>/SpecRunner.html'
      }
    },

    watch: {
      dev: {
        files: ['src/index.html','src/assets/js/*.js','src/assets/css/**/*.css'],
        options: {
          livereload: true
        }
      },
      test: {
        files: ['src/index.html','src/assets/js/*.js','spec/*.js'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-aws');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-sql-bakery');

  grunt.registerTask('default', ['bowercopy','copy','uglify','cssmin', 'htmlmin','s3']);/*TODO add back processhtml*/
  grunt.registerTask('build', ['bowercopy','copy','uglify','cssmin', 'htmlmin']);/*TODO add back processhtml*/
  grunt.registerTask('deploy', ['s3']);
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('server', ['express:dev','open:dev','watch:dev','express-keepalive']);
  grunt.registerTask('server:test', ['express:test','open:test','watch:test','express-keepalive']);
};
