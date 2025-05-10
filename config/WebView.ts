var FileManage = {
  UrlConnect: "/FileManager",
  CountInput: 0,
  ListInput: [],
  FileManageDomain: document.currentScript.src.substring(0, document.currentScript.src.indexOf("/FileManage.js")),

  replace: function (id, opt = null) {

      var selectinput = this.ListInput[this.CountInput] = {
          opt: {
              Muti: false,
              HiddenInput: false,
              Token: ""
          },
          input: null,
          container: null,
          listImage: [],
          CountImage: 0,
          DivAdd: null,

          init: function (id, opt = null) {
              for (x in opt) {
                  this.opt[x] = opt[x];
              }

              var $this = this;
              if (typeof (id) === "string") {
                  this.input = document.getElementById(id);
              }
              else {
                  this.input = id;
              }

              this.input.onchange = function () {
                  $this.OnChange();
              }

              this.container = document.createElement('div');

              //this.input.parentNode.insertBefore(this.container, this.input);
              this.input.insertAdjacentElement("afterend", this.container);
              this.container.className = "SelectImageContainer";

              this.ShowAdd();
              this.OnChange();
          },

          OnChange: function () {
              this.Clear();

              if (this.input.value == null || this.input.value == "") {
                  this.ShowAdd();
              } else {
                  var array = this.input.value.split("|");

                  for (var x in array) {
                      this.AddImage(array[x]);
                  }

                  if (this.opt.Muti) this.ShowAdd();
              }
          },

          ShowAdd: function () {
              var $this = this;

              if (this.DivAdd == null) {
                  this.DivAdd = document.createElement('div');
                  this.DivAdd.className = "SelectAdd";
                  this.DivAdd.innerHTML = "<div><i class=\"fa fa-plus\"></i></div>";

                  this.DivAdd.onclick = function () {

                      FileManage.OpenSelectFile($this.opt.Token, (f) => {
                          $this.CallBack(f.Path);
                          //console.log(f);
                      });


                      //var callbackname = "FileManage.ListInput[" + $this.CountInput + "].CallBack";

                      //var url = FileManage.UrlConnect + "?integration=buttoninject&callback=" + encodeURI(callbackname);

                      //window.open(url, "MsgWindow", "width=830,height=600");
                  }

                  this.container.insertAdjacentElement("afterbegin", this.DivAdd);
              }

              //alert(this.opt["Muti"]);
              this.DivAdd.className = "SelectAdd";
          },

          HiddenAdd: function () {
              this.DivAdd.className = "SelectAdd hidden";
          },

          AddImage: function (img) {
              $paren = this;
              var $this = null;

              var imgclass = $this = this.listImage[this.CountImage] = {
                  Div: null,
                  Src: "",
                  Img: null,
                  closeDiv: null,
                  editDiv: null,

                  init: function (img) {
                      this.Div = document.createElement('div');
                      $paren.DivAdd.insertAdjacentElement("beforebegin", this.Div);

                      this.Div.className = "ItemImage";

                      this.Img = document.createElement('img');
                      this.Div.insertAdjacentElement("afterbegin", this.Img);

                      this.closeDiv = document.createElement('div');
                      this.closeDiv.className = "close";
                      this.closeDiv.innerHTML = "<i class=\"fa fa-close\"></i>";
                      this.Div.insertAdjacentElement("afterbegin", this.closeDiv);

                      this.closeDiv.onclick = function () {
                          $paren.RepMove($this.CountImage);
                      }

                      this.editDiv = document.createElement('div');
                      this.editDiv.className = "edit";
                      this.editDiv.innerHTML = "<i class=\"fa fa-edit\"></i>";
                      this.Div.insertAdjacentElement("afterbegin", this.editDiv);

                      this.editDiv.onclick = function () {
                          FileManage.OpenSelectFile($paren.opt.Token, (f) => {
                              $this.CallBack(f.Path);
                              //console.log(f);
                          });


                          //var callbackname = "FileManage.ListInput[" + $paren.CountInput + "].listImage[" + $this.CountImage + "].CallBack";

                          //var url = FileManage.UrlConnect + "?integration=buttoninject&callback=" + encodeURI(callbackname);

                          //window.open(url, "MsgWindow", "width=830,height=600");
                      }


                      this.SetImage(img);
                  },

                  SetImage: function (img) {
                      this.Src = img;
                      this.Img.src = this.Src + "?crop&height=" + 150;
                  },

                  RepMove: function () {
                      this.Div.remove();
                  },

                  CallBack: function (img) {
                      this.SetImage(img);

                      $paren.UpdateInput();
                  },
              }

              imgclass.CountImage = this.CountImage++;
              imgclass.init(img);

              if (!this.opt.Muti) this.HiddenAdd();
          },

          RepMove: function (x) {
              this.listImage[x].RepMove();
              delete this.listImage[x];

              for (var i = x + 1; i < this.CountImage; i++) {
                  this.listImage[i - 1] = this.listImage[i];
                  this.listImage[i - 1].CountImage = i - 1;
              }
              this.CountImage--;

              if (!this.opt.Muti && this.CountImage == 0) {
                  this.ShowAdd();
              }

              this.UpdateInput();
          },

          Clear: function () {
              for (var i = 0; i < this.CountImage; i++) {
                  this.listImage[i].RepMove();
                  delete this.listImage[i];
              }
              this.CountImage = 0;
          },

          UpdateInput: function () {
              var txt = "";

              for (var i = 0; i < this.CountImage; i++) {
                  if (i != 0) txt += "|";
                  txt += this.listImage[i].Src;
              }

              this.input.value = txt;
          },

          CallBack: function (img) {
              if (this.opt.Muti || this.CountImage == 0) {
                  this.AddImage(img);
                  this.UpdateInput();
              } else {
                  this.listImage[0].CallBack(img);
              }

              if (!this.opt.Muti && this.CountImage > 0) {
                  this.HiddenAdd();
              }
          },
      }

      selectinput.CountInput = this.CountInput++;

      selectinput.init(id, opt);
  },

  OpenFileManage: function (token) {

      var html = `<iframe src="${FileManage.FileManageDomain}/Manage/${token}?closecallback=FileManageClose" frameborder="0" style="width:100%;height:calc(100% - 6px);"></iframe>`;

      var backdrop = document.createElement("div");
      backdrop.className = "FileManage-backdrop";
      backdrop.innerHTML = html;


      function Close() {
          document.body.removeChild(backdrop);
          window.removeEventListener('message', OnMessage);
      }

      function OnMessage(e) {
          if (e.data.type == "FileManageClose" && e.data.token == token ) {
              Close();
          }
      }

      window.addEventListener('message', OnMessage );
      document.body.appendChild(backdrop);

      //window.open(`https://localhost:7004/Manage/${token}`, "MsgWindow", "postwindow,location=0,toolbar=0,menubar=0,scrollbars=yes,resizable=yes,width=830,height=600");
  },

  OpenSelectFile: function (token, callback) {
      if (token == null) return;

      var html = `<iframe src="${FileManage.FileManageDomain}/Manage/${token}?closecallback=FileManageClose&ActionType=Select&ActionCallBack=FileManageActionCallBack" frameborder="0" style="width:100%;height:calc(100% - 6px);"></iframe>`;
      var backdrop = document.createElement("div");
      backdrop.className = "FileManage-backdrop";
      backdrop.innerHTML = html;

      function Close() {
          document.body.removeChild(backdrop);
          window.removeEventListener('message', OnMessage);
      }

      function OnMessage(e) {
          if (e.data.type == "FileManageClose" && e.data.token == token) {
              Close();
          }
          else if (e.data.type == "FileManageActionCallBack" && e.data.token == token) {
              if (typeof callback === "function") {
                  callback(e.data);
                  Close();
              }
          }
      }

      window.addEventListener('message', OnMessage);
      document.body.appendChild(backdrop);
  },
}

var OpenFileManage = FileManage.OpenFileManage;


window.addEventListener('load', function () {
  var elms = document.body.querySelectorAll("textarea[data-ckediter='true']")
  for (var i = 0; i < elms.length; i++) {
      var elm = elms[i];
      var opt = {
          Token: elm.getAttribute("token")
      }
      CKEDITOR.replace(elm, opt);
      //FileManage.replace(elm, opt);
  }
})