// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery3
//= require popper
//= require bootstrap-sprockets
//= require rails-ujs
//= require_tree .

var MAX_WIDTH = 1400;
var MAX_HEIGHT = 1000;

$(document).ready(function() {
    var builder = (new CouponBuilder()).init();
});

function CouponBuilder() {
    var self = this;

    this.canvas = null;
    this.image = null;
    this.text = null;
    this.saveButton = $('#save-image-button');

    this.init = function () {
        self.canvas = new fabric.Canvas('main-canvas', { preserveObjectStacking: true });
        self.canvas.setBackgroundColor('white', emptyCallback);

        this.controls = new CouponControls(self.canvas);

        self.saveButton.get(0).addEventListener('click', self.onSave, false);

        self.canvas.setHeight(self.controls.coupon.getHeight());
        self.canvas.setWidth(self.controls.coupon.getWidth());

        fabric.Image.fromURL('/assets/coupon.gif', self.processImage);
        self.canvas.on('object:modified', function (opt) {
            if (opt.target.id === 'img') {
                self.onImageModified(opt);
            }
        });

        self.text = self.generateTextBox();

        self.controls.image.upload.on('change', function (e) {
            var fr = new FileReader();
            var imgObj = new Image();
            fr.onload = function () {
                imgObj.onload = function () {
                    self.processImage(new fabric.Image(imgObj));
                };
                imgObj.src = fr.result;
            };

            fr.readAsDataURL(event.target.files[0]);
        });

        self.controls.image.button.on('click', function () {
            fabric.Image.fromURL(self.controls.image.url.val(), self.processImage);
        });

        return self;
    };

    this.onSave = function () {
        this.href = self.canvas.toDataURL({
            format: 'png',
            quality: 0.8
        });
        this.download = 'canvas.png';
    };

    this.generateTextBox = function () {
        var text = new fabric.Textbox('ENTER YOUR TEXT HERE', {
            top: 5,
            left: 5,
            width: 200,
            height: 50,
            fontSize: 20,
            textAlign: 'center',
            fontFamily: 'Arial'
        });

        text.id = 'text';

        self.canvas.centerObject(text);
        self.canvas.bringToFront(text);
        self.canvas.add(text);

        return text;
    };

    this.processImage = function (imgObj) {
        if (self.image !== null) {
            self.canvas.remove(self.image);
            self.canvas.renderAll();
        }

        self.image = imgObj;
        self.image.set({
            angle: 0, padding: 10, corner: 10
        });

        self.canvas.add(self.image);
        self.canvas.centerObject(self.image);
        self.canvas.sendBackwards(self.image);
        self.image.id = 'img';
        self.controls.image.init(self.image);
        self.controls.text.init(self.text, self.canvas, self.image);
        self.canvas.renderAll();
    };

    this.onImageModified = function (opt) {
        self.canvas.sendToBack(self.image);
    };
}

function CouponControls(canvas) {
    this.coupon = new CouponControl(canvas);
    this.text = new TextControl();
    this.image = new ImageControl();
}

function CouponControl(canvas) {
    var self = this;

    this.canvas = canvas;
    this.width = $('#canvas-width');
    this.height = $('#canvas-height');
    this.wrapper = $('#canvas-wrapper');

    this.getWidth = function () {
        return parseFloat(self.width.val());
    };

    this.getHeight = function () {
        return parseFloat(self.height.val());
    };

    this.updateWidth = function () {
        var val = self.getWidth();
        if (val + 10 > MAX_WIDTH) {
            self.wrapper.width(MAX_WIDTH);
            self.canvas.setWidth(MAX_WIDTH);
            self.width.val(MAX_WIDTH);
        } else {
          self.wrapper.width(val + 10 < window.innerWidth ? val + 10 : window.innerWidth - 20);
          self.canvas.setWidth(val);
        }

        self.canvas.renderAll();
    };

    this.updateHeight = function () {
        var val = self.getHeight();
        if (val + 10 > MAX_HEIGHT) {
            self.wrapper.height(MAX_HEIGHT);
            self.canvas.setHeight(MAX_HEIGHT);
            self.height.val(MAX_HEIGHT);
        } else {
            self.wrapper.height(val + 10);
            self.canvas.setHeight(val);
        }

        self.canvas.renderAll();
    };

    this.width.on('change', function (e) { return self.updateWidth();});
    this.height.on('change', function (e) { return self.updateHeight();});
}

function TextControl() {
    var self = this;

    this.box = null;
    this.image = null;
    this.textBackground = $('#text-background-color');
    this.text = $('#font-text');
    this.font = $('#font-type');
    this.size = $('#font-size');
    this.color = $('#font-color');
    this.notification = $('#font-notification');
    this.opacity = $('#text-background-opacity');

    this.init = function (box, canvas, image) {
        self.box = box;
        self.image = image;
        canvas.on('text:changed', self.onTextChanged);
        self.text.on('keyup', self.onControlTextChanged);
        self.font.on('change', self.onTypeChanged);
        self.size.on('change', self.onSizeChanged);
        self.color.on('change', self.onColorChanged);
        self.opacity.on('change', self.onSizeChanged);
        self.textBackground.on('change', self.onColorChanged);

        this.onTypeChanged();

    };

    function hexToRgbA(hex){
        var c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
        }
        throw new Error('Bad Hex');
    }

    this.opacity.on('change', function() {
      self.box.set('opacity', parseFloat(self.opacity.val()));
    });

    this.textBackground.on('change', function () {
      self.box.set('backgroundColor', self.textBackground.val());
    });


    this.onSizeChanged = function () {
        self.box.set('fontSize', self.size.val());
        self.box.canvas.renderAll();
    };

    this.onColorChanged = function () {
        self.box.setColor(self.color.val());
        self.box.canvas.renderAll();
    };

    this.formatTextBox = function () {
        var text = self.box;
        var imageArea = (self.image.width * self.image.scaleX) * (self.image.height * self.image.scaleY);
        if (text.width * text.height > (imageArea / 100) * 20) {
            self.notification.show();
        } else {
            self.notification.hide();
        };
    };

    this.onTypeChanged = function () {
        self.box.set('fontFamily', self.font.val());
        self.box.canvas.renderAll();

    };

    this.onTextChanged = function (opt) {
        self.formatTextBox(opt);
        self.text.val(self.box.text);
    };

    this.onControlTextChanged = function (e) {
        self.box.text = self.text.val();
        self.formatTextBox();
        self.box.canvas.renderAll();

    };

}

function ImageControl() {
    var self = this;

    this.image = null;
    this.upload = $('#image-upload');
    this.url = $('#image-url');
    this.button = $('#image-get');

    this.init = function (image) {
        self.image = image;
    };
}


function emptyCallback() {}
