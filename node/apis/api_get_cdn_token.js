var CuteTool = require("../tools.js");

function ApiGetCdnToken(){
    var tool = new CuteTool;
    var https = tool.GetHttps();
    var config = tool.GetConfig();
    var response = tool.GetResponse();
    var logger = tool.GetLogger();
    this.Service = function(version, data, callback){
        var url = config.GetCdnTokenUrl();
        url += "?appid=" + data.appid;
        url += "&file=" + data.fileName;
        url += "&type=image";

        https.Get(url, function(e){
            logger.debug(e);
            try{
                e = JSON.parse(e);
            }catch(err){
                e = {token:"", downloadUrl:""}
            }
            callback(response.Succ({cdn:{token:e.data.token, downloadUrl:e.data.downloadUrl, key:e.data.key}}));
        });       
    }
}

module.exports = ApiGetCdnToken;