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

    /*
      {

        name: 'jQuery-2.1.4(pc，不支持ie6-8)',
        value: 'jquery2'
      },
      {

        name: 'jQuery-1.11.3(pc)',
        value: 'jquery1'
      }
    */
    var prompts = [
      {
        type: 'list',
        name: 'features',
        message: 'Please choose moblie or pc.',
        choices : [{

          name: 'mobile',
          value: 'mobile'
        }
        ]
      }
      
    ];

    // var prompts_v = [
    //   {

    //     type: 'list',
    //     name: 'jquery',
    //     message: 'Please choose jquery version.',
    //     choices : [{

    //       name: 'jquery(1.11.3)',
    //       value: 'jquery1'
    //     },
    //     {
    //       name: 'jquery(2.1.4，不支持ie6-8)',
    //       value: 'jquery2'
    //     }
    //     ]
    //   }
    // ];

    this.prompt(prompts, function (props) {

      function chooseFeature(choice) {

        return props.features.indexOf(choice) !== -1;
      }

      this.isMobile = chooseFeature('mobile');
      // this.isPC = chooseFeature('pc');

      // 选择 jquery 版本
      // if(this.isPC) {

      //   this.prompt(prompts_v, function(choices) {

      //     function chooseVersion(choice) {
      //       return choices.jquery.indexOf(choice) !== -1;
      //     }

      //     this.isJquery1 = chooseVersion('jquery1');
      //     this.isJquery2 = chooseVersion('jquery2');
          
      //     done();
      //   }.bind(this));
      // }
      
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

      this.copy('src/p/index/index.less', 'src/p/index/index.less');
      this.copy('README.md', 'README.md');

      // if(this.isMobile) {
      this.copy('src/c/lib/zepto.js', 'src/c/lib/zepto.js');  
      this.copy('src/p/index/index_zepto.js', 'src/p/index/index.js');
      // } else if(this.isJquery1) {
      //   this.copy('src/c/lib/jquery-1.11.3.min.js', 'src/c/lib/jquery-1.11.3.min.js');
      //    this.copy('src/p/index/index_jquery1.js', 'src/p/index/index.js');
      // } else {
      //   this.copy('src/c/lib/jquery-2.1.4.min.js', 'src/c/lib/jquery-2.1.4.min.js');
      //    this.copy('src/p/index/index_jquery2.js', 'src/p/index/index.js');
      // }
      this.copy('demo/index.html', 'demo/index.html');
    }

  },

  install: function () {
    this.installDependencies();
  }
});
