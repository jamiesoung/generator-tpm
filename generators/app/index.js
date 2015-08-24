'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

var path = require('path');

module.exports = yeoman.generators.Base.extend({

  initializing: function(){

    this.on('end', function() {
      this.log('Please use "npm i" to install npms!');
    });
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'It is a generator for mobile. It depend on zepTo or jQuery.'
    ));

    var prompts = [
      {
        type: 'list',
        name: 'features',
        message: 'just for mobile.',
        choices : [{

          name: 'mobile',
          value: 'mobile'
        }
        ]
      }
      
    ];

    this.prompt(prompts, function (props) {

      function chooseFeature(choice) {

        return props.features.indexOf(choice) !== -1;
      }

      // this.isMobile = chooseFeature('mobile');
      
      // To access props later use this.props.someOption;
      done();
    }.bind(this));
  },

  writing: {

    app: function(){

      this.template('_package.json', 'package.json');
      this.template('gulpfile.js', 'gulpfile.js');
      this.template('_gitignore', '.gitignore');

      this.mkdir('src');
      this.mkdir('demo');
      this.mkdir('build');
      this.mkdir('src/c');
      this.mkdir('src/p');
      this.mkdir('src/p/index');
      this.mkdir('src/c/lib');
      this.mkdir('build');
      this.mkdir('build/img');

      this.copy('src/p/index/index.less', 'src/p/index/index.less');
      this.copy('README.md', 'README.md');
      this.copy('src/c/lib/zepto.js', 'src/c/lib/zepto.js');  
      this.copy('src/p/index/index_zepto.js', 'src/p/index/index.js');
      this.copy('demo/index.html', 'demo/index.html');
    }

  },

  install: function () {
    this.installDependencies();
  }
});
