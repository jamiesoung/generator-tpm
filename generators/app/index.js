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

    var prompts = [{
      type: 'list',
      name: 'features',
      message: 'Would you like to enable this option?',
      choices : [{

        name: 'zepTo(m)',
        value: 'zepto'
      },
      {

        name: 'jQuery-2.1.4(pc，不支持ie6-8)',
        value: 'jquery2'
      },
      {

        name: 'jQuery-1.11.3(pc)',
        value: 'jquery1'
      }
      ]
    }];

    this.prompt(prompts, function (props) {

      function hasChoiced(choice){

        return props.features.indexOf(choice) !== -1;
      }

      this.isZepto = hasChoiced('zepto');
      this.isJquery1 = hasChoiced('jquery1');
      this.isJquery2 = hasChoiced('jquery2');

      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: {

    app: function(){

      var dir = process.env.PWD;

      console.log('path' + dir);
      this.template('_package.json', path.join(dir, 'package.json'));
      this.template('gulpfile.js', 'gulpfile.js');
      this.template('_gitignore', '.gitignore');

      this.mkdir('src');
      this.mkdir('demo');
      this.mkdir('build');
      this.mkdir('src/c');
      this.mkdir('src/p');
      this.mkdir('src/p/index');
      this.mkdir('src/c/lib');

      this.copy('src/p/index/index.js', 'src/p/index/index.js');
      this.copy('src/p/index/index.less', 'src/p/index/index.less');

      if(this.isZepto) {
        this.copy('src/c/lib/zepto.js', 'src/c/lib/zepto.js');  
      } else if(this.isJquery1) {
        this.copy('src/c/lib/jquery-1.11.3.min.js', 'src/c/lib/jquery-1.11.3.min.js');
      } else {
        this.copy('src/c/lib/jquery-2.1.4.min.js', 'src/c/lib/jquery-2.1.4.min.js');
      }

      this.copy('demo/index.html', 'demo/index.html');
    }

  },

  install: function () {
    this.installDependencies();
  }
});
