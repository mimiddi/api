var CuteTool = require("../tools.js");

function ApiGetParentInfo(){
    this.Service = function(version, data, callback){
        var tool = new CuteTool;
        var https = tool.GetHttps();
    
        var url = "https://ouat.buzaishudian.com/api/parents";
        url += "?pages=9999";//先这么写, 再优化
    
        https.Get(url, function(e){
            callback({records:e.data.records});
        })
    }
}

module.exports = ApiGetParentInfo;
