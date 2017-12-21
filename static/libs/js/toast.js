(function(window,document) {
    function Toast (message,cb){
        this.message=message;
        this.cb=cb;
        this.dom=null;
        this.init()
    }
    Toast.prototype.init=function() {
        var ele=document.getElementById("f_toast");
        if(!!ele)return;
        var insertNode= document.getElementsByTagName('body')[0],
            sNode=document.createElement('div');
        sNode.innerHTML='<div class="f_dialog"><span class="close_dialog"></span><div class="f_text">'+this.message+'</div><input class="f_confirm" type="button" value="确定"></div>'
        this.dom=sNode;
        sNode.className='f_toast';
        sNode.id='f_toast';
        insertNode.appendChild(sNode);
        var self=this;

        this.dom.getElementsByClassName('f_confirm')[0].addEventListener('click',function() {
            self.destroy();
            self.cb&&self.cb();
        });
        this.dom.getElementsByClassName('close_dialog')[0].addEventListener('click',function() {
            self.destroy();
            self.cb&&self.cb();
        })

    };
    Toast.prototype.close=function () {
        self.destroy();
    };
    Toast.prototype.destroy=function() {
        this.dom.parentNode.removeChild(this.dom);
        this.dom=null
    };
    window.Toast=Toast
})(window,document);